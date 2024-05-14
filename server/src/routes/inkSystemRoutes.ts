import { Request, Response, Router } from "express";
import { createMongoDBConnection } from "../shared/mongodbConfig";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const inkSystems = db.collection("inkSystems");
  const allInkSystems = await inkSystems.find().toArray();
  res.json(allInkSystems);
});

export default router;
