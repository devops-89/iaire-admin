import * as Yup from "yup";

export const loginValidationSchema = Yup.object().shape({
  identifier: Yup.string()
    .required("Please Enter Email or Username")
    .trim(),
  password: Yup.string()
    .required("Please Enter Password")
    .min(6, "Password must be at least 6 characters"),
});
