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
  formulaSeries?: string
}

export interface FormulaComponentInterface {
  FormulaSerie: string;
  FormulaCode: string;
  FormulaDescription: string;
  ComponentCode: string;
  ComponentDescription: string;
  Percentage: number;
}
