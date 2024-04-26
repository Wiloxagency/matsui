import { Router, Request, Response } from "express";
import axios from "axios";
import bcrypt from "bcrypt";
import {
  closeMongoDBClient,
  createMongoDBConnection,
} from "../shared/mongodbConfig";

const router = Router();

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

router.post("/login", async (req: Request, res: Response) => {
  try {
    // await client.connect();
    // console.log("Connected successfully to server");
    const db = await createMongoDBConnection();
    const collection = db.collection("users");
    let allUsers = await collection.find().toArray();

    console.log(req.body);
    console.log(req.body.email);
    res.json(allUsers);
    closeMongoDBClient();
  } catch (error) {
    console.log(error);
  }
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
  } catch {}

  res.json({ message: "Register endpoint working" });
});

export default router;
