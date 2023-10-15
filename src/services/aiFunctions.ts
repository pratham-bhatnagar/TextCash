import { getBalnace } from "../solana-get/solana.service";
import { Transfer } from "../solana-write/solana.service";

export const get_balance = async (phoneNo: string) => {
  try {
    const { balance, publicKey } = await getBalnace(phoneNo);
    return {
      walletExits: true,
      balance: balance,
      address: publicKey,
      phoneNo: phoneNo,
    };
  } catch (error: any) {
    return error;
  }
};

export const send_crypto = async (
  phoneNo: string,
  toAddress: string,
  amount: number
) => {
  try {
    const { balance, publicKey } = await getBalnace(phoneNo);
    if (balance < amount) {
      return {
        success: false,
        message: "Not enough balance",
      };
    }
    const res = await Transfer(phoneNo, toAddress, amount);
    return {
      success: true,
      explorerLink: `https://explorer.solana.com/tx/${res}?cluster=devne`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error,
    };
  }
};
