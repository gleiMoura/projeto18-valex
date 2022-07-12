import bcrypt from "bcrypt";
import { findCardById ,update } from "../repositories/cardRepository.js";
import { verifyCard } from "../utils/cardUtils.js"

//activate card
export async function activate( id: number, securityCode: string, password: string) {
    const card = await findCardById( id );

    verifyCard( id );

    if( card.isBlocked === false || card.password !== null ) {
        throw {
            response: {
                message: "Card is not valid",
                status: 422
            }
        }
    };

    if( card.securityCode !== securityCode ) {
        throw {
            response: {
                message: "Security code is not correct",
                status: 422
            }
        }
    };

    if( password.length !== 4 ) {
        throw {
            response: {
                message: "Password needs to have only 4 digits",
                status: 422
            }
        }
    };

    const cryptPassword= bcrypt.hashSync(password, 10);

    const cardData = {
        password: cryptPassword,
        isBlocked: false,
    };

    update( id, cardData );
};