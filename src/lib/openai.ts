import { createChat } from "completions";
import { OPENAI_API_KEY } from "../constants";
import {
  getPrivateKey1,
  get_balance,
  get_current_price,
  get_transactions,
  request_crypto,
  send_crypto,
  send_to_phoneno,
} from "../services/aiFunctions";
import { getPrivateKey } from "../solana-get/solana.service";

export const chat = createChat({
  apiKey: OPENAI_API_KEY,
  model: "gpt-3.5-turbo-0613",
  functions: [
    {
      name: "get_balance",
      description: "Get the current balance or wallet address of user wallet",
      parameters: {
        type: "object",
        properties: {
          phoneNo: {
            type: "string",
            description:
              "Returns wallet address and balance for a phone number of user. Balance of wallet will be in SOL example 10 Sol . ",
          },
          unit: { type: "string" },
        },
        required: ["phoneNo"],
      },
      function: async ({ phoneNo }) => {
        const res = await get_balance(phoneNo);
        return res;
      },
    },

    {
      name: "send_crypto",
      description:
        "Send solana [SOL] crypto money to another wallet address from your phone number. Send a confirmation on transaction success by sending explorer link else tell transaction failed",
      parameters: {
        type: "object",
        properties: {
          phoneNo: {
            type: "string",
            description: "Phone no of user from which money will be sent",
          },
          toAddress: {
            type: "string",
            description: "the address to which crypto money will be sent",
          },
          amount: {
            type: "number",
            description: "the amount of SOL crypto that needs to be sent",
          },

          unit: { type: "string" },
        },
        required: ["phoneNo", "toAddress", "amount"],
      },
      function: async ({ phoneNo, toAddress, amount }) => {
        const res = await send_crypto(phoneNo, toAddress, amount);
        return res;
      },
    },

    {
      name: "get_current_price",
      description:
        "Get current price / value of solana crypto tokens . If user gives amount of solana give price for that",
      parameters: {
        type: "object",
        properties: {
          amount: {
            type: "string",
            description: "Amount of solana",
          },
          unit: { type: "string" },
        },
      },
      function: async ({ amount }) => {
        const res = await get_current_price(amount);
        return res;
      },
    },

    {
      name: "request_crypto",
      description:
        "Request money from a phone number, send confirmation message on success",
      parameters: {
        type: "object",
        properties: {
          userPhoneNo: {
            type: "string",
            description:
              "mobile phone number of user requesting the amount and raising the request",
          },
          reuestedPhoneNo: {
            type: "string",
            description:
              "mobile phone number of user from which you want to request money",
          },
          amount: {
            type: "number",
            description: "the amount of SOL crypto that needs to be requested",
          },
          unit: { type: "string" },
        },
        required: ["reuestedPhoneNo", "userPhoneNo", "amount"],
      },
      function: async ({ amount, userPhoneNo, reuestedPhoneNo }) => {
        const res = await request_crypto(amount, userPhoneNo, reuestedPhoneNo);
        return res;
      },
    },

    {
      name: "send_to_phoneno",
      description:
        "send crypto to a phone number (a phone number is different from a wallet address it begins with an country extension like +91 followed by 10 numbers ) . return the status of transaction to user and link if available",
      parameters: {
        type: "object",
        properties: {
          fromPhoneNo: {
            type: "string",
            description: "Phone no of user sending prompt and money",
          },
          sendToPhoneNo: {
            type: "string",
            description: "mobile phone number of receiver",
          },
          amount: {
            type: "number",
            description: "the amount of SOL crypto that needs to be sent",
          },
          unit: { type: "string" },
        },
        required: ["sendToPhoneNo", "fromPhoneNo", "amount"],
      },
      function: async ({ amount, fromPhoneNo, sendToPhoneNo }) => {
        const res = await send_to_phoneno(amount, fromPhoneNo, sendToPhoneNo);
        return res;
      },
    },

    {
      name: "get_transactions",
      description:
        "to get the last transaction history of user. Take the signature ans show as https://explorer.solana.com/tx/<signature> for each transaction",
      parameters: {
        type: "object",
        properties: {
          phoneNo: {
            type: "string",
            description: "Phone no of user sending prompt and money",
          },
          limit: {
            type: "string",
            description:
              "optional property for limiting number of transactions to be shown",
          },
          unit: { type: "string" },
        },
        required: ["phoneNo"],
      },
      function: async ({ phoneNo, limit }) => {
        const res = await get_transactions(phoneNo, limit);
        return res;
      },
    },
    {
      name: "get_privateKey",
      description:
        "to get the private key, so that the wallet can be expoted to any external wallet as well. Private key is the secret key that is used to sign the transactions, also it should not be shared to anyone as it can be used to steal the money from the wallet",
      parameters: {
        type: "object",
        properties: {
          phoneNo: {
            type: "string",
            description: "Phone no of user sending prompt and money",
          },
          unit: { type: "string" },
        },
        required: ["phoneNo"],
      },
      function: async ({ phoneNo }) => {
        const res = await getPrivateKey1(phoneNo);
        return res;
      },
    },

  ],
  functionCall: "auto",
});
