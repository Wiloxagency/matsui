import { Router, Request, Response } from "express";
import { createMongoDBConnection } from "../shared/mongodbConfig";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const users = db.collection("users");
  const allUsers = await users.find().toArray();
  res.json(allUsers);
});

router.get("/:id", async (req: Request, res: Response) => {
  res.send(`User ${req.params.id} route!`);
});

export default router;
