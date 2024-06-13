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

router.get("/wakeUpServer", (req: Request, res: Response) => {
  //   axios
  //     .get("https://jsonplaceholder.typicode.com/posts/1")
  //     .then((response) => {
  //       // console.log(response.data);
  //       res.json(response.data);
  //     })
  //     .catch((error) => console.log(error));
  res.json("ok");
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const fetchedUser = await getUserByEmail(req.body.email);
    // console.log(fetchedUser);

    if (fetchedUser === null) {
      res.status(401).json({ message: "No user with provided email" });
    } else {
      if (await bcrypt.compare(req.body.password, fetchedUser.password)) {
        if (fetchedUser.status === "Unverified") {
          res.json({ message: "User unverified" });
          return;
        }
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
      const hashedId = await bcrypt.hash(req.body._id, 10);
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const currentDate = new Date();

      const newUser: UserInterface = {
        email: req.body.email,
        username: "",
        password: hashedPassword,
        company: "",
        status: "Unverified",
        registrationDate: currentDate,
        createdFormulas: 0,
        lastAccess: currentDate,
      };

      const insertNewUserResponse = await users.insertOne(newUser);

      res.json(insertNewUserResponse);
    }
  } catch (error) {
    console.log(error);
  }
});

async function sendVerificationEmail() {
  const nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "maddison53@ethereal.email",
      pass: "jn7jnAPss4f63QBp6D",
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    to: "Lexp2008@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

export default router;
