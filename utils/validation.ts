import * as Yup from "yup";

export const loginValidationSchema = Yup.object().shape({
  identifier: Yup.string()
    .required("Please Enter Email or Username")
    .trim(),
  password: Yup.string()
    .required("Please Enter Password")
    .min(6, "Password must be at least 6 characters"),
});

export const batchValidationSchema = Yup.object({
  name: Yup.string().required("Batch name is required"),
  startDate: Yup.string().required("Start date is required"),
  endDate: Yup.string().required("End date is required"),
  category: Yup.string().required("Category is required"),
  userRole: Yup.string().required("User role is required"),
  subjectiveQuestions: Yup.array().of(
    Yup.object({
      question: Yup.string().required("Question is required"),
      answer: Yup.string().required("Answer is required"),
    })
  ),
  objectiveQuestions: Yup.array().of(
    Yup.object({
      question: Yup.string().required("Question is required"),
      options: Yup.array().of(Yup.string().required("Option is required")).min(4, "4 options required"),
      answer: Yup.string().required("Correct answer is required"),
    })
  ),
});
