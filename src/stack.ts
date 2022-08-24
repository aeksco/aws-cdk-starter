import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as events from "aws-cdk-lib/aws-events";
import { Construct } from "constructs";
import * as apigateway from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import * as targets from "aws-cdk-lib/aws-events-targets";

// // // //

export class HelloCdkStack extends cdk.Stack {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        // // // //
        // Provision S3 bucket to store screenshots
        // Doc: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-s3-readme.html#logging-configuration
        const screenshotsBucket: s3.Bucket = new s3.Bucket(
            this,
            "hello-cdk-screenshots",
            {
                removalPolicy: RemovalPolicy.DESTROY,
            }
        );

        // // // //
        // Provision web-scraper lambda
        const webScraperLambda = new lambda.Function(this, "webScraperLambda", {
            code: new lambda.AssetCode("src/web-scraper"),
            handler: "lambda.handler",
            runtime: lambda.Runtime.NODEJS_12_X,
            timeout: cdk.Duration.seconds(300),
            memorySize: 1024,
            environment: {
                S3_BUCKET_NAME: screenshotsBucket.bucketName,
            },
        });

        // Grant permissions for webScraperLambda to have read/write access to screenshotsBucket
        screenshotsBucket.grantReadWrite(webScraperLambda);

        // // // //
        // Setup cron schedule trigger for webScraperLambda
        const rule = new events.Rule(this, "hello-cdk-event-rule", {
            schedule: events.Schedule.expression("rate(1 minute)"),
        });

        // Adds webScraperLambda as target for scheduled rule
        rule.addTarget(new targets.LambdaFunction(webScraperLambda));

        // // // //
        // Provision api-endpoint lambda
        const apiEndpointLambda = new lambda.Function(this, "api-endpoint", {
            code: new lambda.AssetCode("src/api-endpoint"),
            handler: "lambda.handler",
            runtime: lambda.Runtime.NODEJS_16_X,
            environment: {
                S3_BUCKET_NAME: screenshotsBucket.bucketName,
            },
        });

        // Grant permissions for apiEndpointLambda to have read/write access to screenshotsBucket
        screenshotsBucket.grantReadWrite(apiEndpointLambda);

        // Setup integration to connect api-endpoint lambda to API Gateway
        const endpointIntegration = new HttpLambdaIntegration(
            "HelloCdkLambdaIntegration",
            apiEndpointLambda
        );

        // Provision HTTP API in API Gateway
        const httpApi = new apigateway.HttpApi(this, "HelloCdkHttpApi");

        // Add GET /screenshots API route
        httpApi.addRoutes({
            path: "/screenshots",
            methods: [apigateway.HttpMethod.GET],
            integration: endpointIntegration,
        });

        // Output the screenshots URL
        new CfnOutput(this, "apiUrl", {
            value: httpApi.url + "screenshots" || "n/a",
        });
    }
}
