import { Router } from "express";
import usersRouter from "./userRoutes";
import homeRouter from "./homeRoutes";
import formulasRouter from "./formulaRoutes";
import componentsRouter from "./componentRoutes";

const router = Router();

router.use("/", homeRouter);
router.use("/users", usersRouter);
router.use("/formulas", formulasRouter);
router.use("/components", componentsRouter);

export default router;
