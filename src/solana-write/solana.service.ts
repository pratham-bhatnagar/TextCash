import * as bcrypt from "bcrypt";
import { DatabaseService } from "../services/database.service";
import logger from "../services/logger.service";
import { errors } from "../errors/error.constants";
import * as solanaWeb3 from "@solana/web3.js";

export const Transfer = async (
  phone: string,
  password: string,
  to: string,
  amount: number
) => {
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
      const privateKeyBuffer = Buffer.from(userExists?.privateKey, "hex");

      // from key pair
      const from_keypair = solanaWeb3.Keypair.fromSecretKey(privateKeyBuffer);

      // conection
      const connection = new solanaWeb3.Connection(
        solanaWeb3.clusterApiUrl("devnet")
      );

      const tx = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: from_keypair.publicKey,
          toPubkey: new solanaWeb3.PublicKey(to),
          lamports: amount * solanaWeb3.LAMPORTS_PER_SOL,
        })
      );

      tx.feePayer = from_keypair.publicKey;
      let txHash = await connection.sendTransaction(tx, [from_keypair]);
      return txHash;
    } else {
      logger.info(errors.INVALID_PASSWORD);
      throw errors.INVALID_PASSWORD;
    }
  }
};
