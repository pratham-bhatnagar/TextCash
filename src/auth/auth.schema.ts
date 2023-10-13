// Purpose: Contains the schema for the auth module.
import * as yup from "yup";
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const SignupRequestSchema = yup.object({
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .min(10, "too short")
    .max(10, "too long")
    .required(),
  password: yup.string().trim().required(),
});

export type SignupRequest = yup.InferType<typeof SignupRequestSchema>;

export const LoginRequestSchema = yup.object({
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .min(10, "too short")
    .max(10, "too long")
    .required(),
  password: yup.string().trim().required(),
});

export type LoginRequest = yup.InferType<typeof LoginRequestSchema>;
