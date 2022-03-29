import puppeteer, { 
    BrowserConnectOptions, 
    BrowserLaunchArgumentOptions,
    LaunchOptions, 
    Page, 
    Product 
} from "puppeteer";
import { InputParameters } from "../models/PupperteerModel";

const setInputAction = async (page: Page, inputOptions: InputParameters) => {
    const {usernameTag, passwordTag, buttonTag} = inputOptions;
    const tags = [usernameTag, passwordTag];
    for(let i = 0; i < tags.length; i+=1) {
        await page.waitForSelector(tags[i].name);
        await page.type(
            tags[i].name, 
            tags[i]?.value ?? "" , 
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