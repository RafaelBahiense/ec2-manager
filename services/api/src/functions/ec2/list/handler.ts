import {
  EC2Client,
  DescribeInstancesResult,
  DescribeInstancesCommand,
} from "@aws-sdk/client-ec2";

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";

const ec2 = new EC2Client({});

const ec2list: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const headers = event.headers;

  const command = new DescribeInstancesCommand({});
  const result = await ec2.send(command);
  console.log(result);

  return formatJSONResponse({ headers, result });
};

export const main = middyfy(ec2list);
