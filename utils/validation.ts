import * as Yup from "yup";

export const loginValidationSchema = Yup.object().shape({
  identifier: Yup.string().required("Please Enter Email or Username").trim(),
  password: Yup.string()
    .required("Please Enter Password")
    .min(6, "Password must be at least 6 characters"),
});

export const batchValidationSchema = Yup.object({
  startDate: Yup.date().nullable().required("Start date is required"),
  endDate: Yup.date().nullable().required("End date is required"),
  userRole: Yup.object().nullable().required("Role is required"),
  category: Yup.object().nullable().required("Category is required"),
  questions: Yup.array().of(
    Yup.object({
      id: Yup.string(),
      question: Yup.string().required("Question cannot be empty"),
      type: Yup.string(),
      required: Yup.boolean(),
    }),
  ),
  mode: Yup.string().required("Please Select Training Mode"),
  name: Yup.string().required("Please Enter Batch Title").trim(),
  description: Yup.string().required("Please Enter Batch Description").trim(),
});

export const planValidationSchema = Yup.object({
  name: Yup.string().required("Please Enter Plan Name"),
  role: Yup.string().required("Please Select Role"),
  country: Yup.object().nullable().required("Please Select Country"),
  price: Yup.number().required("Please Enter Price"),
  billingCycle: Yup.string().required("Please Select Billing Cycle"),
  benefits: Yup.array().of(
    Yup.object({
      key: Yup.string().required("Please Enter Plan Benefit"),
      value: Yup.string().required("Please Enter Plan Benefit Limit"),
    }),
  ),
});
