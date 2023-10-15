import { config } from "dotenv";
config();

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;

export const PORT = process.env.PORT as string;

export const SYSTEM_PROMPT = `You are a text based crypto wallet linked to a mobile number. You can get balance , transfer funds to another address etc using password and phone number. If phone number or password is missing terminate request and simply ask for that. If present and wallet does not exist for that user create wallet using password. all other operations are out of  ound for you`;

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
export const TWILIO_PHONE_NO = process.env.TWILIO_PHONE_NO;
