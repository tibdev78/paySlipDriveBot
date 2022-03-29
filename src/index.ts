import dotenv from 'dotenv';
import PaySlipBotScript from './app';
import { launchDriveClient } from './utils/GoogleDriveUtils';

dotenv.config();

const googleDriveInstance = launchDriveClient({
    clientId: process.env.GOOGLE_DRIVE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET, 
    redirectUri: process.env.GOOGLE_DRIVE_REDIRECT_URI, 
    refreshToken: process.env.GOOGLE_DRIVE_REFRESH_TOKEN
});

PaySlipBotScript(googleDriveInstance, process.env.PAGE_LINK);

