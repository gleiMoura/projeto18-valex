import Router from "express";
import { shopp } from "../controllers/shoppingController.js"
import schemaValidator from "../middlewares/schemasMiddleware.js";
import shoppigSchema from "../schemas/shppingSchema.js";

const shoppingRouter = Router();

shoppingRouter.post("/shopping", schemaValidator(shoppigSchema), shopp);

export default shoppingRouter;