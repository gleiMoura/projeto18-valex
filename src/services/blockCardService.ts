import { update } from "../repositories/cardRepository.js";
import {  verifyToBlockOrUnlock } from "../utils/cardUtils.js"

export async function blockIt( id: number, password: string) {
    if(!id || !password) {
        throw{
            response:{
                "message": "Data is incorrect",
                status: 422
            }
        }
    }
    await verifyToBlockOrUnlock( id, password, "block" )

    update(id, {isBlocked: true})
}