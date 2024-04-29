import { Router, Request, Response } from "express";
import axios from "axios";
import bcrypt from "bcrypt";
import { createMongoDBConnection } from "../shared/mongodbConfig";
import { UserInterface } from "../interfaces/interfaces";
// import passport from "passport";
// import { initializePassport } from "../shared/passportConfig";
import { getUserByEmail } from "../shared/userServices";

// initializePassport(passport);

const router = Router();

router.get("/", (req: Request, res: Response) => {
  //   axios
  //     .get("https://jsonplaceholder.typicode.com/posts/1")
  //     .then((response) => {
  //       // console.log(response.data);
  //       res.json(response.data);
  //     })
  //     .catch((error) => console.log(error));
  res.json({ message: "Working" });
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const fetchedUser = await getUserByEmail(req.body.email);
    console.log(fetchedUser);

    if (fetchedUser === null) {
      res.status(401).json({ message: "No user with provided email" });
    } else {
      if (await bcrypt.compare(req.body.password, fetchedUser.password)) {
        res.json({ message: "Success" });
      } else {
        res.status(401).json({ message: "Wrong password" });
      }
    }
    // passport.authenticate("local");
    // console.log(req.user);
    // const db = await createMongoDBConnection();
    // const users = db.collection("users");
    // let allUsers = await users.find().toArray();
    // console.log(req.body);
    // console.log(req.body.email);
    // res.json(allUsers);
  } catch (error) {
    console.log(error);
  }
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const fetchedUser = await getUserByEmail(req.body.email);
    if (fetchedUser !== null) {
      res.status(401).json({ message: "Email already registered" });
    } else {
      const db = await createMongoDBConnection();
      const users = db.collection("users");

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const currentDate = new Date();

      const newUser: UserInterface = {
        email: req.body.email,
        password: hashedPassword,
        company: "",
        status: "active",
        registrationDate: currentDate,
        formulasCreated: 0,
        lastAccess: currentDate,
      };

      const insertNewUserResponse = await users.insertOne(newUser);

      res.json(insertNewUserResponse);
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
