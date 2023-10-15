import { NextFunction, Request, Response, Router } from "express";
import { getBalnace, getPrivateKey } from "./solana.service";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import validateQuery from "../middlewares/verify-quiery";
import { ExportKeysRequest, ExportKeysSchema } from "./solana.schema";

const router = Router();

const handleGetBalanceRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone } = req.params;
    const { balance, publicKey } = await getBalnace(phone);
    res.status(201).json({
      success: true,
      balance_in_sol: balance / LAMPORTS_PER_SOL,
      publicKey: publicKey,
    });
  } catch (error) {
    next(error);
  }
};

const handleExportAccountRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone, password } = req.body as ExportKeysRequest;
    const result = await getPrivateKey(phone, password);

    let privateKey: string;
    if (typeof result === "object" && "publicKey" in result) {
      privateKey = result.publicKey;
    } else {
      privateKey = result;
    }
    res.status(201).json({
      success: true,
      warning: "This is your private key, do not share it with anyone!",
      privateKey: privateKey,
    });
  } catch (error) {
    next(error);
  }
};

router.get("/get/balance/:phone", handleGetBalanceRequest);
router.post(
  "/get/privateKey",
  validateQuery("body", ExportKeysSchema),
  handleExportAccountRequest
);

export default router;
