import { Router, Request, Response } from "express";
import axios from "axios";
import bcrypt from "bcrypt";
import { createMongoDBConnection } from "../shared/mongodbConfig";
import { UserInterface } from "../interfaces/interfaces";
// import passport from "passport";
// import { initializePassport } from "../shared/passportConfig";
import { getUserByEmail } from "../shared/userServices";
import handlebars = require("handlebars");

import { promisify } from "util";
const fs = require("fs");
const readFile = promisify(fs.readFile);
import * as crypto from "crypto";
import { ObjectId } from "mongodb";

// TODO: SECURE THIS? 👇🏻
const encryptionKey = "0123456789abcdef0123456789abcdef";

// initializePassport(passport);

const router = Router();
const MAILGUN_PASSWORD: string = process.env.MAILGUN_PASSWORD as string;
const FRONTEND_URL: string = process.env.FRONTEND_URL as string;

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
        username: "",
        password: hashedPassword,
        company: "",
        status: "Unverified",
        registrationDate: currentDate,
        createdFormulas: 0,
        lastAccess: currentDate,
        // TEMP: emailVerificationLink
      };

      const insertNewUserResponse = await users.insertOne(newUser);

      const encryptedId = encrypt(String(insertNewUserResponse.insertedId));

      const decryptedId = decrypt(encryptedId);
      console.log("decryptedId: ", decryptedId);
      const emailVerificationLink =
        FRONTEND_URL + "/verification/" + encryptedId;

      const addEmailVerificationLinkToUser = await users.updateOne(
        { _id: insertNewUserResponse.insertedId },
        { $set: { TEMP: emailVerificationLink } }
      );

      sendVerificationEmail(emailVerificationLink);
      // console.log(String(insertNewUserResponse.insertedId));
      res.json(insertNewUserResponse);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/emailVerification", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const users = db.collection("users");
  const decryptedId = new ObjectId(decrypt(req.body.encryptedId));
  const activateUser = await users.updateOne(
    { _id: decryptedId },
    { $set: { status: "Active" } }
  );
  res.json(activateUser);
});

async function sendVerificationEmail(receivedEmailVerificationLink: string) {
  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "97da40881803eb",
      pass: "fa675f5f1506c7",
    },
  });
  // const transporter = nodemailer.createTransport({
  //   host: "smtp.mailgun.org",
  //   port: 587,
  //   secure: false, // Use `true` for port 465, `false` for all other ports
  //   auth: {
  //     user: "postmaster@sandboxd15c86dfa0e8480ea7c4711442934f64.mailgun.org",
  //     pass: MAILGUN_PASSWORD,
  //   },
  // });

  const source = fs
    .readFileSync("./src/emailTemplates/emailVerification.html", "utf-8")
    .toString();
  const template = handlebars.compile(source);

  const replacements = {
    emailVerificationLink: receivedEmailVerificationLink,
  };
  const htmlToSend = template(replacements);

  const info = await transporter.sendMail({
    from: '"This is a test 👻" <from@example.com', // sender address
    // from: '"This is a test 👻" <postmaster@sandboxd15c86dfa0e8480ea7c4711442934f64.mailgun.org>', // sender address
    to: "LeoLeto@proton.me", // list of receivers
    subject: "Hello ✔", // Subject line
    // text: "Hello world?", // plain text body
    html: htmlToSend, // html body
  });

  console.log("Message sent: %s", info.messageId);
}

// Encryption function
function encrypt(text: string): string {
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

// Decryption function
function decrypt(encryptedText: string): string {
  const textParts = encryptedText.split(":");
  const iv = Buffer.from(textParts.shift()!, "hex");
  const encryptedTextHex = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey),
    iv
  );
  let decrypted = decipher.update(encryptedTextHex);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export default router;
