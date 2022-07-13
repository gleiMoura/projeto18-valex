import Router from "express";
import { rechargeCard } from "../controllers/rechargeController.js";
import rechargeSchema from "../schemas/rechargeSchema.js";
import schemaValidator from "../middlewares/schemasMiddleware.js";

const rechargeRouter = Router();

rechargeRouter.post("/recharge", schemaValidator(rechargeSchema), rechargeCard);

export default rechargeRouter;