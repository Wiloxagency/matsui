import { Request, Response, Router } from "express";
import { createMongoDBConnection } from "../shared/mongodbConfig";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const formulas = db.collection("formulas");
  const allFormulas = await formulas.find().toArray();
  res.json(allFormulas);
});

router.post("/", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const formulas = db.collection("formula");

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
        from: "pigment",
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

  const formula = await formulas.aggregate(pipeline).toArray();

  res.json(formula[0]);
});

export default router;
