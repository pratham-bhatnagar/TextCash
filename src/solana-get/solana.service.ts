import { DatabaseService } from "../services/database.service";
import logger from "../services/logger.service";
import { errors } from "../errors/error.constants";
import * as solanaWeb3 from "@solana/web3.js";


export const getBalnace = async(phone:string) =>{
    const db = await DatabaseService.getInstance().getDb("users", "global");
    const userExists = await db.findOne({
        phone: phone,
    });
    if (!userExists) {
        logger.info(errors.USER_NOT_FOUND);
        throw errors.USER_NOT_FOUND;
    } else {
        const connection = new solanaWeb3.Connection(
            solanaWeb3.clusterApiUrl("devnet"),
            "confirmed"
        );
        const publicKey = new solanaWeb3.PublicKey(userExists.publicKey);
        const balance = await connection.getBalance(publicKey);
        return {balance: balance, publicKey: publicKey.toBase58()};
    }
}