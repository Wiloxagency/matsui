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

  // TODO -> Antes de comentar estas líneas el endpoint verificaba la existencia de la serie y devolvia el mensaje correspondiente
  //         en caso que existiera, de este modo el frontend no continuaba el proceso de importación. No obstante en el neuvo enfoque 
  //         coniste en siempre permitir importar una serie aunque ya exista, en cuyo caso el procedimiento es actualizarla o 
  //         actualizar sus componentes, así que temporalmente todas las series se tratan como no existentes, se debe actualizar ese
  //         enfoque para evitar confusión en el desarrollo o mantenimiento posterior.
  
  // if (doesSeriesAlreadyExist) {
  //   res.status(200).json({ message: "Series already exist" });
  //   return
  // }

    if (doesSeriesAlreadyExist) {
    res.status(200).json({ message: "Series created" });
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
