# PaySpliDriveBot

Bot to send your paySlip on your Google drive

## Utilisation

If you are interested in using this project, you need to perform several steps:
- Create a google project
- Activate google drive
- create Oauth credentials
- get a refresh token in the oauthplayground redirect link
- Create an .env file on the root of the project and set the Environment variable.
- Create a data folder in src folder, then driveData.json file in data folder
- Install packages
- tap yarn dev 

.env file :
```shell
# Google
GOOGLE_DRIVE_CLIENT_ID=xxx
GOOGLE_DRIVE_CLIENT_SECRET=xxxx
GOOGLE_DRIVE_REDIRECT_URI=https://developers.google.com/oauthplayground
GOOGLE_DRIVE_REFRESH_TOKEN=xxxx

# application
PAGE_LINK=https://www.coffreo.com/
COFFREO_USERNAME=xxxx
COFFREO_PASSWORD=xxxx
```

## Warning!!
- this project was designed specifically for the coffreo site, so if you are using another site for payslips, you need to rewrite code that is relevant to your needs, but my functions in the utils folder can help you as they are designed for global use.