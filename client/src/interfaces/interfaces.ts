// import { ObjectId } from "mongodb";

export interface UserInterface {
  // _id?: ObjectId;
  _id?: any;
  username: string
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
    componentCode: string[];
    percentage: number
  };
}

export interface ComponentInterface {
  formulaSeries: string;
  componentCode: string;
  description: string;
  cost: number;
  isActive: boolean;
}
