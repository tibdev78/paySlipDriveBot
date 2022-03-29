import { drive_v3 } from 'googleapis';
import { searchFolder, saveFile } from './utils/GoogleDriveUtils';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { DriveData, PaySlipInDrive } from './models/FileData';
import { getPage, setInputAction } from './utils/PupperteerUtils';

const launchScript = async (googleDriveInstance: drive_v3.Drive, pageLink: string) => {
    try {
        const filePath = join(__dirname, "data", 'driveData.json');
        const fileData: DriveData = JSON.parse(readFileSync(filePath).toString());
        const folder = await searchFolder(googleDriveInstance, {
            folderParentName: 'company',
            subFolderParentName: 'ausy'
        });
        const page = await getPage({ headless: true });
        await page.goto(pageLink, { waitUntil: 'domcontentloaded' });
        await setInputAction(
            page,
            {
                usernameTag: { name: 'input[name=_username]', value: process.env.COFFREO_USERNAME },
                passwordTag: { name: 'input[name=_password]', value: process.env.COFFREO_PASSWORD },
                buttonTag: { name: 'button[type="submit"]' },
                waitSelectorName: '.DocumentsScrollViewItem'
            }
        )
        const url = await page.$$(".DocumentsScrollViewItem");
        const datasOnPagePromised= url.map(async (data, i) => {
            const documentLink = await data.$eval('.DocumentMosaicViewItem__link', node => node.getAttribute('href'))
            const texts = await data.$eval('.DocumentMosaicViewItem', node => (node as HTMLElement).innerText);
            const [, filename] = texts.split('\n');
            const [year, month] = texts.match(/[0-9]+/g);
            return {
                link : pageLink.concat(`${documentLink}`),
                filename: filename,
                period: year.concat(`-${month}`)
            }
        });
        const datasOnPage: Array<PaySlipInDrive> = await Promise.all(datasOnPagePromised);
        const filteredDatasNoExist = datasOnPage.filter(oDataOnPage => !fileData.paySlipInDrive.some(oDataDrive => oDataDrive.period === oDataOnPage.period));
        if(filteredDatasNoExist.length > 0) {
            for(const oFilteredDataNoExist of filteredDatasNoExist) {
                await page.goto(oFilteredDataNoExist.link, { waitUntil: 'domcontentloaded' });
                await page.waitForSelector('.document');
                const response = await page.waitForResponse(response => response.headers()['content-type'] === 'application/pdf')
                const bufferData = await response.buffer();
                await saveFile(googleDriveInstance, {
                    fileName: oFilteredDataNoExist.filename,
                    fileMimeType: 'application/pdf',
                    bufferData: bufferData,
                    folderId: folder?.id ?? ''
                });
                await page.goBack();
            }
            writeFileSync(filePath, JSON.stringify({...fileData, paySlipInDrive: [...fileData.paySlipInDrive, ...filteredDatasNoExist]}))
        }
        console.info('process done')
    } catch(err) {
        console.error(err);
    }
}

export default launchScript;