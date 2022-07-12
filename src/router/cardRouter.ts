import Router from "express";
import { createCard, activateCard, viewCardInformations, blockCard } from "../controllers/cardController.js";

const cardRouter = Router();

cardRouter.post("/card/create", createCard);

cardRouter.post("/card/activate", activateCard);

cardRouter.get("/card/view", viewCardInformations);

cardRouter.post("/card/block", blockCard)

export default cardRouter;