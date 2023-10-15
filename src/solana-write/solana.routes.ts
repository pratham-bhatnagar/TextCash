import { NextFunction, request, Request, Response, Router } from "express";
import validateQuery from "../middlewares/verify-quiery";
import { TransferRequestSchema, TransferRequest } from "./solana.schema";
import { Transfer } from "./solana.service";

const router = Router();

const handleTransferRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone, to, amount, password } = req.body as TransferRequest;
    const txHash = await Transfer(phone, password, to, amount);

    res.status(201).json({
      success: true,
      tranctionHash: txHash,
      explorer: `https://explorer.solana.com/tx/${txHash}?cluster=devnet`,
    });
  } catch (error) {
    next(error);
  }
};

router.post(
  "/transfer",
  validateQuery("body", TransferRequestSchema),
  handleTransferRequest
);

export default router;
