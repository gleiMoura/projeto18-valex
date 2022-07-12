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

export async function verifyToBlockOrUnlock( id: number, password: string, wish: string ) {
    verifyCard( id );

    const card = await findCardById( id );

    if( card.isBlocked === true && wish === "block" ||
        card.isBlocked === false && wish === "unlock") {
        if(wish === "block") {
            throw {
                response: {
                    message: "Card is aready blocked",
                    status: 409
                }
            }
        }else if (wish === "unlock") {
            throw {
                response: {
                    message: "Card is aready unlocked",
                    status: 422
                }
            }
        };
    };

    const cryptPassword = card.password;
    verifyPassword( password, cryptPassword );
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

    const experationDate = card.expirationDate;
    const message = validateExpirationDate( experationDate );
    if(message !== null) {
        throw {
            response: {
                message,
                status: 422
            }
        }
    };
};

//auxiliate function
function validateExpirationDate( experationDate: string ):string {
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