import bcrypt from "bcrypt";
import { verifyCard } from "../utils/cardUtils.js";
import { findCardById } from "../repositories/cardRepository.js";
import { update } from "../repositories/cardRepository.js";


export async function blockIt( id: number, password: string) {
    verifyCard( id );

    const card = await findCardById( id );
    const cryptPassword = card.password;
    verifyPassword( cryptPassword, password );

    update(id, {isBlocked: true})
}

//auxiliate function
function verifyPassword ( cryptPassword: string, password: string ) {
    
    const cryptBoolean = bcrypt.compareSync(password, cryptPassword)
    if(!cryptBoolean) {
        throw {
            response: {
                message: "invalid password",
                status: 422
            }
        }
    };
}