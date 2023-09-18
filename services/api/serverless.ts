import type { AWS } from "@serverless/typescript";

import hello from "@functions/hello";
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
  // import the function via paths
  functions: { hello, google },
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
