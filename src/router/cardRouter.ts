import Router from "express";
import { createCard, activateCard } from "../controllers/cardController.js";

const cardRouter = Router();

cardRouter.post("/card/create", createCard);

cardRouter.post("/card/activate", activateCard)

export default cardRouter;