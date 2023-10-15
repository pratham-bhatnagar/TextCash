// Purpose: All routes related to auth will be here
import { NextFunction, request, Request, Response, Router } from "express";
import validateQuery from "../middlewares/verify-quiery";
import {
  SignupRequestSchema,
  SignupRequest,
  LoginRequest,
  LoginRequestSchema,
} from "./auth.schema";
import { LoginUser, SignUpUser } from "./auth.service";

const router = Router();

const handleSignupRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone, password } = req.body as SignupRequest;
    const result = await SignUpUser(phone, password);
    let publicKey: string;
    if (typeof result === "object" && "publicKey" in result) {
      publicKey = result.publicKey;
    } else {
      publicKey = result;
    }

    res.status(201).json({
      success: true,
      status: `${phone} Successfully SignedUp`,
      publicKey: publicKey,
    });
  } catch (error) {
    next(error);
  }
};

const handleLoginRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone, password } = req.body as LoginRequest;
    const user = await LoginUser(phone, password);
    res.status(200).json({
      success: true,
      status: `${phone} Successfully LoggedIn`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

router.post(
  "/signup",
  validateQuery("body", SignupRequestSchema),
  handleSignupRequest
);

router.post(
  "/login",
  validateQuery("body", LoginRequestSchema),
  handleLoginRequest
);

export default router;
