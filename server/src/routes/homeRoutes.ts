import { Router, Request, Response } from "express";
import axios from "axios";
import bcrypt from "bcrypt";
import { createMongoDBConnection } from "../shared/mongodbConfig";
import { UserInterface } from "../interfaces/interfaces";

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
    const db = await createMongoDBConnection();
    const users = db.collection("users");
    let allUsers = await users.find().toArray();
    // console.log(req.body);
    // console.log(req.body.email);
    res.json(allUsers);
  } catch (error) {
    console.log(error);
  }
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const db = await createMongoDBConnection();
    const users = db.collection("users");

    const newUser: UserInterface = {
      email: req.body.email,
      password: req.body.password,
    };

    const insertNewUserResponse = await users.insertOne(newUser);

    res.json(insertNewUserResponse);
  } catch (error) {
    console.log(error);
  }
});

export default router;
