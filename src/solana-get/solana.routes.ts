import { NextFunction, Request, Response, Router } from "express";
import { getBalnace } from "./solana.service";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const router = Router();

 const handleGetBalanceRequest = async (
        req: Request,
        res: Response,
        next: NextFunction
        ) => {
        try {
            const {phone} = req.params;
            const { balance , publicKey} = await getBalnace(phone);
            res.status(201).json({
            success: true,
            balance_in_sol: balance / LAMPORTS_PER_SOL,
            publicKey: publicKey,
            });
        } catch (error) {
            next(error);
        }
        }

router.get('/get/balance/:phone', handleGetBalanceRequest);


export default router;