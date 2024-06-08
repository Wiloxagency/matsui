import { Request, Response, Router } from "express";
import { createMongoDBConnection } from "../shared/mongodbConfig";
import { FormulaSwatchInterface } from "../interfaces/interfaces";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const components = db.collection("components");
  const allComponents = await components.find().toArray();
  res.json(allComponents);
});

router.post("/GetFormulas", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const components = db.collection("components");
  let initialRequestFormulaCodes: string[] = [];

  if (req.body.isInitialRequest === true) {
    const formulaSwatchColors = db.collection("formulaSwatchColors");
    const latest20FormulaSwatchColors = await formulaSwatchColors
      .find()
      .sort({ _id: -1 })
      .limit(50)
      .toArray();
    initialRequestFormulaCodes = latest20FormulaSwatchColors.map(
      (formula) => formula.formulaCode
    );
  }

  console.log(initialRequestFormulaCodes);

  const pipeline = [
    { $match: { FormulaSerie: req.body.formulaSeries } },
    {
      $match: {
        FormulaCode: {
          $in: req.body.isInitialRequest
            ? initialRequestFormulaCodes
            : req.body.formulaCodes,
        },
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
          $mergeObjects: [{ $arrayElemAt: ["$component", 0] }, "$$ROOT"],
        },
      },
    },
    { $project: { fromItems: 0 } },
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

  const formulas = await components
    .aggregate(pipeline)
    .sort({ _id: -1 })
    .toArray();
  res.json(formulas);
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

// router.get(
//   "/GetCodesOfFormulasInSeries/:seriesName",
//   async (req: Request, res: Response) => {
//     const db = await createMongoDBConnection();
//     const components = db.collection("components");
//     const filteredComponents = await components
//       .find({ FormulaSerie: req.params.seriesName })
//       .toArray();

//     const formulaCodes = Array.from(
//       new Set(
//         filteredComponents?.map(({ FormulaCode }) => {
//           return FormulaCode;
//         })
//       )
//     );
//     res.json(formulaCodes);
//   }
// );

// router.post("/", async (req: Request, res: Response) => {
//   const db = await createMongoDBConnection();
//   const components = db.collection("components");
//   const componentList = await components
//     .find({ componentCode: { $in: req.body } })
//     .toArray();
//   res.json(componentList);
// });

router.get("/GetPigments", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const pigments = db.collection("pigments");
  const allPigments = await pigments.find().toArray();
  res.json(allPigments);
});

router.get("/GetFormulaSwatchColors", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const formulaSwatchColors = db.collection("formulaSwatchColors");
  const allFormulaSwatchColors = await formulaSwatchColors
    .find()
    .sort({ _id: -1 })
    .limit(20)
    .toArray();
  res.json(allFormulaSwatchColors);
});

router.post("/CreateFormula", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const formulaSwatchColors = db.collection("formulaSwatchColors");
  const components = db.collection("components");
  const pigments = db.collection("pigments");

  // Extract ComponentCode values and map them with their respective percentages
  const componentData = req.body.map((item: any) => ({
    code: item.ComponentCode,
    percentage: item.Percentage,
  }));

  // Extract just the codes for the query
  const componentCodes = componentData.map((item: any) => item.code);

  try {
    // Query pigments collection for matching ComponentCode values
    const matchingPigments = await pigments
      .find({
        code: { $in: componentCodes },
      })
      .toArray();

    // Map the pigments with their respective percentages
    const hexValues = matchingPigments.map((pigment: any) => {
      const component = componentData.find(
        (item: any) => item.code === pigment.code
      );
      return {
        color: pigment.hex,
        percentage: component ? component.percentage : 0,
      };
    });

    // Function to convert hex to RGB
    const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex, 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
      };
    };

    // Function to convert RGB to hex
    const rgbToHex = (r: number, g: number, b: number) => {
      const toHex = (val: number) => val.toString(16).padStart(2, "0");
      return `${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    };

    // Calculate the weighted average of RGB values
    const totalPercentage = hexValues.reduce(
      (sum, item) => sum + item.percentage,
      0
    );
    const weightedRgb = hexValues.reduce(
      (acc, item) => {
        const rgb = hexToRgb(item.color);
        acc.r += (rgb.r * item.percentage) / totalPercentage;
        acc.g += (rgb.g * item.percentage) / totalPercentage;
        acc.b += (rgb.b * item.percentage) / totalPercentage;
        return acc;
      },
      { r: 0, g: 0, b: 0 }
    );

    // Convert the averaged RGB values back to hex
    const finalHexColor = rgbToHex(
      Math.round(weightedRgb.r),
      Math.round(weightedRgb.g),
      Math.round(weightedRgb.b)
    );

    console.info("finalHexColor", finalHexColor);

    const newFormulaSwatch: FormulaSwatchInterface = {
      formulaCode: req.body[0].FormulaCode,
      formulaColor: finalHexColor,
    };

    await formulaSwatchColors.insertOne(newFormulaSwatch);
    await components.insertMany(req.body);
    console.info("req.body:", req.body);
    console.info("newFormulaSwatch", newFormulaSwatch);
    console.info("hexValues", hexValues);

    res.json("Received");
  } catch (error) {
    console.error("Error fetching pigments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/ImportFormulas", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const components = db.collection("components");
  const formulaSwatchColors = db.collection("formulaSwatchColors");

  const formulaCodes = Array.from(
    new Set(
      req.body.map(({ FormulaCode }: any) => {
        return FormulaCode;
      })
    )
  );

  const newFormulasSwatches = formulaCodes.map((formulaCode) => {
    return { formulaCode: formulaCode, formulaColor: "red" };
  });

  await formulaSwatchColors.insertMany(newFormulasSwatches);

  try {
    const insertManyResponse = await components.insertMany(req.body);
    res.json(insertManyResponse);
  } catch (error) {
    console.error("Error importing compoents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
