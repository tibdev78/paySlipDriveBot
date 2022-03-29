type PartialDriveFile = {
    id?: string;
    name?: string;
};
  
type SearchResultResponse = {
    kind: 'drive#fileList';
    nextPageToken: string;
    incompleteSearch: boolean;
    files: Array<PartialDriveFile>;
};

type DriveClient = {
    clientId: string;
    clientSecret: string; 
    redirectUri: string; 
    refreshToken: string
}

type SaveFileFunctionParams = {
    fileName: string,
    bufferData: Buffer,
    fileMimeType: string,
    folderId?: string
}

type SearchFolderFunctionParams = {
    folderParentName: string, 
    subFolderParentName?: string
}

export { 
    PartialDriveFile, 
    SearchResultResponse, 
    DriveClient, 
    SaveFileFunctionParams, 
    SearchFolderFunctionParams 
};