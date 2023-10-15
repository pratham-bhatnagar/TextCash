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
    return {
      success: false,
      message: "User is not on TextWallet. An invite has been sent to them.",
    };
  } else {
    const connection = new solanaWeb3.Connection(
      solanaWeb3.clusterApiUrl("devnet"),
      "confirmed"
    );
    const publicKey = new solanaWeb3.PublicKey(userExists.publicKey);
    const balance = await connection.getBalance(publicKey);
    return { balance: balance/solanaWeb3.LAMPORTS_PER_SOL , publicKey: publicKey.toBase58() };
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

export const getSolanaPrice = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
  );
  const data = await response.json();
  return data.solana.usd;
};

export const getTransactionHistory = async (
  address: string,
  limit: number | null
) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "getSignaturesForAddress",
    params: [address, { limit: limit ?? 100 }],
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const response = await fetch("https://api.devnet.solana.com", requestOptions);
  const data = await response.json();
  return data;
};
