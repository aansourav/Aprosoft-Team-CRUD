import { MongoClient, type Db } from "mongodb";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://aansourav:1@cluster0.ykfs3rs.mongodb.net/aprosoft?retryWrites=true&w=majority";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db("aprosoft");

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
