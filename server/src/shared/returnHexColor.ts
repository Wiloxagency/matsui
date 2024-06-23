import { FormulaComponentInterface } from "../interfaces/interfaces";
import { createMongoDBConnection } from "./mongodbConfig";

//TODO: COMBINE BOTH FUNCTIONS INTO 1 👇🏻

type FormulaComponent = {
  cmyk: { c: number; m: number; y: number; k: number };
  percentage: number | string; // Porcentaje de este color en la mezcla (debe sumar 100% en total)
  isBase?: boolean;
};



function cmykToHex(c: number, m: number, y: number, k: number): string {
  
  console.info("cmyk in cmykToHex:", c, m, y, k);

  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);

  const toHex = (value: number) => {
      const hex = Math.round(value).toString(16).padStart(2, '0');
      return hex.length === 1 ? '0' + hex : hex;
  };

  console.info("toHex:", toHex);

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function adjustPercentages(components: FormulaComponent[]): FormulaComponent[] {
  // Filtrar los componentes que no son base
  const filteredComponents = components.filter(component => !component.isBase);

  // Calcular la suma total de los porcentajes actuales
  const totalPercentage = filteredComponents.reduce((sum, component) => {
      const perc = typeof component.percentage === 'string' ? parseFloat(component.percentage) : component.percentage;
      return sum + perc;
  }, 0);

  // Ajustar cada porcentaje para que la suma sea 100%
  const adjustedComponents = filteredComponents.map(component => {
      const perc = typeof component.percentage === 'string' ? parseFloat(component.percentage) : component.percentage;
      const adjustedPercentage = (perc / totalPercentage) * 100;
      return { ...component, percentage: adjustedPercentage };
  });

  // Redondear los porcentajes ajustados para que sumen exactamente 100
  const roundedComponents = adjustedComponents.map(component => ({
      ...component,
      percentage: Math.round(component.percentage)
  }));

  // Ajustar la diferencia acumulada debido a redondeos
  const totalRoundedPercentage = roundedComponents.reduce((sum, component) => sum + component.percentage, 0);
  const difference = 100 - totalRoundedPercentage;

  if (difference !== 0) {
      roundedComponents[0].percentage += difference;
  }

  return roundedComponents;
}

export function returnHexColor(formulaComponents: FormulaComponent[]): string {
  const adjustedComponents = adjustPercentages(formulaComponents);

  console.info("adjustedComponents:", adjustedComponents);

  let totalC = 0, totalM = 0, totalY = 0, totalK = 0;

  adjustedComponents.forEach(({ cmyk, percentage }) => {
      const perc = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
      totalC += cmyk.c * (perc / 100);
      totalM += cmyk.m * (perc / 100);
      totalY += cmyk.y * (perc / 100);
      totalK += cmyk.k * (perc / 100);
      console.info("cmyk / perc:", cmyk, percentage);
  });

  console.info("Before conver to 1:", totalC, totalM, totalY, totalK);

  // Asegurarse de que los valores no excedan 1
  totalC = Math.min(1, totalC / 100);
  totalM = Math.min(1, totalM / 100);
  totalY = Math.min(1, totalY / 100);
  totalK = Math.min(1, totalK / 100);

  let hexValue = cmykToHex(totalC, totalM, totalY, totalK);

  console.info("hexValue:", hexValue);

  return hexValue;
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
    isBase: item.isBase
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
      cmyk: { c: pigment.cmyk[0], 
              m: pigment.cmyk[1],
              y: pigment.cmyk[2],
              k: pigment.cmyk[3]},
      percentage: component ? component.percentage : 0,
      isBase: pigment.isBase
    };
  });

  return hexValues;
}
