import { App } from "aws-cdk-lib";
import { HelloCdkStack } from "./src/stack";

// // // //

// Defines new CDK App
const app = new App();

// Instantiates the HelloCdkStack
new HelloCdkStack(app, "HelloCdkStack");
app.synth();
