import { FormulaComponentInterface } from "../interfaces/interfaces";
import { createMongoDBConnection } from "./mongodbConfig";

//TODO: COMBINE BOTH FUNCTIONS INTO 1 👇🏻

type FormulaComponent = {
  cmyk: { c: number; m: number; y: number; k: number };
  percentage: number | string; // Porcentaje de este color en la mezcla (debe sumar 100% en total)
};

function cmykToHex(c: number, m: number, y: number, k: number): string {
  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);

  const toHex = (value: number) => {
      const hex = Math.round(value).toString(16).padStart(2, '0');
      return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function returnHexColor(formulaComponents: FormulaComponent[]): string {
  let totalC = 0, totalM = 0, totalY = 0, totalK = 0;

  formulaComponents.forEach(({ cmyk, percentage }) => {
      const perc = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
      totalC += cmyk.c * (perc / 100);
      totalM += cmyk.m * (perc / 100);
      totalY += cmyk.y * (perc / 100);
      totalK += cmyk.k * (perc / 100);
  });

  // Asegurarse de que los valores no excedan 1
  totalC = Math.min(1, totalC);
  totalM = Math.min(1, totalM);
  totalY = Math.min(1, totalY);
  totalK = Math.min(1, totalK);

  return cmykToHex(totalC, totalM, totalY, totalK);
}


export function returnHexColorOld(
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
): Promise<FormulaComponent[]> {
  
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
      cmyk: pigment.cmyk,
      percentage: component ? component.percentage : 0,
    };
  });

  return hexValues;
}
