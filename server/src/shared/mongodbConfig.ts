import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI: string = process.env.MONGODB_URI as string;
const DATABASE_NAME: string = process.env.DATABASE_NAME as string;

const client = new MongoClient(MONGODB_URI);

export async function createMongoDBConnection() {
  await client.connect();
  const database = client.db(DATABASE_NAME);
  return database;
}
// ACCORDING TO THE RESULTS OF A VERY SHALLOW RESEARCH,
// IT DOES NOT SEEM TO BE NECESSARY TO CLOSE THE CLIENT 👇🏻
// export async function closeMongoDBClient(){
//     client.close()
// }
