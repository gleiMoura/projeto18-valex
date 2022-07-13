import Router from "express";
import { createCard, activateCard, viewCardInformations, blockCard, unlockCard } from "../controllers/cardController.js";
import createSchema from "../schemas/createSchema.js";
import activateSchema from "../schemas/activateSchema.js";
import schemaValidator from "../middlewares/schemasMiddleware.js";
import blockSchema from "../schemas/blockSchema.js";

const cardRouter = Router();

cardRouter.post("/card/create", schemaValidator(createSchema), createCard);

cardRouter.post("/card/activate", schemaValidator(activateSchema), activateCard);

cardRouter.get("/card/view", viewCardInformations);

cardRouter.post("/card/block",schemaValidator(blockSchema) ,blockCard);

cardRouter.post("/card/unlock",schemaValidator(blockSchema) ,unlockCard)

export default cardRouter;