import { Request, Response, Router } from "express";
import {
  FormulaComponentInterface,
  FormulaSwatchInterface,
} from "../interfaces/interfaces";
import { createMongoDBConnection } from "../shared/mongodbConfig";
import {
  returnHexColor,
  returnHexColorPrepping,
} from "../shared/returnHexColor";
import { authenticateToken } from "../shared/jwtMiddleware";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const components = db.collection("components");
  const allComponents = await components.find().toArray();
  res.json(allComponents);
});

router.post(
  "/GetFormulas",
  authenticateToken,
  async (req: Request, res: Response) => {
    const db = await createMongoDBConnection();
    const components = db.collection("components");
    let initialRequestFormulaCodes: string[] = [];
    const searchQuery: string = req.body.formulaSearchQuery;

    if (searchQuery === "") {
      const formulaSwatchColors = db.collection("formulaSwatchColors");
      const latest20FormulaSwatchColors = await formulaSwatchColors
        .find()
        .sort({ _id: -1 })
        .limit(150)
        .toArray();
      initialRequestFormulaCodes = latest20FormulaSwatchColors.map(
        (formula) => formula.formulaCode
      );
    }

    // console.log(initialRequestFormulaCodes);

    const pipeline = [
      { $match: { FormulaSerie: req.body.formulaSeries } },
      searchQuery === ""
        ? {
            $match: {
              FormulaCode: {
                $in: initialRequestFormulaCodes,
              },
            },
          }
        : {
            $match: {
              // FormulaCode: { "$regex": searchQuery, "$options": "i" },
              FormulaDescription: { $regex: searchQuery, $options: "i" },
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
      {
        $lookup: {
          from: "formulaSwatchColors",
          localField: "FormulaCode",
          foreignField: "formulaCode",
          as: "formulaSwatchColor",
        },
      },
      {
        $unwind: "$formulaSwatchColor",
      },
      { $project: { fromItems: 0 } },
      {
        $group: {
          _id: "$FormulaCode",
          formulaDescription: {
            $first: "$FormulaDescription",
          },
          formulaSwatchColor: {
            $first: "$formulaSwatchColor",
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
  }
);

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

router.post("/GetClosestColors", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const FormulaSwatchColor = db.collection("formulaSwatchColors");
  try {
    const formulaCode = req.body.formulaCode;
    const targetColorDoc = await FormulaSwatchColor.findOne({
      formulaCode: req.body.formulaCode,
    });

    if (!targetColorDoc) {
      return res.status(404).json({ message: "Formula code not found" });
    }

    const targetColor = targetColorDoc.formulaColor.replace("#", "");

    if (!isValidHexColor(targetColor)) {
      return res.status(400).json({ message: "Invalid target color format" });
    }

    const targetRGB = hexToRgb(targetColor);
    const allColors = await FormulaSwatchColor.find({
      formulaCode: { $ne: formulaCode },
    }).toArray();

    type ColorDistance = {
      _id: any;
      formulaCode: string;
      formulaColor: string;
      distance: number;
    };

    const distances: ColorDistance[] = allColors
      .map((doc) => {
        try {
          let color = doc.formulaColor.replace("#", "");

          if (!isValidHexColor(color)) {
            return null;
          }

          const colorRGB = hexToRgb(color);
          const distance = calculateColorDistance(targetRGB, colorRGB);
          return {
            _id: doc._id,
            formulaCode: doc.formulaCode,
            formulaColor: doc.formulaColor,
            distance,
          } as ColorDistance;
        } catch (error) {
          return null;
        }
      })
      .filter((doc): doc is ColorDistance => doc !== null);

    distances.sort((a, b) => a.distance - b.distance);

    const closestColors = distances.slice(0, 10);

    const closestFormulaCodes = closestColors.map((similarColor) => {
      return similarColor.formulaCode;
    });
    // console.log("closestFormulaCodes: ", closestFormulaCodes);

    const pipeline = [
      { $match: { FormulaSerie: req.body.formulaSeries } },
      {
        $match: {
          FormulaCode: {
            $in: closestFormulaCodes,
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
      {
        $lookup: {
          from: "formulaSwatchColors",
          localField: "FormulaCode",
          foreignField: "formulaCode",
          as: "formulaSwatchColor",
        },
      },
      {
        $unwind: "$formulaSwatchColor",
      },
      { $project: { fromItems: 0 } },
      {
        $group: {
          _id: "$FormulaCode",
          formulaDescription: {
            $first: "$FormulaDescription",
          },
          formulaSwatchColor: {
            $first: "$formulaSwatchColor",
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

    const components = db.collection("components");
    const formulas = await components
      .aggregate(pipeline)
      // .sort({ _id: -1 })
      .toArray();
    res.json(formulas);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

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
  const receivedComponents: FormulaComponentInterface[] =
    req.body.formulaComponents;

  try {
    const componentsHexValues = await returnHexColorPrepping(
      receivedComponents
    );

    const finalHexColor = returnHexColor(componentsHexValues);

    const newFormulaSwatch: FormulaSwatchInterface = {
      formulaCode: req.body[0].FormulaCode,
      formulaColor: finalHexColor,
      isUserCreatedFormula: true,
      company: req.body.company,
      createdBy: req.body.createdBy,
    };

    await formulaSwatchColors.insertOne(newFormulaSwatch);
    await components.insertMany(req.body);

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

  const receivedComponents: FormulaComponentInterface[] = req.body;

  const componentsGroupedByFormula = Map.groupBy(
    receivedComponents,
    ({ FormulaCode }) => FormulaCode
  );

  let newFormulaColorSwatches: FormulaSwatchInterface[] = [];

  for (const [indexFormula, formula] of componentsGroupedByFormula.entries()) {
    const componentsHexValues = await returnHexColorPrepping(formula);
    const finalHexColor = returnHexColor(componentsHexValues);
    newFormulaColorSwatches.push({
      formulaCode: formula[0].FormulaCode,
      formulaColor: finalHexColor,
    });
  }

  await formulaSwatchColors.insertMany(newFormulaColorSwatches);

  try {
    const insertManyResponse = await components.insertMany(req.body);
    res.json(insertManyResponse);
  } catch (error) {
    console.error("Error importing compoents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/GetMissingPigments", async (req: Request, res: Response) => {
  const existingPigments = [
    "YEL M3G",
    "GLDYEL MFR",
    "ORNG MGD",
    "RED MGD",
    "RED MFB",
    "GLOW ROSE MI5B-E",
    "PINK",
    "VLT MFB",
    "Navy  B",
    "BLU MB",
    "BLU MG",
    "GRN MB",
    "BLK MK",
    "ALPHA BASE",
    "ALPHA TRANS WHITE",
    "PNK MB",
    "AP TRS WHT",
    "EP WHT 301",
    "MAT 301M",
    "CLR 301C",
  ];
  const allPigments = [
    "WHT 301W",
    "YEL M3G",
    "ORNG MGD",
    "GRN MB",
    "MAT 301M",
    "BLK MK",
    "BLU MG",
    "GLDYEL MFR",
    "RED MGD",
    "RED MFB",
    "BLU MB",
    "PNK MB",
    "VLT MFB",
    "VLT ECGR",
    "ROSE MB",
    "NEO VIOLET MSGR",
    "NEO BLACK BK",
    "STRETCH WHITER 301-5",
    "BLU ECBR",
    "YEL ECGG",
    "GRN EC5G",
    "ORNG ECR",
    "RED ECB",
    "PNK EC5B",
    "ROSE EC5B",
    "SLVRSM 602",
    "CLR 301C",
    "YEL ECB",
    "AP DC BASE",
    "AP TRS WHT",
    "NEO YELLOW MRG",
    "SLVRSM 620",
    "GLOW BLUE MIBR-E",
    "GLOW YELLOW MI2G-E",
    "GLOW GREEN MI8G-E",
    "GLOW ORANGE MI2G-E",
    "GLOW PINK MIB-E",
    "GLOW ROSE MI5B-E",
    "GLOW PURPLE MIGR-E",
    "METALLIC BINDER 301",
    "BRT DC BASE",
    "EP WHT 301",
    "EP CLR 301",
    "EPRETCH WHITER 301-5",
    "HM DC BASE",
    "ST WHT 301",
    "ST CLR 301",
    "ALPHA TRANS WHITE",
    "ALPHA BASE",
    "PINK",
  ];

  const getMissingPigments = allPigments.filter(
    (item) => existingPigments.indexOf(item) == -1
  );

  res.json(getMissingPigments);
});

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

function isValidHexColor(hex: string): boolean {
  return /^[0-9A-Fa-f]{6}$/.test(hex);
}

function calculateColorDistance(
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number }
): number {
  return Math.sqrt(
    Math.pow(color1.r - color2.r, 2) +
      Math.pow(color1.g - color2.g, 2) +
      Math.pow(color1.b - color2.b, 2)
  );
}

export default router;
