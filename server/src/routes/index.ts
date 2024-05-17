import { Router } from "express";
import usersRouter from "./userRoutes";
import homeRouter from "./homeRoutes";
import componentsRouter from "./componentRoutes";
import inkSystemsRouter from "./inkSystemRoutes";

const router = Router();

router.use("/", homeRouter);
router.use("/users", usersRouter);
router.use("/components", componentsRouter);
router.use("/inkSystems", inkSystemsRouter);

export default router;
