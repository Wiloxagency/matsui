import express, { Express, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import router from "./routes";
import bodyParser from "body-parser";
import { CronJob } from "cron";
import { wakeUpServer, wakeUpServerCron } from "./shared/crons";
// import passport from "passport";
// import session from "express-session";
// import { initializePassport } from "./shared/passportConfig";
// initializePassport(passport);

dotenv.config();

const app: Express = express();

const port = process.env.PORT || 3000;

const FRONTEND_URL: string = process.env.FRONTEND_URL as string;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 50000,
  })
);

const corsOptions: CorsOptions = {
  // origin: [FRONTEND_URL, "http://localhost:5173"],
  origin: "*",
  // credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// app.use(
//   session({
//     secret: "test",
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

app.use("/", router);

wakeUpServer();
wakeUpServerCron.start();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
