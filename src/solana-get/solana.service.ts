import { DatabaseService } from "../services/database.service";
import logger from "../services/logger.service";
import { errors } from "../errors/error.constants";
import * as solanaWeb3 from "@solana/web3.js";
import * as bcrypt from "bcrypt";

export const getBalnace = async (phone: string) => {
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
    return { balance: balance, publicKey: publicKey.toBase58() };
  }
};

export const getPrivateKey = async (
  phone: string,
  password: string
): Promise<{ publicKey: string } | string> => {
  const db = await DatabaseService.getInstance().getDb("users", "global");
  const userExists = await db.findOne({
    phone: phone,
  });
  if (!userExists) {
    logger.info(errors.USER_NOT_FOUND);
    throw errors.USER_NOT_FOUND;
  } else {
    return new Promise<{ publicKey: string }>((resolve, reject) => {
      bcrypt
        .compare(password, userExists?.password)
        .then((valid) => {
          if (valid) {
            resolve({ publicKey: userExists?.privateKey });
          } else {
            logger.info(errors.INVALID_PASSWORD);
            reject("Invalid Password");
          }
        })
        .catch((err) => {
          logger.error(err);
          reject(err);
        });
    });
  }
};
