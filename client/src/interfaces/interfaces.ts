import { ObjectId } from "mongodb";

export interface UserInterface {
  _id?:
    | ObjectId
    | {
        $oid: string;
      }
    | any;
  username: string;
  email: string;
  password: string;
  company: string;
  status: "Active" | "Inactive" | "Unverified";
  registrationDate: Date;
  createdFormulas: number;
  lastAccess: Date;
}

export interface FormulaInterface {
  formulaSeries: string;
  formulaCode: string;
  formulaDescription: string;
  isActive: boolean;
  reportedAsError: boolean;
  components: {
    componentCode: string;
    componentDescription: string;
    percentage: number;
    hex?: string;
  }[];
  inkSystem: string;
  createdBy?: string
}

export interface FormulaComponentInterface {
  _id?: any;
  FormulaSerie: string;
  FormulaCode: string;
  FormulaDescription: string;
  ComponentCode: string;
  ComponentDescription: string;
  // Percentage: number;
  Percentage: string;
  swatchColor?: string;
  hex?: string;
}

export interface InkSystemInterface {
  code: string;
  name: string;
  description: string;
}

export interface PigmentInterface {
  _id:
    | ObjectId
    | {
        $oid: string;
      }
    | any;
  code: string;
  description: string;
  serie: string;
  lab: number[];
  hex: string;
  cmyk: number[];
  rgb: number[];
  pricePerKg: number;
  isBase?: boolean;
}

export interface GetFormulasResultInterface {
  _id: string;
  formulaDescription: string;
  components: {
    componentCode: string;
    componentDescription: string;
    percentage: number;
    hex: string;
  }[];
  formulaSwatchColor: FormulaSwatchInterface;
}

export interface FormulaSwatchInterface {
  formulaCode: string;
  formulaColor: string;
  isUserCreatedFormula?: boolean;
  company?: string;
  createdBy?: string;
  isFormulaActive?: boolean;
}
