import * as chromium from "chrome-aws-lambda";
import * as fs from "fs";
import * as AWS from "aws-sdk";
const s3 = new AWS.S3();
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "";

// // // //

// Define "delay" function
function delay(timeout: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, timeout);
    });
}

// // // //

export const handler = async (
    event: any = {},
    context: any = {}
): Promise<any> => {
    // Log start message
    console.log("web-scraper -> start");
    console.log(event);

    // Defines the start URL for the script
    const url =
        "https://www.bestbuy.com/site/sony-playstation-5-digital-edition-console/6430161.p?skuId=6430161";

    // Log URL
    console.log("Start URL:");
    console.log(url);

    // Define variable to assign the Puppeteer browser to
    let browser = null;

    try {
        // Launch Puppeteer browser
        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });

        // Defines new page
        let page = await browser.newPage();

        // Navigate to URL
        await page.goto(url, { waitUntil: "domcontentloaded" });

        // Delay 5 seconds
        await delay(5000);

        // Log "taking screenshot" message
        console.log("Taking screenshot");

        // Take screenshot
        const screenshotFilepath = `/tmp/${Date.now()}-screenshot.png`;
        await page.screenshot({ path: screenshotFilepath });

        // Log "captured" message
        console.log("Captured screenshot");

        // Upload screenshot to S3
        await new Promise((resolve, reject) => {
            s3.upload({
                Bucket: S3_BUCKET_NAME,
                Key: screenshotFilepath,
                Body: fs.readFileSync(screenshotFilepath),
            }).send((err) => {
                // Logs + rejects error
                if (err) {
                    console.log(`upload-file --> ERROR`);
                    console.log(err);
                    reject(err);
                    return;
                }

                console.log(
                    `upload-file --> SUCCESS --> ${screenshotFilepath}`
                );
                resolve(true);
            });
        });

        // await Promise.all(SCREENSHOTS.map((path) => uploadToS3({ path })));

        // Log "Done" message
        console.log("web-scraper -> done!");
    } catch (error) {
        // Fail on error
        return context.fail(error);
    } finally {
        // Close the puppeteer browser before exiting
        if (browser !== null) {
            await browser.close();
        }
    }

    // Logs "shutdown" statement
    console.log("web-scraper -> shutdown");
    return context.succeed(true);
};
