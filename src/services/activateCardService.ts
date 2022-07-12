import bcrypt from "bcrypt";
import dayjs from "dayjs"
import { findCardById, update } from "../repositories/cardRepository.js";

//activate card
export async function activate( id: number, securityCode: string, password: string) {
    const card = await findCardById( id );
    if( !card ) {
        throw {
            response: {
                message:"Card was not created yet",
                status: 404
            }
        }
    };

    const experationDate = card.expirationDate;
    const message = validateExperationDate( experationDate );
    if(message !== null) {
        throw {
            response: {
                message,
                status: 422
            }
        }
    };

    console.log(card.password)
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


function validateExperationDate( experationDate: string ):string {
    const month = dayjs().format("MM");
    const year = dayjs().format("YY");

    const experDate = experationDate.split("/");
    const experMonth = experDate[0];
    const experYear = experDate[1];
    
    if( experYear === year && experMonth < month ||
        experYear < year) {
            return "Card is expired";
        };
        
    return null;
}