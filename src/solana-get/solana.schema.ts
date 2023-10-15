import * as yup from "yup";
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const ExportKeysSchema = yup.object({
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .min(10, "too short")
    .max(10, "too long")
    .required(),
  password: yup.string().trim().required(),
});

export type ExportKeysRequest = yup.InferType<typeof ExportKeysSchema>;
