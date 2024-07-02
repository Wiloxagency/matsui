import { Router, Request, Response } from "express";
import { createMongoDBConnection } from "../shared/mongodbConfig";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  // console.log(req.body);
  const db = await createMongoDBConnection();
  const series = db.collection("series");

  const doesSeriesAlreadyExist = await series.findOne({
    seriesName: req.body.seriesName,
  });

  if (doesSeriesAlreadyExist) {
    res.status(200).json({ message: "Series already exist" });
    return
  }

  const createSeries = await series.insertOne({
    seriesName: req.body.seriesName,
  });

  res.status(201).json({message: "Series created"});
});

router.delete("/", async (req: Request, res: Response) => {
  // console.log(req.body);
  const db = await createMongoDBConnection();
  const series = db.collection("series");
  const components = db.collection("components");
  const deleteSeries = await series.deleteOne({
    seriesName: req.body.seriesName,
  });
  const deleteComponents = await components.deleteMany({
    FormulaSerie: req.body.seriesName,
  });
  res.json({ deleteSeries: deleteSeries, deleteComponents: deleteComponents });
});

export default router;
