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
  _event
) => {
  const command = new DescribeInstancesCommand({});
  const result: DescribeInstancesResult = await ec2.send(command);

  const filteredInstances = result.Reservations?.flatMap((reservation) =>
    reservation.Instances.map((instance) => ({
      InstanceId: instance.InstanceId,
      InstanceType: instance.InstanceType,
      LaunchTime: instance.LaunchTime,
      State: instance.State.Name,
      PrivateIpAddress: instance.PrivateIpAddress,
    }))
  );

  return formatJSONResponse({
    instances: filteredInstances,
  });
};

export const main = middyfy(ec2list);
