import { ObjectId } from "mongodb";

export interface UserInterface {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string;
  company: string;
  status: "Active" | "Inactive" | "Unverified";
  registrationDate: Date;
  createdFormulas: number;
  lastAccess: Date;
  phone: string;
  supplier: string;
  isAdmin?: boolean;
  TEMP?: string;
}

export interface FormulaInterface {}

export interface ColorInterface {}

export interface FormulaSwatchInterface {
  formulaCode: string;
  formulaColor: string;
  isUserCreatedFormula?: boolean;
  company?: string;
  createdBy?: string;
  isFormulaActive?: boolean;
  formulaSeries?: string;
  isHexColorAIProvided?: boolean;
}

export interface FormulaComponentInterface {
  FormulaSerie: string;
  FormulaCode: string;
  FormulaDescription: string;
  ComponentCode: string;
  ComponentDescription: string;
  Percentage: number;
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
