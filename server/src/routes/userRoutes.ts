import { Router, Request, Response } from "express";
import { createMongoDBConnection } from "../shared/mongodbConfig";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const users = db.collection("users");
  const allUsers = await users.find().toArray();
  res.json(allUsers);
});

router.put("/", async (req: Request, res: Response) => {
  res.json("Update user endpoint");
});

router.get("/:id", async (req: Request, res: Response) => {});

export default router;
