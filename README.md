# aws-cdk-starter

:briefcase: A starter kit for provisioning infrastructure on AWS. Built with AWS CDK + TypeScript.

Includes example implementation for the following:

1. Launch Puppeteer in Lambda
2. Navigate to web page
3. Take screenshot
4. Upload screenshot to S3
5. Expose screenshots via API

**Getting Started**

Run the following commands to install dependencies, build the CDK stack, and deploy the CDK Stack to AWS.

```
yarn install
yarn build
cdk bootstrap
cdk deploy
```

### Scripts

-   `yarn install` - installs dependencies
-   `yarn build` - builds the production-ready CDK Stack
-   `yarn test` - runs Jest
-   `yarn prettify` - run prettier against the source files
-   `cdk bootstrap` - bootstraps AWS Cloudformation for your CDK deploy
-   `cdk deploy` - deploys the CDK stack to AWS

**Notes**

-   Includes very basic tests with Jest.

**Built with**

-   [TypeScript](https://www.typescriptlang.org/)
-   [Jest](https://jestjs.io)
-   [AWS CDK](https://aws.amazon.com/cdk/)
-   [AWS API Gateway](https://aws.amazon.com/api-gateway/)
-   [AWS Lambda](https://aws.amazon.com/lambda/)

**Additional Resources**

-   [CDK API Reference](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html)
-   [CDK TypeScript Reference](https://docs.aws.amazon.com/cdk/api/latest/typescript/api/index.html)
-   [CDK Assertion Package](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/assert)
-   [awesome-cdk repo](https://github.com/eladb/awesome-cdk)

**License**

Opens source under the MIT License.

Built with :heart: by [aeksco](https://twitter.com/aeksco)
