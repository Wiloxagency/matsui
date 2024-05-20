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

export interface FormulaSwatchInterface {
  formulaCode: string;
  formulaSeries: string;
  formulaDescription: string;
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

export interface PigmentInterface {
  _id: {
    $oid: string;
  };
  code: string;
  description: string;
  serie: string;
  lab: number[];
  hex: string;
  cmyk: number[];
  rgb: number[];
}
