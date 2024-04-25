import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

import { Router, Request, Response } from "express";
import { MongoClient } from "mongodb";

const router = Router();
const MONGODB_URL: string = process.env.MONGODB_URL as string;

const client = new MongoClient(MONGODB_URL);

router.get("/", (req: Request, res: Response) => {
  //   axios
  //     .get("https://jsonplaceholder.typicode.com/posts/1")
  //     .then((response) => {
  //       // console.log(response.data);
  //       res.json(response.data);
  //     })
  //     .catch((error) => console.log(error));
  res.json({ message: "Working" });
});

router.get("/login", (req: Request, res: Response) => {
  async function test() {
    try {
      await client.connect();
      console.log("Connected successfully to server");
      const db = client.db("local");
      const collection = db.collection("testing");
      let temp = await collection.findOne();
      res.json(temp);
    } catch (error) {
      console.log(error);
    }
  }

  test().finally(() => client.close());
});

router.post("/register", (req: Request, res: Response) => {
  res.json({ message: "Register endpoint working" });
});

export default router;
