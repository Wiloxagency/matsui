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
  const db = await createMongoDBConnection();
  const users = db.collection("users");
  const updateUser = await users.updateOne(
    { email: req.body.email },
    {
      $set: {
        username: req.body.username,
        company: req.body.company,
      },
    }
  );
  res.json(updateUser);
});

router.get("/:id", async (req: Request, res: Response) => {});

export default router;
