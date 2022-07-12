import dayjs from "dayjs";
import { findCardById } from "../repositories/cardRepository.js";

// verify if card exist in database, if it is not expired and if it is not blocked
export async function verifyCard( id: number) {
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

    if( card.isBlocked === false || card.password !== null ) {
        throw {
            response: {
                message: "Card is not valid",
                status: 422
            }
        }
    };
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