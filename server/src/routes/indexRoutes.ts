import { Router } from "express";
import usersRouter from "./userRoutes";
import homeRouter from "./homeRoutes";

const router = Router();

router.use("/", homeRouter);
router.use("/users", usersRouter);

export default router;
