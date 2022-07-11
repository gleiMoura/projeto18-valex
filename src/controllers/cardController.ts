import { Request, Response } from "express";
import { CreateCardInDatabase, validateApiKey, validateEmployeeAndCard } from "../services/cardService.js";


export async function createCard(req: Request, res: Response) {
    const { authorization } = req.headers;
    if( !authorization ) return res.status(422).send("Authorization problem"); 
    await validateApiKey( authorization ); //business API KEY must be in database

    const { employeeId, type }:{employeeId: number, type: string} = req.body;
    await validateEmployeeAndCard( employeeId, type );

    await CreateCardInDatabase( employeeId, type );

    res.sendStatus(201);
}