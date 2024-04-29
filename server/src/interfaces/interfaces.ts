import { ObjectId } from "mongodb";

export interface UserInterface {
  _id?: ObjectId;
  email: string;
  password: string;
  company: string;
  status: "active" | "inactive";
  registrationDate: Date;
  formulasCreated: number;
  lastAccess: Date;
}

export interface FormulaInterface {}

export interface ColorInterface {}
