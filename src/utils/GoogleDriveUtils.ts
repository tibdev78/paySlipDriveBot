import { PassThrough } from 'stream'
import { drive_v3, google } from 'googleapis';
import { GaxiosPromise } from 'googleapis/build/src/apis/abusiveexperiencereport';
import { DriveClient, PartialDriveFile, SaveFileFunctionParams, SearchFolderFunctionParams } from '../models/GoogleDrive';

const launchDriveClient = (clientOptions: DriveClient) => {
    try {
        const client = new google.auth.OAuth2(clientOptions.clientId, clientOptions.clientSecret, clientOptions.redirectUri);
        client.setCredentials({refresh_token: clientOptions.refreshToken});
        return google.drive({
            version: 'v3',
            auth: client
        })
    } catch(err) {
        throw new Error(err)
    }
};

const searchFolder = async (driveClient: drive_v3.Drive, options: SearchFolderFunctionParams): Promise<PartialDriveFile | null> => {
    try {
        const folderParent = await driveClient.files.list(
            {
                q: `mimeType='application/vnd.google-apps.folder' and name='${options.folderParentName}'`,
                fields: 'files(id, name)',
            }
        )
        const folderParentData = folderParent.data?.files[0] ?? null
        if(options.subFolderParentName) {
            const subFolderParent = await driveClient.files.list({
                q: `'${folderParentData?.id ?? 0}' in parents`,
                fields: 'files(id, name)'
            });
            return subFolderParent.data?.files
                .find(oSubFolder => oSubFolder.name === options.subFolderParentName) ?? null;
        }
        return folderParentData;
    } catch(err) {
        throw new Error(err);
    }
}

const saveFile = async (driveClient: drive_v3.Drive, fileOptions: SaveFileFunctionParams): GaxiosPromise<drive_v3.Schema$File> => {
    try {
        let bufferStream = new PassThrough();
        bufferStream.end(fileOptions.bufferData);
        return await driveClient.files.create({
            requestBody: {
                name: fileOptions.fileName,
                mimeType: fileOptions.fileMimeType,
                parents: fileOptions.folderId ? [fileOptions.folderId] : []
            },
            media: {
                mimeType: fileOptions.fileMimeType,
                body: bufferStream
            }
        })
    } catch(err) {
        throw new Error(err);
    }
}


export { launchDriveClient, saveFile, searchFolder }