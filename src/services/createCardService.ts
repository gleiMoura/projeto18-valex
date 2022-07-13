import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";
import { findById } from "../repositories/employeeRepository.js";
import { findByTypeAndEmployeeId, insert} from "../repositories/cardRepository.js";

//create card

export async function validateEmployeeAndCard(employeeId: number, cardType: any) {
    const idFromDB = await findById(employeeId);

    //verify if employee is is in database
    if (!idFromDB) throw {
        response: {
            message: "employee is not in database",
            status: 404
        }
    };

    const cardTypes: string[] = ['groceries', 'restaurant', 'transport', 'education', 'health'];
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

    const { id } = await findByTypeAndEmployeeId(type, employeeId);

    if(!id) {
        throw {
            response: {
                message: "this id is not in database",
                status: 404
            }
        }
    }

    return { id, securityCode }
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

