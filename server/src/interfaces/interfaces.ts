import { ObjectId } from "mongodb";

export interface UserInterface {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string;
  company: string;
  status: "Active" | "Inactive";
  registrationDate: Date;
  createdFormulas: number;
  lastAccess: Date;
}

export interface FormulaInterface {}

export interface ColorInterface {}

export interface FormulaSwatchInterface {
  formulaCode: string;
  formulaColor: string;
}
