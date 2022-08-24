import * as AWS from "aws-sdk";
const s3 = new AWS.S3();
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "";

// // // //

export const handler = async (
    event: any = {},
    context: any = {}
): Promise<any> => {
    // Log start message
    console.log("api-endpoint -> start");
    console.log(JSON.stringify(event, null, 4));

    try {
        // Read contents of S3_BUCKET
        const items = s3
            .listObjects({
                Bucket: S3_BUCKET_NAME,
            })
            .promise();

        // Log retrieved items
        console.log("items from S3!");
        console.log(items);

        // Logs "shutdown" statement
        console.log("api-endpoint -> shutdown");

        // Return items as JSON
        return context.succeed({ status: "Great success!" });
    } catch (error) {
        return context.fail(error);
    } finally {
        console.log("Finally!");
    }
};
