import { config } from "dotenv";
config();

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;

export const PORT = process.env.PORT as string;

export const SYSTEM_PROMPT = `You are a text based crypto wallet linked to a mobile number. Return in same language as prompt. You can get balance , transfer funds to another address etc using phone number. If a simple question answer it but if it's a complex instruction cant be done reply We are not able to do that right now but are rapidly deploying new features.`;

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
export const TWILIO_PHONE_NO = process.env.TWILIO_PHONE_NO;
