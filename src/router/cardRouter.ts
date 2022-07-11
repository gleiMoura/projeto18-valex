import Router from "express";
import { createCard } from "../controllers/cardController.js";

const cardRouter = Router();

cardRouter.post("/createCard", createCard)

export default cardRouter;