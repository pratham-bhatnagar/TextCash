// Auth service for user signup and login
import { DatabaseService } from "../services/database.service";
import * as bcrypt from "bcrypt";
import logger from "../services/logger.service";
import { errors } from "../errors/error.constants";
import * as solanaWeb3 from "@solana/web3.js";

export const SignUpUser = async (phone: string, password: string): Promise<{ publicKey: string } | string> => {
  const db = await DatabaseService.getInstance().getDb("users", "global");
  const keypair = solanaWeb3.Keypair.generate();
  const privateKeyHex = Array.from(keypair.secretKey)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  const userExist = await db.findOne({
    phone: phone,
  });
  if (userExist) {
    throw errors.USER_ALREADY_EXIST;
  } else {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, function (err, salt) {
        if (!err) {
          bcrypt.hash(password, salt, async function (err, hash) {
            if (!err) {
              await db.insertOne({
                phone: phone,
                password: hash,
                privateKey: privateKeyHex,
                publicKey: keypair.publicKey.toBase58(),
              });
              resolve({ publicKey: keypair.publicKey.toBase58() });
            } else {
              logger.info(err);
              reject("Error in hashing password");
            }
          });
        } else {
          logger.info(err);
          reject("Error in generating salt");
        }
      });
    });
  }
};
  
export const LoginUser = async (phone: string, password: string) => {
  const db = await DatabaseService.getInstance().getDb("users", "global");
  const userExists = await db.findOne({
    phone: phone,
  });
  if (!userExists) {
    logger.info(errors.USER_NOT_FOUND);
    throw errors.USER_NOT_FOUND;
  } else {
    const valid = await bcrypt.compare(password, userExists?.password);
    if (valid) {
      return userExists;
    } else {
      logger.info(errors.INVALID_PASSWORD);
      throw errors.INVALID_PASSWORD;
    }
  }
};
