"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const indexRoutes_1 = __importDefault(require("../routes/indexRoutes"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const corsOptions = {
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors_1.default);
app.use("/", indexRoutes_1.default);
// app.get("/", (req: Request, res: Response) => {
//   res.send("Working 2");
// });
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
