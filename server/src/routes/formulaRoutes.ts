import { Request, Response, Router } from "express";
import { createMongoDBConnection } from "../shared/mongodbConfig";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const formulas = db.collection("formulas");
  const allFormulas = await formulas.find().toArray();
  res.json(allFormulas);
});

export default router;
