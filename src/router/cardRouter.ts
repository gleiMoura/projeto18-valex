import Router from "express";
import { createCard, activateCard, viewCardInformations } from "../controllers/cardController.js";

const cardRouter = Router();

cardRouter.post("/card/create", createCard);

cardRouter.post("/card/activate", activateCard);

cardRouter.get("/card/view", viewCardInformations);

export default cardRouter;