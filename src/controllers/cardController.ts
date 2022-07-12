import { Request, response, Response } from "express";
import { CreateCardInDatabase, validateApiKey, validateEmployeeAndCard} from "../services/createCardService.js";
import { activate } from "../services/activateCardService.js";
import { takeCardInformations } from "../services/informationCardService.js";
import { blockIt } from "../services/blockCardService.js";


export async function createCard(req: Request, res: Response) {
    const { authorization } = req.headers;
    if( !authorization ) return res.status(422).send("Authorization problem"); 
    await validateApiKey( authorization ); //business API KEY must be in database

    const { employeeId, type }:{employeeId: number, type: string} = req.body;
    await validateEmployeeAndCard( employeeId, type );

    const data = await CreateCardInDatabase( employeeId, type ); //send data to activate card (id, securityCode)

    res.status(201).send( data );
};

export async function activateCard(req: Request, res: Response) {
    const { id, securityCode, password }:{id:number, securityCode:string, password:string} =req.body;
    
    await activate( id, securityCode, password );

    res.sendStatus( 200 );
};

export async function viewCardInformations(req: Request, res: Response) {
    const { id } = req.body;
    
    const data = await takeCardInformations( id );

    res.status(200).send( data );
};

export async function blockCard(req: Request, res: Response) {
    const {id , password} = req.body;

    blockIt( id, password );

    res.sendStatus(200);
};
