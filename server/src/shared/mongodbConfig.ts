import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URL: string = process.env.MONGODB_URL as string;
const DATABASE_NAME: string = process.env.DATABASE_NAME as string;

const client = new MongoClient(MONGODB_URL);

export async function createMongoDBConnection() {
  await client.connect();
  const database = client.db(DATABASE_NAME);
  return database;
}

export async function closeMongoDBClient(){
    client.close()
}