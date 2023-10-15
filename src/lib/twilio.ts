import twilio, { twiml } from "twilio";
import {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NO,
} from "../constants";

export const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export function sendSMS(phone: any, message: any) {
  try {
    twilioClient.messages.create({
      body: message,
      from: TWILIO_PHONE_NO,
      to: phone,
    });
  } catch (e) {
    console.log("Error sending twilio mssg ", e);
  }
}
