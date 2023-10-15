import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import Express, { Application, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import AuthRoutes from "./auth/auth.routes";
import errorHandler from "./errors/error.handler";
import { DatabaseService } from "./services/database.service";
import logger from "./services/logger.service";
import { chat } from "./lib/openai";
import SolanaGet from "./solana-get/solana.routes";
import SolanaWrite from "./solana-write/solana.routes";
import { SYSTEM_PROMPT } from "./constants";
import { LoginUser, SignUpUser } from "./auth/auth.service";
import { createChat } from "completions";
import { sendSMS } from "./lib/twilio";
import { twiml } from "twilio";

config();

const app: Application = Express();
app.use(Express.json());
app.use(cors());
app.set("trust proxy", true);
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.debug(message),
    },
  })
);

app.use(bodyParser.json({}));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/solget", SolanaGet);
app.use("/api/v1/solwrite", SolanaWrite);

app.post("/message", async function (req, res, next) {
  const db = await DatabaseService.getInstance().getDb("users", "global");
  const phone = req.body.From;
  const prompt = req.body.Body;
  console.log({ phone, prompt });
  const user = await db.findOne({
    phone: phone,
  });
  let REPLY = "";
  if (prompt.startsWith("pass:")) {
    const password = prompt.split("pass:")[1].trim();
    if (user) {
      //LOGIN
      try {
        const user = await LoginUser(phone, password);
        REPLY = "You are logged in for 15 minutes";
      } catch (error: any) {
        console.log(error);
      }
    } else {
      //create user
      try {
        const user = await SignUpUser(phone, password);
        REPLY = "You are logged in for 15 minutes";
      } catch (error: any) {
        console.log(error);
      }
    }
  } else {
    if (user) {
      // Check if the user is logged in
      console.log({ timeout: user.sessionTimeout });
      if (new Date() > user.sessionTimeout) {
        REPLY = "Enter password as 'pass:<password>' to login for 15 minutes.";
      } else {
        console.log("Prompt passed to OPENAI");
        const res = await chat.sendMessage(
          `My phone no is: ${phone} ${prompt}`
        );
        REPLY = res.content;
      }
    } else {
      REPLY =
        'User not found. Enter password as "pass:<password>" to login for 15 minutes.';
    }
  }
  console.log(REPLY);

  //for debugging
  res.send(REPLY);

  //twilio logic
  // const { MessagingResponse } = twiml;
  // const sms = new MessagingResponse();
  // sms.message(REPLY);
  // res.type("text/xml").send(sms.toString());
});

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(405).json({
    success: false,
    message: "Method Not Allowed!",
  });
});

app.use(errorHandler());

Promise.all([DatabaseService.getInstance().initialize()])
  .then(() => {
    app.listen(process.env.PORT!, () => {
      chat.addMessage({ role: "system", content: SYSTEM_PROMPT });
      logger.info(`Server running on Port: ${process.env.PORT}`);
    });
  })
  .catch((_) => {
    process.exit(1);
  });
process.on("SIGHUP", (_) => {
  process.exit(0);
});
process.on("SIGINT", (_) => {
  process.exit(0);
});

// {
//   ToCountry: 'US',
//   ToState: 'NC',
//   SmsMessageSid: 'SMed91e021021029096c2277e084bd8d9c',
//   NumMedia: '0',
//   ToCity: 'DURHAM',
//   FromZip: '',
//   SmsSid: 'SMed91e021021029096c2277e084bd8d9c',
//   FromState: '',
//   SmsStatus: 'received',
//   FromCity: '',
//   Body: 'Hi',
//   FromCountry: 'IN',
//   To: '+19192464077',
//   ToZip: '27707',
//   NumSegments: '1',
//   MessageSid: 'SMed91e021021029096c2277e084bd8d9c',
//   AccountSid: 'AC4b244d33c33b50be3e93716e4000eef3',
//   From: '+916232130044',
//   ApiVersion: '2010-04-01'
// }
