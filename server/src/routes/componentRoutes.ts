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

  const pipeline = [
    {
      $match: {
        FormulaSerie: req.query.formulaSeries,
      },
    },
    {
      $project: {
        _id: 1,
        FormulaSerie: 1,
        FormulaCode: {
          $trim: {
            input: "$FormulaCode",
          },
        },
        FormulaDescription: {
          $trim: {
            input: "$FormulaDescription",
          },
        },
        ComponentCode: 1,
        ComponentDescription: 1,
        Percentage: 1,
      },
    },
    {
      $match: {
        FormulaCode: req.query.formulaCode,
      },
    },
    {
      $lookup: {
        from: "pigments",
        localField: "ComponentCode",
        foreignField: "code",
        as: "component",
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            {
              $arrayElemAt: ["$component", 0],
            },
            "$$ROOT",
          ],
        },
      },
    },
    {
      $project: {
        fromItems: 0,
      },
    },
    {
      $group: {
        _id: "$FormulaCode",
        formulaDescription: {
          $first: "$FormulaDescription",
        },
        components: {
          $push: {
            componentCode: "$ComponentCode",
            componentDescription: "$ComponentDescription",
            hex: "$hex",
            percentage: "$Percentage",
          },
        },
      },
    },
  ];

  const formula = await components.aggregate(pipeline).toArray();

  res.json(formula[0]);
});

router.get("/GetSeries", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const series = db.collection("series");
  const allSeries = await series.find().toArray();

  res.json(allSeries);
});

// router.post("/", async (req: Request, res: Response) => {
//   const db = await createMongoDBConnection();
//   const components = db.collection("components");
//   const componentList = await components
//     .find({ componentCode: { $in: req.body } })
//     .toArray();
//   res.json(componentList);
// });

export default router;
