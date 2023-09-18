import { OAuth2Client } from "google-auth-library";

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { connect } from "@libs/db-connection";
import schema from "./schema";
import { createSessionCookie } from "@libs/session";

const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID);

const google: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const { token } = event.body;
  const ticket = await oAuth2Client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();

  const db = await connect();
  let statusCode = 200;

  let user = await db
    .collection("users")
    .findOneAndUpdate({ email }, { $set: { name, picture } });

  if (!user) {
    await db.collection("users").insertOne({ name, email, picture });
    user = await db.collection("users").findOne({ email });
    statusCode = 201;
  }

  const res = formatJSONResponse(user);
  res.statusCode = statusCode;
  return createSessionCookie(res, email);
};

export const main = middyfy(google);
