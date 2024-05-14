import { ObjectId } from "mongodb";

export interface UserInterface {
  _id?: ObjectId | any;
  username: string;
  email: string;
  password: string;
  company: string;
  status: "Active" | "Inactive";
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
    percentage: number;
  }[];
  inkSystem: string
}

export interface FormulaComponentInterface {
  formulaSeries: string;
  componentCode: string;
  description: string;
  cost: number;
  isActive: boolean;
}

export interface InkSystemInterface {
  code: string;
  name: string;
  description: string;
}
