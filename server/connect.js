import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
let EventDatabase;

export default {
  connectToServer: () => {
    EventDatabase = client.db("EventCalendarProject");
  },
  getDb: () => {
    return EventDatabase;
  },
};
