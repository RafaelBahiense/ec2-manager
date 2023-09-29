import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  role: "ec2listRole",
  events: [
    {
      http: {
        method: "get",
        path: "ec2/list",
        cors: {
          origin: process.env.FRONTEND_URL,
          headers: ["*"],
          allowCredentials: true,
        },
      },
    },
  ],
};
