import { ComponentInterface, FormulaInterface } from "../interfaces/interfaces";

export const tempFormulas: FormulaInterface[] = [
  {
    formulaSeries: "301 RC NEO",
    formulaCode: "100 C",
    formulaDescription: "301 RC NEO 100 C",
    isActive: true,
    reportedAsError: false,
    components: [
      {
        componentCode: "CLR 301C",
        percentage: 89.025,
      },
      {
        componentCode: "MAT 301M",
        percentage: 10.65,
      },
      {
        componentCode: "YEL M3G",
        percentage: 0.325,
      },
    ],
  },
  {
    formulaSeries: "301 RC NEO",
    formulaCode: "BLUE 072 C",
    formulaDescription: "301 RC NEO BLUE 072 C",
    isActive: true,
    reportedAsError: false,
    components: [
      {
        componentCode: "CLR 301C",
        percentage: 94.25,
      },
      {
        componentCode: "MAT 301M",
        percentage: 3,
      },
      {
        componentCode: "BLU MB",
        percentage: 1.75,
      },
      {
        componentCode: "VLT MFB",
        percentage: 1,
      },
    ],
  },
  {
    formulaSeries: "BRITE DC NEO",
    formulaCode: "7439 C",
    formulaDescription: "BRITE DC NEO 7439 C",
    isActive: true,
    reportedAsError: false,
    components: [
      {
        componentCode: "BRT DC BASE",
        percentage: 90.322,
      },
      {
        componentCode: "AP TRS WHT",
        percentage: 9.301,
      },
      {
        componentCode: "PNK MB",
        percentage: 0.195,
      },
      {
        componentCode: "RED MFB",
        percentage: 0.082,
      },
      {
        componentCode: "GRN MB",
        percentage: 0.082,
      },
    ],
  },
];

export const tempComponents: ComponentInterface[] = [
  {
    formulaSeries: "301 RC NEO",
    componentCode: "CLR 301C",
    description: "Clear 301C",
    cost: 1,
    isActive: true,
  },
  {
    formulaSeries: "301 RC NEO",
    componentCode: "MAT 301M",
    description: "Matte 301M",
    cost: 1,
    isActive: true,
  },
  {
    formulaSeries: "301 RC NEO",
    componentCode: "YEL M3G",
    description: "Neo Yellow M3G",
    cost: 1,
    isActive: true,
  },
  {
    formulaSeries: "301 RC NEO",
    componentCode: "BLU MB",
    description: "Neo Blue MB",
    cost: 1,
    isActive: true,
  },
  {
    formulaSeries: "301 RC NEO",
    componentCode: "VLT MFB",
    description: "Neo Violet MFB",
    cost: 1,
    isActive: true,
  },

  {
    formulaSeries: "Brite DC Neo",
    componentCode: "BRT DC BASE",
    description: "Brite Discharge Base",
    cost: 1,
    isActive: true,
  },
  {
    formulaSeries: "Brite DC Neo",
    componentCode: "AP TRS WHT",
    description: "Alpha Trans White",
    cost: 1,
    isActive: true,
  },
  {
    formulaSeries: "Brite DC Neo",
    componentCode: "PNK MB",
    description: "Neo Pink MB",
    cost: 1,
    isActive: true,
  },
  {
    formulaSeries: "Brite DC Neo",
    componentCode: "RED MFB",
    description: "Neo Red MFB",
    cost: 1,
    isActive: true,
  },
  {
    formulaSeries: "Brite DC Neo",
    componentCode: "GRN MB",
    description: "Neo Green MB",
    cost: 1,
    isActive: true,
  },
];
