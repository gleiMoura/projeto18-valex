import { findPaymentByCardId } from "../repositories/paymentRepository.js";
import { findRechargeByCardId } from "../repositories/rechargeRepository.js";
import { findCardById } from "../repositories/cardRepository.js";

export async function takeCardInformations(id: number) {
    const payment = await findPaymentByCardId(id);
    const recharge = await findRechargeByCardId(id);
    const card = await findCardById(id);

    if (!card) {
        throw {
            response: {
                message: "Cannot show information: card doesn't exist in database",
                status: 404
            }
        }
    };

    const balance = doBalance(payment, recharge);
    
    const data = {
        balance,
        transactions: payment,
        recharges: recharge
    };

    return data
};

//auxiliate function
function doBalance(payment: Array<any>, recharge: Array<any>) {
    let sumPayment: number = 0;
    let sumRecharge: number = 0;

    if(payment.length !== 0) {
        const allPaymentAmount = payment.map(element => element.amount);
        sumPayment = allPaymentAmount.reduce((prev, curr) => prev + curr);
    }

    if(recharge.length !== 0 ) {
        const allRechargeAmount = recharge.map(element => element.amount);
        sumRecharge = allRechargeAmount.reduce((prev, curr) => prev + curr);
    };

   
    return sumRecharge - sumPayment;
}