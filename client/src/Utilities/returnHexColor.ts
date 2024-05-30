export function returnHexColor(
  formulaComponents: {
    componentCode: string;
    componentDescription: string;
    // OLD FORMULAS HAVE THEIR COMPONENT PERCENTAGES SET AS STRINGS 👇🏻
    percentage: number | string;
    hex: string;
  }[]
): string {
  //   console.log("formulaComponents: ", formulaComponents);

  const convertedFormulaComponents = formulaComponents.map((component) => {
    return { color: component.hex, percentage: Number(component.percentage) };
  });

  const hexValues = convertedFormulaComponents;

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
