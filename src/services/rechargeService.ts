
import { insert } from "../repositories/rechargeRepository.js";
import { verifyCard } from "../utils/cardUtils.js";

export async function doRecharge ( cardId:number, amount: number ) {

    const card = await verifyCard( cardId );

    if( card.isBlocked === true ) {
        throw {
            response:{
                message: "card is blocked",
                status: 409
            }
        }
    }

    if( amount <= 0 ) {
        throw {
            response: {
                message: "value is not valid",
                status: 422
            }
        }
    };

    const data = {
        cardId,
        amount
    }
    await insert(data);
}