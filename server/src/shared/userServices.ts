import { UserInterface } from "../interfaces/interfaces";
import { createMongoDBConnection } from "./mongodbConfig";

export async function getUserByEmail(
  email: string
): Promise<UserInterface | null> {
  const db = await createMongoDBConnection();
  const users = db.collection("users");
  let user = await users.findOne({ email: email });
  // console.log(user);
  if (user !== null) {
    return {
      _id: user._id,
      email: user.email,
      username: user.username,
      password: user.password,
      company: user.company,
      status: user.status,
      registrationDate: user.registrationDate,
      createdFormulas: user.createdFormulas,
      lastAccess: user.lastAccess,
    };
  } else {
    return null;
  }
}
