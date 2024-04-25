import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

import { Router, Request, Response } from "express";
import { MongoClient } from "mongodb";

const router = Router();
const MONGODB_URL: string = process.env.MONGODB_URL as string;

const client = new MongoClient(MONGODB_URL);

async function test() {
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db("local");
  const collection = db.collection("testing");
  let temp = await collection.findOne()
  console.log(temp)
}

// router.get("/", (req: Request, res: Response) => {
//   axios
//     .get("https://jsonplaceholder.typicode.com/posts/1")
//     .then((response) => {
//       // console.log(response.data);
//       res.json(response.data);
//     })
//     .catch((error) => console.log(error));
// });

test()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());

export default router;
