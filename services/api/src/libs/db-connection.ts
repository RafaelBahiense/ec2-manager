import { MongoClient, ServerApiVersion, Db } from "mongodb";

let conn: Db;

export async function connect() {
  if (conn == null) {
    const client = new MongoClient(process.env.MONGO_URI, {
        serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
        }
    });

    await client.connect();
    conn = client.db("main");
  }

  return conn;
};
