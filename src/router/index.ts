import Router from "express";
import cardRouter from "../router/cardRouter.js";

const router = Router();

router.use(cardRouter);

export default router;