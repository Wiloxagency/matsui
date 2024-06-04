import { Router, Request, Response } from "express";
import { createMongoDBConnection } from "../shared/mongodbConfig";

const router = Router();

router.delete("/", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const series = db.collection("series");
  const components = db.collection("components");
  const deleteSeries = await series.deleteOne({
    seriesName: req.query.seriesName,
  });
  const deleteComponents = await components.deleteMany({
    FormulaSerie: req.query.seriesName,
  });
  res.json({ deleteSeries: deleteSeries, deleteComponents: deleteComponents });
});

export default router;
