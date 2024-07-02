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
import { Document } from "mongodb";
// import { authenticateToken } from "../shared/jwtMiddleware";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const components = db.collection("components");
  const allComponents = await components.find().toArray();
  res.json(allComponents);
});

router.post(
  "/GetFormulas",
  // authenticateToken,
  async (req: Request, res: Response) => {
    const db = await createMongoDBConnection();
    const components = db.collection("components");
    let initialRequestFormulaCodes: string[] = [];
    let userFormulasCodes: string[] = [];
    const searchQuery: string = req.body.formulaSearchQuery;

    // console.log(req.body);

    if (req.body.userEmail) {
      const formulaSwatchColors = db.collection("formulaSwatchColors");
      const userFormulas = await formulaSwatchColors
        .find({ createdBy: req.body.userEmail })
        .toArray();
      userFormulasCodes = userFormulas.map((formula) => formula.formulaCode);
    }

    if (!searchQuery || searchQuery === "") {
      const formulaSwatchColors = db.collection("formulaSwatchColors");
      const latestFormulaSwatchColors = await formulaSwatchColors
        .find()
        .sort({ _id: -1 })
        .limit(50)
        .toArray();
      initialRequestFormulaCodes = latestFormulaSwatchColors.map(
        (formula) => formula.formulaCode
      );
    }

    const companyPath = "formulaSwatchColor.company";
    const creatorPath = "formulaSwatchColor.createdBy";

    let pipeline: Document[] = [];

    if (req.body.formulaSeries) {
      pipeline.push({
        $match: { FormulaSerie: req.body.formulaSeries },
      });
    }

    if (!req.body.formulaSearchQuery && !req.body.userEmail) {
      pipeline.push({
        $match: {
          FormulaCode: {
            $in: initialRequestFormulaCodes,
          },
        },
      });
    }

    if (req.body.userEmail) {
      pipeline.push({
        $match: {
          FormulaCode: {
            $in: userFormulasCodes,
          },
        },
      });
    }

    if (req.body.formulaSearchQuery) {
      pipeline.push({
        $match: {
          // FormulaCode: { "$regex": searchQuery, "$options": "i" },
          FormulaDescription: { $regex: searchQuery, $options: "i" },
        },
      });
      // console.log("Search query added");
    }

    pipeline.push(
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
      { $project: { fromItems: 0 } }
    );

    if (req.body.company) {
      pipeline.push({
        $match: {
          [companyPath]: req.body.company,
        },
      });
    }

    if (req.body.userEmail) {
      pipeline.push({
        $match: {
          [creatorPath]: req.body.userEmail,
        },
      });
    }

    pipeline.push({
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
    });

    // const pipeline = [
    //   {
    //     $match: { FormulaSerie: req.body.formulaSeries },
    //   },
    //   !searchQuery
    //     ? {
    //         $match: {
    //           FormulaCode: {
    //             $in: initialRequestFormulaCodes,
    //           },
    //         },
    //       }
    //     : {
    //         $match: {
    //           // FormulaCode: { "$regex": searchQuery, "$options": "i" },
    //           FormulaDescription: { $regex: searchQuery, $options: "i" },
    //         },
    //       },
    //   {
    //     $lookup: {
    //       from: "pigments",
    //       localField: "ComponentCode",
    //       foreignField: "code",
    //       as: "component",
    //     },
    //   },
    //   {
    //     $replaceRoot: {
    //       newRoot: {
    //         $mergeObjects: [{ $arrayElemAt: ["$component", 0] }, "$$ROOT"],
    //       },
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "formulaSwatchColors",
    //       localField: "FormulaCode",
    //       foreignField: "formulaCode",
    //       as: "formulaSwatchColor",
    //     },
    //   },
    //   {
    //     $unwind: "$formulaSwatchColor",
    //   },
    //   { $project: { fromItems: 0 } },

    //   {
    //     $match: {
    //       [companyPath]: req.body.company,
    //     },
    //   },

    //   {
    //     $match: {
    //       [creatorPath]: req.body.userEmail,
    //     },
    //   },

    //   {
    //     $group: {
    //       _id: "$FormulaCode",
    //       formulaDescription: {
    //         $first: "$FormulaDescription",
    //       },
    //       formulaSwatchColor: {
    //         $first: "$formulaSwatchColor",
    //       },
    //       components: {
    //         $push: {
    //           componentCode: "$ComponentCode",
    //           componentDescription: "$ComponentDescription",
    //           hex: "$hex",
    //           percentage: "$Percentage",
    //         },
    //       },
    //     },
    //   },
    // ];

    // console.log(pipeline);

    const formulas = await components
      .aggregate(pipeline)
      .sort({ _id: -1 })
      .toArray();
    // console.log(formulas);
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

    let newFormulaCode = receivedComponents[0].FormulaCode;

    while (await checkIfFormulaCodeExists(newFormulaCode)) {
      newFormulaCode = incrementName(newFormulaCode);
    }

    const newFormulaSwatch: FormulaSwatchInterface = {
      formulaCode: newFormulaCode,
      formulaColor: finalHexColor,
      isUserCreatedFormula: true,
      company: req.body.company,
      createdBy: req.body.createdBy,
    };

    const updatedComponents = receivedComponents.map((component) => ({
      ...component,
      FormulaCode: newFormulaCode,
    }));

    await formulaSwatchColors.insertOne(newFormulaSwatch);
    await components.insertMany(updatedComponents);

    res.json("Success");
  } catch (error) {
    console.error("Error fetching pigments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/ImportFormulas", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const components = db.collection("components");
  const formulaSwatchColors = db.collection("formulaSwatchColors");
  const receivedComponents: FormulaComponentInterface[] =
    req.body.formulaComponents;

  // const formulaCodes = Array.from(
  //   new Set(
  //     receivedComponents.map(({ FormulaCode }: any) => {
  //       return FormulaCode;
  //     })
  //   )
  // );

  const componentsGroupedByFormula = Map.groupBy(
    receivedComponents,
    ({ FormulaCode }) => FormulaCode
  );

  let newFormulaColorSwatches: FormulaSwatchInterface[] = [];

  for (const [indexFormula, formula] of componentsGroupedByFormula.entries()) {
    const componentsHexValues = await returnHexColorPrepping(formula);
    let finalHexColor;
    if (componentsHexValues.length === 0) {
      finalHexColor = "fffff";
    } else {
      finalHexColor = returnHexColor(componentsHexValues);
    }
    newFormulaColorSwatches.push({
      formulaCode: formula[0].FormulaCode,
      formulaColor: finalHexColor,
      isUserCreatedFormula: true,
      createdBy: req.body.createdBy,
      company: req.body.company,
    });
  }

  await formulaSwatchColors.insertMany(newFormulaColorSwatches);

  try {
    const insertManyResponse = await components.insertMany(receivedComponents);
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

// console.log(incrementName("testName"));
// console.log(incrementName("testName (1)"));
// console.log(incrementName("testName (2)"));

async function checkIfFormulaCodeExists(
  receivedFormulaCode: string
): Promise<boolean> {
  const db = await createMongoDBConnection();
  const formulaSwatchColors = db.collection("formulaSwatchColors");
  const foundFormula = await formulaSwatchColors.findOne({
    formulaCode: receivedFormulaCode,
  });
  if (foundFormula) return true;
  return false;
}

function incrementName(name: string): string {
  const namePattern = /^(.*?)(?: \((\d+)\))?$/;
  let baseName = name;
  let num = 1;
  const match = name.match(namePattern);
  if (match) {
    baseName = match[1];
    if (match[2]) {
      num = parseInt(match[2], 10) + 1;
    }
  }
  return `${baseName} (${num})`;
}

export default router;
