import { Request, Response, Router } from "express";
import { createMongoDBConnection } from "../shared/mongodbConfig";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const components = db.collection("components");
  const allComponents = await components.find().toArray();
  res.json(allComponents);
});

router.post("/", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const components = db.collection("components");
  const componentList = await components
    .find({ componentCode: { $in: req.body } })
    .toArray();
  res.json(componentList);
});

export default router;
