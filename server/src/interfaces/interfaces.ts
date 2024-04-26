import { ObjectId } from "mongodb";

export interface UserInterface {
  _id?: ObjectId;
  email: string;
  password: string;
}
