import puppeteer, { 
    BrowserConnectOptions, 
    BrowserLaunchArgumentOptions, 
    ElementHandle, 
    LaunchOptions, 
    Page, 
    Product 
} from "puppeteer";
import { InputParameters } from "../models/PupperteerModel";

const setInputAction = async (page: Page, inputOptions: InputParameters) => {
    const {usernameTag, passwordTag, buttonTag} = inputOptions;
    for(let tag of [usernameTag, passwordTag]) {
        await page.waitForSelector(tag.name);
        await page.type(
            tag.name, 
            tag?.value ?? "" , 
            { delay: inputOptions?.delay ?? 100 }
        );
    }
    await page.click(buttonTag.name);
    await page.waitForSelector(inputOptions.waitSelectorName);
}

const getPage = async (
    options?: LaunchOptions & BrowserLaunchArgumentOptions & BrowserConnectOptions & {
        product?: Product;
        extraPrefsFirefox?: Record<string, unknown>;
    }
) => {
   try {
    const browser = await puppeteer.launch(options);
    return await browser.newPage();
   } catch(err) {
       throw new Error(err);
   }
}

export { setInputAction, getPage }