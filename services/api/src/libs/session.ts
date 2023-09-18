import { APIGatewayProxyResult } from "aws-lambda";

export function createSessionCookie(
  response: APIGatewayProxyResult,
  sessionId: string
) {
  const expirationDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 7); // 7 days from now
  const expirationDateString = expirationDate.toUTCString();
  const cookie = `session=${sessionId}; HttpOnly; Secure; SameSite=None; expires=${expirationDateString}`;
  const existingHeaders = response.headers || {};
  response.headers = {
    ...existingHeaders,
    "set-cookie": cookie,
  };

  return response;
}
