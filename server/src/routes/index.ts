import { Router } from "express";
import usersRouter from "./userRoutes";
import homeRouter from "./homeRoutes";
import componentsRouter from "./componentRoutes";
import inkSystemsRouter from "./inkSystemRoutes";
import seriesRouter from "./seriesRoutes";

const router = Router();

router.use("/", homeRouter);
router.use("/users", usersRouter);
router.use("/components", componentsRouter);
router.use("/inkSystems", inkSystemsRouter);
router.use("/series", seriesRouter);

export default router;
