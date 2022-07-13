import { Request, Response } from "express";
import { doPurchase } from "../services/shoppService.js";

export async function shopp(req: Request, res: Response) {
    const { id, password, businessId, amount } = req.body;
    
    const paymentData = await doPurchase(id, password, businessId, amount);

    res.status(200).send(paymentData)
}