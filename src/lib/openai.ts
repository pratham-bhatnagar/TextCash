import { createChat, CancelledCompletionError } from "completions";
import { OPENAI_API_KEY } from "../constants";
import { SignUpUser } from "../auth/auth.service";
import { getBalnace } from "../solana-get/solana.service";

export const chat = createChat({
  apiKey: OPENAI_API_KEY,
  model: "gpt-3.5-turbo-0613",
  functions: [
    {
      name: "get_balance",
      description: "Get the current balance of user wallet",
      parameters: {
        type: "object",
        properties: {
          phoneNo: {
            type: "string",
            description:
              "Returns wallet address and balance for a phone number of user. Balance of wallet will be in SOL example 10 Sol",
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
  ],
  functionCall: "auto",
});

const get_balance = async (phoneNo: string) => {
  try {
    const { balance, publicKey } = await getBalnace(phoneNo);
    return {
      walletExits: true,
      balance: balance,
      publicKey,
      phoneNo: phoneNo,
    };
  } catch (error: any) {
    return error;
  }
};
