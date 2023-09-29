import type { AWS } from "@serverless/typescript";

import ec2list from "@functions/ec2/list";
import google from "@functions/auth/google";

const serverlessConfiguration: AWS = {
  service: "api",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-domain-manager",
    "serverless-dotenv-plugin",
  ],
  useDotenv: true,
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  resources: {
    Resources: {
      ec2listRole: {
        Type: "AWS::IAM::Role",
        Properties: {
          RoleName: "ec2listRole",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: { Service: "lambda.amazonaws.com" },
                Action: "sts:AssumeRole",
              },
            ],
          },
          Policies: [
            {
              PolicyName: "ec2listPolicy",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: [
                      "logs:CreateLogGroup",
                      "logs:CreateLogStream",
                      "logs:PutLogEvents",
                      "logs:TagResource",
                    ],
                    Resource: [
                      {
                        "Fn::Join": [
                          ":",
                          [
                            "arn:aws:logs",
                            { Ref: "AWS::Region" },
                            { Ref: "AWS::AccountId" },
                            "log-group:/aws/lambda/*:*:*",
                          ],
                        ],
                      },
                    ],
                  },
                  {
                    Effect: "Allow",
                    Action: ["ec2:DescribeInstances"],
                    Resource: ["*"],
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
  // import the function via paths
  functions: { google, ec2list },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node18",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    domain: {
      prod: "${env:DOMAIN}",
    },
    subdomain: {
      prod: "${env:SUBDOMAIN}",
    },
    customDomain: {
      domainName: "${self:custom.subdomain.${sls:stage}}",
      basePath: "v1",
      stage: "${sls:stage}",
      certificateName: "${self:custom.domain.${sls:stage}}",
      createRoute53Record: true,
    },
  },
};

module.exports = serverlessConfiguration;
