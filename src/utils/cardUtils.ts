import dayjs from "dayjs";
import bcrypt from "bcrypt";
import { findCardById } from "../repositories/cardRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";


export async function validateApiKey(auth: string, withOrWithourReturn: string) {
    const token = auth?.replace("Bearer  ", "");
    const key = await findByApiKey(token);
    if ( !key ) throw {
        response: {
            message: "API KEY doesn't exist in database",
            status: 404,
            key
        }
    };

    if(withOrWithourReturn === "withReturn") {
        return key;
    }
};

//wish is to know if card is block or unblock
export async function verifyCardAndPassword( id: number, password: string, wish: string ) {
    verifyCard( id );

    const card = await findCardById( id );

    if( card.isBlocked === true && wish === "block" ||
        card.isBlocked === false && wish === "unlock") {
        if(wish === "block") {
            throw {
                response: {
                    message: "Card is blocked",
                    status: 409
                }
            }
        }else if (wish === "unlock") {
            throw {
                response: {
                    message: "Card is unlocked",
                    status: 422
                }
            }
        };
    };

    const cryptPassword = card.password;
    verifyPassword( password, cryptPassword );

    return card
}

// verify if card exist in database and if it is not expired
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

    const expirationDate = card.expirationDate;
    const message = validateExpirationDate( expirationDate );
    if(message !== null) {
        throw {
            response: {
                message,
                status: 422
            }
        }
    };
    
    return card
};

//auxiliate function
function validateExpirationDate( expirationDate: string ):string {
    const month = dayjs().format("MM");
    const year = dayjs().format("YY");

    const experDate = expirationDate.split("/");
    const experMonth = experDate[0];
    const experYear = experDate[1];
    
    if( experYear === year && experMonth < month ||
        experYear < year) {
            return "Card is expired";
        };
        
    return null;
};

function verifyPassword ( password: string, cryptPassword: string ) {
    const cryptBoolean = bcrypt.compareSync(password, cryptPassword);
    if(!cryptBoolean) {
        throw {
            response: {
                message: "invalid password",
                status: 422
            }
        }
    };
}