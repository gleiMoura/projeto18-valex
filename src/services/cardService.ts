import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";
import bcrypt from "bcrypt";
import { findByApiKey } from "../repositories/companyRepository.js";
import { findById } from "../repositories/employeeRepository.js";
import { findByTypeAndEmployeeId, insert, findCardById, update } from "../repositories/cardRepository.js";

//create card
export async function validateApiKey(auth: string) {
    const token = auth?.replace("Bearer  ", "");
    const key = await findByApiKey(token);
    if ( !key ) throw {
        response: {
            message: "API KEY doesn't exist in database",
            status: 404,
            key
        }
    };
};

export async function validateEmployeeAndCard(employeeId: number, cardType: any) {
    const idFromDB = await findById(employeeId);

    //verify if employee is is in database
    if (!idFromDB) throw {
        response: {
            message: "employee is not in database",
            status: 404
        }
    };

    const cardTypes: string[] = ['groceries', 'restaurants', 'transport', 'education', 'health'];
    //verify if card type is valid
    let type: string = '';
    cardTypes.forEach(element => {
        if(element === cardType) {
            type = element
        }
    })

    if (type === '') {
        throw {
            response: {
                message: "type is not valid",
                status: 422
            }
        }
    };

    //verify if employee have this kind of card
    const card = await findByTypeAndEmployeeId(cardType, employeeId);
    if (card?.type === type) {
        throw {
            response: {
                message: "Employee have this kind of card",
                status: 409
            }
        }
    };
}

export async function CreateCardInDatabase(employeeId: number, type: any) {
    const number = faker.finance.creditCardNumber();

    const { fullName } = await findById(employeeId);
    const cardholderName = constructFullName(fullName); //use auxiliate function

    const expirationDate = constructExperateDate();

    const cvv = faker.finance.creditCardCVV();
    
    const cryptr = new Cryptr( 'cuidadossaonecessarios' );
    const securityCode = cryptr.encrypt( cvv );


    const cardInsertData = {
        employeeId,
        number,
        cardholderName,
        securityCode,
        expirationDate,
        password: null,
        isVirtual: false,
        originalCardId: null,
        isBlocked: true,
        type
    }

    insert( cardInsertData );

    const { id } : {id:number} = await findByTypeAndEmployeeId(type, employeeId);

    return { id, securityCode }
};


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

//auxiliate functions
function constructFullName(name: string) {
    const upperName = name.toUpperCase()
    const arrayName = upperName.split(" ");

    let midleName = '';
    for (let i = 1; i < arrayName.length - 1; i++) {
        if (arrayName[i] === "DE" ||
            arrayName[i] === "DA" ||
            arrayName[i] === "DO") {
            midleName += '';
        } else {
            midleName += arrayName[i][0] + " ";
        }
    };

    return `${arrayName[0]} ${midleName}${arrayName[arrayName.length - 1]}`;
};

function constructExperateDate() {
    const year = parseInt(dayjs().format('YY')) + 5;
    return dayjs().format(`MM/${year}`);
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