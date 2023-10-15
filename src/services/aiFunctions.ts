import { sendSMS } from "../lib/twilio";
import { getBalnace, getSolanaPrice } from "../solana-get/solana.service";
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
    if (balance! < amount) {
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

export const get_current_price = async (amount: number | null) => {
  try {
    const multiplier = amount ? amount : 1;
    const value = await getSolanaPrice();
    return {
      valueOf1: value,
      valueOfAmount: value * multiplier,
      currency: "USD",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error,
    };
  }
};

export const request_crypto = async (
  amount: number,
  userPhoneNo: string,
  requestedPhoneNo: string
) => {
  try {
    await sendSMS(
      requestedPhoneNo,
      `${userPhoneNo} requested ${amount} SOL. Type a password 'pass:<password>' to login/signup to TextWallet and send money to them.`
    );
    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error,
    };
  }
};

export const send_to_phoneno = async (
  amount: number,
  fromPhoneNo: string,
  sendToPhoneNo: string
) => {
  try {
    const res = await getBalnace(sendToPhoneNo);
    console.log({ amount, fromPhoneNo, sendToPhoneNo, add: res.publicKey });
    if (res.publicKey) {
      const r = await Transfer(fromPhoneNo, res.publicKey, amount);
      return {
        success: true,
        message: `${amount}SOL sent to ${sendToPhoneNo}`,
        explorerLink: `https://explorer.solana.com/tx/${r}?cluster=devne`,
      };
    } else {
      await sendSMS(
        sendToPhoneNo,
        `${fromPhoneNo} wants to send ${amount} SOL. Type a password 'pass:<password>' to signup for TextWallet to send and receive crypto through text messaging.`
      );
      return {
        success: false,
        message: `${sendToPhoneNo} has not signed up for TextWallet. We have sent them an invite. Try again once they have signed up`,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error,
    };
  }
};
