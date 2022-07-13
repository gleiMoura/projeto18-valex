import { Request, Response } from "express";
import { validateApiKey  } from "../utils/cardUtils.js";
import { doRecharge } from "../services/rechargeService.js";

export async function rechargeCard(req: Request, res: Response) {
    const { authorization } = req.headers;
    if( !authorization ) return res.status(422).send("Authorization problem"); 
    await validateApiKey( authorization, "withoutReturn" ); //business API KEY must be in database
    const { cardId, amount }: {cardId: number, amount: number} = req.body;

    await doRecharge(cardId, amount);

    res.sendStatus(200);
}