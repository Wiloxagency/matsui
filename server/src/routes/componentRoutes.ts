import { Request, Response, Router } from "express";
import {
  FormulaComponentInterface,
  FormulaSwatchInterface,
  PigmentInterface,
} from "../interfaces/interfaces";
import { createMongoDBConnection } from "../shared/mongodbConfig";
import {
  returnHexColor,
  returnHexColorPrepping,
} from "../shared/returnHexColor";
import { Document } from "mongodb";
import axios from "axios";
// import { authenticateToken } from "../shared/jwtMiddleware";

const router = Router();

router.post("/GetComponents", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const components = db.collection("components");
  if (req.body.series) {
    const seriesComponents = await components
      .find({ FormulaSerie: req.body.series })
      .toArray();
    res.json(seriesComponents);
  } else {
    const allComponents = await components.find().toArray();
    res.json(allComponents);
  }
});

router.post(
  "/GetFormulas",
  // authenticateToken,
  async (req: Request, res: Response) => {
    const db = await createMongoDBConnection();
    const components = db.collection<FormulaComponentInterface>("components");
    const formulaSwatchColors = db.collection("formulaSwatchColors");

    let initialRequestFormulaCodes: string[] = [];
    let latestFormulaCodes: string[] = [];
    let userFormulasCodes: string[] = [];
    const searchQuery: string = req.body.formulaSearchQuery;

    // const baseFormulas = await

    console.log(req.body);
    // console.log(req.body.includeSystemFormulas);

    if (req.body.userEmail) {
      const formulaSwatchColors = db.collection("formulaSwatchColors");
      const userFormulas = await formulaSwatchColors
        .find({ createdBy: req.body.userEmail })
        .toArray();
      console.log("CreatedBy length: ", userFormulas.length);
      if (userFormulas.length > 0) {
        userFormulasCodes = userFormulas.map((formula) => formula.formulaCode).slice(0, 50);
      }
      if (userFormulas.length === 0) {
        console.log("USER HAS NO CREATED FORMULAS");
        res.json([]);
        return;
      }
    }

    if (!searchQuery || (searchQuery === "" && !req.body.userEmail)) {
      // FILTERING BY SERIES ALSO FILTERS BY COMPANY BECAUSE
      // A SERIES' NAME MUST BE UNIQUE
      const latestSeriesComponents = await components
        .find({ FormulaSerie: req.body.formulaSeries })
        .sort({ _id: -1 })
        .limit(100)
        .toArray();
      if (latestSeriesComponents.length > 0) {
        // Step 1: Find the FormulaCode of the last object
        const lastFormulaCode =
          latestSeriesComponents[latestSeriesComponents.length - 1].FormulaCode;

        // Step 2: Traverse backward to find the start index of the last set of objects with the same FormulaCode
        let startIndex = latestSeriesComponents.length - 1;
        while (
          startIndex >= 0 &&
          latestSeriesComponents[startIndex].FormulaCode === lastFormulaCode
        ) {
          startIndex--;
        }

        // Step 3: Create a new array excluding the last set of objects with the same FormulaCode
        const filteredComponents = latestSeriesComponents.slice(
          0,
          startIndex + 1
        );

        // Step 4: Get unique FormulaCode values from the filtered array
        const uniqueFormulaCodes = Array.from(
          new Set(filteredComponents.map((component) => component.FormulaCode))
        );
        const latestFormulaSwatchColors = await formulaSwatchColors
          .find({ formulaCode: { $in: uniqueFormulaCodes } })
          .sort({ _id: -1 })
          .toArray();
        latestFormulaCodes = latestFormulaSwatchColors.map(
          (formula) => formula.formulaCode
        );
      }

      const firstBaseFormulas = await formulaSwatchColors
        .find()
        // .sort({ _id: 1 })
        .limit(50)
        .toArray();
      // console.log("firstBaseFormulas: ", firstBaseFormulas);
      const firstBaseFormulaCodes = firstBaseFormulas.map(
        (formula) => formula.formulaCode
      );

      initialRequestFormulaCodes = latestFormulaCodes.concat(
        firstBaseFormulaCodes
      );

      // console.log(firstBaseFormulaCodes);
    }

    const companyPath = "formulaSwatchColor.company";
    const creatorPath = "formulaSwatchColor.createdBy";

    let pipeline: Document[] = [];

    if (req.body.formulaSeries) {
      pipeline.push({
        $match: { FormulaSerie: req.body.formulaSeries },
      });
    }

    // THIS MEANS THAT IS THE INITIAL REQUEST FOR THE FORMULAS PAGE 👇🏻
    if (!req.body.formulaSearchQuery && !req.body.userEmail) {
      console.log("Initial request");
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

    if (req.body.selectedCompany) {
      pipeline.push({
        $match: {
          [companyPath]: req.body.selectedCompany,
        },
      });
    }

    if (!req.body.selectedCompany) {
      pipeline.push({
        $match: {
          // "formulaSwatchColor.company": null,
          // "formulaSwatchColor.company": req.body.userCompany,
          "formulaSwatchColor.company": { $in: [req.body.userCompany, null] },
        },
      });
    }

    // if (req.body.userEmail) {
    //   pipeline.push({
    //     $match: {
    //       "formulaSwatchColor.createdBy": req.body.userEmail,
    //     },
    //   });
    // }

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
            componentSeries: "$FormulaSerie",
          },
        },
      },
    });

    console.log(pipeline);

    const formulas = await components
      .aggregate(pipeline)
      .sort({ _id: -1 })
      .limit(100)
      .toArray();
    console.log("THIS RUNS 2");
    console.log("formulas: ", formulas);
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

router.post("/CreateOrEditFormula", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const formulaSwatchColors = db.collection("formulaSwatchColors");
  const components = db.collection("components");
  const users = db.collection("users");
  const pigments = db.collection<PigmentInterface>("pigments");
  const allPigments = await pigments.find().toArray();
  const receivedComponents: FormulaComponentInterface[] =
    req.body.formulaComponents;

  try {
    const componentsHexValues = await returnHexColorPrepping(
      receivedComponents,
      allPigments
    );

    const finalHexColor = returnHexColor(componentsHexValues);

    let newFormulaCode = receivedComponents[0].FormulaCode;

    if (req.body.isEditOrCreate === "create") {
      while (await checkIfFormulaCodeExists(newFormulaCode)) {
        newFormulaCode = incrementName(newFormulaCode);
      }
    }

    const newFormulaSwatch: FormulaSwatchInterface = {
      formulaCode: newFormulaCode,
      formulaColor: finalHexColor,
      isUserCreatedFormula: true,
      company: req.body.company,
      createdBy: req.body.createdBy,
      isFormulaActive: req.body.isFormulaActive,
    };

    const updatedComponents = receivedComponents.map((component) => ({
      ...component,
      FormulaCode: newFormulaCode,
    }));

    if (req.body.isEditOrCreate === "create") {
      await formulaSwatchColors.insertOne(newFormulaSwatch);
      await components.insertMany(updatedComponents);
      await users.updateOne(
        { email: req.body.createdBy },
        {
          $inc: { createdFormulas: 1 },
        }
      );
    } else if (req.body.isEditOrCreate === "edit") {
      await formulaSwatchColors.updateOne(
        { formulaCode: newFormulaCode },
        {
          $set: {
            formulaCode: newFormulaCode,
            formulaColor: finalHexColor,
            isFormulaActive: req.body.isFormulaActive,
          },
        }
      );
      const deleteComponents = await components.deleteMany({
        FormulaSerie: receivedComponents[0].FormulaSerie,
        FormulaCode: newFormulaCode,
      });
      // console.log(deleteComponent);

      await components.insertMany(updatedComponents);
    }

    res.json("Success");
  } catch (error) {
    console.error("Error fetching pigments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/ImportFormulas", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const components = db.collection("components");
  const formulaSwatchColors = db.collection<FormulaSwatchInterface>(
    "formulaSwatchColors"
  );
  const receivedComponents: FormulaComponentInterface[] =
    req.body.formulaComponents;

  const receivedFormulaCodes = Array.from(
    new Set(
      receivedComponents.map(({ FormulaCode }: any) => {
        return FormulaCode;
      })
    )
  );

  const alreadyExistingFormulas = await formulaSwatchColors
    .find({
      formulaCode: { $in: receivedFormulaCodes },
    })
    .toArray();

  const alreadyExistingFormulasCodes = Array.from(
    new Set(
      alreadyExistingFormulas.map(({ formulaCode }: any) => {
        return formulaCode;
      })
    )
  );

  var uniqueNewFormulaCodes = receivedFormulaCodes.filter(
    (item) => alreadyExistingFormulasCodes.indexOf(item) == -1
  );

  const componentsGroupedByFormula = Map.groupBy(
    receivedComponents,
    ({ FormulaCode }) => FormulaCode
  );

  let newFormulaColorSwatches: FormulaSwatchInterface[] = [];
  let nullFormulaCodes: string[] = [];

  const promises = Array.from(componentsGroupedByFormula.entries()).map(
    async ([indexFormula, formulaComponents]) => {
      // IF FORMULA CODE IS NEW
      if (uniqueNewFormulaCodes.includes(formulaComponents[0].FormulaCode)) {
        try {
          const response = await axios.post(
            "https://sophia-lms-production.azurewebsites.net/api/PantoneToHex",
            { pantoneCode: formulaComponents[0].FormulaCode }
          );
          if (response.data.hex === "null") {
            nullFormulaCodes.push(formulaComponents[0].FormulaCode);
          } else {
            newFormulaColorSwatches.push({
              formulaCode: formulaComponents[0].FormulaCode,
              formulaColor: response.data.hex.replace("#", ""),
              isUserCreatedFormula: true,
              createdBy: req.body.createdBy,
              company: req.body.company,
              isHexColorAIProvided: true,
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  );

  await Promise.all(promises);

  try {
    if (newFormulaColorSwatches.length > 0) {
      await formulaSwatchColors.insertMany(newFormulaColorSwatches);
    }
    await components.insertMany(receivedComponents);

    const importFormulasResponse = {
      formulasCreated: Array.from(componentsGroupedByFormula.entries()).length,
      formulasNotCreated: nullFormulaCodes,
    };

    res.json(importFormulasResponse);
  } catch (error) {
    console.error("Error importing components:", error);
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
