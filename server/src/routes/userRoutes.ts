import { Router, Request, Response } from "express";
import { createMongoDBConnection } from "../shared/mongodbConfig";
import handlebars = require("handlebars");
import { returnEncryptedString } from "../shared/stringEncryption";
const fs = require("fs");

const router = Router();

const FRONTEND_URL: string = process.env.FRONTEND_URL as string;

router.get("/", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const users = db.collection("users");
  const allUsers = await users.find().toArray();
  res.json(allUsers);
});

router.put("/", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const users = db.collection("users");
  const updateUser = await users.updateOne(
    { email: req.body.email },
    {
      $set: {
        username: req.body.username,
        company: req.body.company,
        status: req.body.status,
      },
    }
  );
  res.json(updateUser);
});

router.delete("/", async (req: Request, res: Response) => {
  const db = await createMongoDBConnection();
  const users = db.collection("users");
  const deleteUser = await users.deleteOne({ email: req.body.userEmail });
  res.json(deleteUser);
});

router.get("/:id", async (req: Request, res: Response) => {});

router.post("/SendEmail", async (req: Request, res: Response) => {
  try {
    // console.log(req.body);

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

    let source;
    let template;
    let replacements;
    let htmlToSend;

    if (!req.body.isResetPasswordEmail) {
      source = fs
        .readFileSync("./src/emailTemplates/generic.html", "utf-8")
        .toString();
      template = handlebars.compile(source);
      replacements = {
        message: req.body.message,
      };
      htmlToSend = template(replacements);
    } else {
      const db = await createMongoDBConnection();
      const users = db.collection("users");
      const fetchedUser = await users.findOne({
        email: req.body.recipients[0],
      });
      // console.log("fetchedUser: ", fetchedUser);
      source = fs
        .readFileSync("./src/emailTemplates/resetPassword.html", "utf-8")
        .toString();
      template = handlebars.compile(source);

      const encryptedId = returnEncryptedString(String(fetchedUser!._id));

      const resetPasswordLink =
        "https://" + FRONTEND_URL + "/resetPassword/" + encryptedId;

      replacements = {
        resetPasswordLink: resetPasswordLink,
      };
      htmlToSend = template(replacements);
    }

    // console.log("htmlToSend: ", htmlToSend);

    const sendEmail = await transporter.sendMail({
      from: '"Matsui Color 🖌️" <from@example.com', // sender address
      // from: '"This is a test 👻" <postmaster@sandboxd15c86dfa0e8480ea7c4711442934f64.mailgun.org>', // sender address
      to: req.body.recipients, // list of receivers
      subject: req.body.isResetPasswordEmail
        ? "Reset your password 🔑"
        : req.body.subject + " 🚀", // Subject line
      // text: "Hello world?", // plain text body
      html: htmlToSend, // html body
    });

    console.log("Message sent: %s", sendEmail.messageId);

    res.json({ message: "Message sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json();
  }
});

export default router;
