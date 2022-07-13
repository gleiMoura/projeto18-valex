import { verifyCardAndPassword } from "../utils/cardUtils.js";
import { findById } from "../repositories/businessRepository.js";
import { takeCardInformations } from "./informationCardService.js";
import { insert } from "../repositories/paymentRepository.js"

export async function doPurchase( id: number, password: string, businessId: number, amount:number ) {
    const card = await verifyCardAndPassword(id, password, "block");

    const business = await findById(businessId);
    if(!business) {
        throw {
            response:{
                message: "business doesn't exist in database",
                status: 404
            }
        }
    };

    if( card.type !== business.type ) {
        throw {
            response: {
                message: "card type is diferent from business type",
                status: 409
            }
        }
    }

    const balance = (await takeCardInformations( id )).balance;

    if( amount > balance ) {
        throw {
            response: {
                message: "There isn't enough balance to do this purchase",
                status: 409
            }
        }
    };

    const paymentData = {
        cardId: id,
        businessId,
        amount
    };

    await insert( paymentData );

    return paymentData
}   