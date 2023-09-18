import schema from "./schema";
import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "auth/google",
        request: {
          schemas: {
            "application/json": schema,
          },
        },
        cors: {
          origin: process.env.FRONTEND_URL,
          headers: ["*"],
          allowCredentials: true,
        },
      },
    },
  ],
};
