import { FormulaComponentInterface } from "../interfaces/interfaces";
import { createMongoDBConnection } from "./mongodbConfig";

//TODO: COMBINE BOTH FUNCTIONS INTO 1 👇🏻

export function returnHexColor(
  formulaComponents: {
    // OLD FORMULAS HAVE THEIR COMPONENT PERCENTAGES SET AS STRINGS 👇🏻
    hex: string;
    percentage: number | string;
  }[]
): string {
  //   console.log("formulaComponents: ", formulaComponents);

  const convertedFormulaComponentsPercentagesToNumbers = formulaComponents.map(
    (component) => {
      return { color: component.hex, percentage: Number(component.percentage) };
    }
  );

  const hexValues = convertedFormulaComponentsPercentagesToNumbers;

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

  //   console.info("finalHexColor", finalHexColor);

  return "#" + finalHexColor;
}

export async function returnHexColorPrepping(
  receivedComponents: FormulaComponentInterface[]
): Promise<
  {
    hex: string;
    percentage: number;
  }[]
> {
  const db = await createMongoDBConnection();
  const pigments = db.collection("pigments");

  // Extract ComponentCode values and map them with their respective percentages
  const componentData = receivedComponents.map((item: any) => ({
    code: item.ComponentCode,
    percentage: item.Percentage,
  }));

  // Extract just the codes for the query
  const componentCodes = componentData.map((item: any) => item.code);

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
      hex: pigment.hex,
      percentage: component ? component.percentage : 0,
    };
  });

  return hexValues;
}
