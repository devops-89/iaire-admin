import { CATEGORY_DATA, ROLES } from "@/utils/constant";
import { COLORS, QUESTION_TYPE, USER_ROLES } from "@/utils/enum";
import { roboto } from "@/utils/fonts";
import { Add, Delete } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React from "react";
import { useFormik } from "formik";
import { batchValidationSchema } from "@/utils/validation";
import { useBatches } from "@/hooks/common/useBatches";

const AddBatches = () => {
  const { createBatch, creating } = useBatches();
  const formik = useFormik({
    initialValues: {
      startDate: null,
      endDate: null,
      userRole: null as { label: string; value: string } | null,
      category: null as { label: string; value: string } | null,
      questions: [] as {
        id: string;
        question: string;
        type: string;
        required: boolean;
      }[],
    },
    validationSchema: batchValidationSchema,
    onSubmit: (values) => {
      const payload = {
        category: values.category?.value as string,
        userRole:
          values.userRole?.value === USER_ROLES.MENTOR
            ? USER_ROLES.TEACHER
            : (values.userRole?.value as string),
        startDate: values.startDate
          ? (values.startDate as any).toISOString()
          : "",
        endDate: values.endDate ? (values.endDate as any).toISOString() : "",
        questions: values.questions,
      };
      createBatch(payload);
    },
  });

  const handleAddQuestion = () => {
    formik.setFieldValue("questions", [
      ...formik.values.questions,
      {
        id: `q${formik.values.questions.length + 1}`,
        question: "",
        type: QUESTION_TYPE.TEXT,
        required: true,
      },
    ]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...formik.values.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], question: value };
    formik.setFieldValue("questions", updatedQuestions);
  };

  const handleDeleteQuestion = (indexToRemove: number) => {
    formik.setFieldValue(
      "questions",
      formik.values.questions.filter((_, index) => index !== indexToRemove),
    );
  };

  return (
    <Box>
      <Typography
        sx={{
          fontFamily: roboto.style.fontFamily,
          fontSize: 30,
          fontWeight: 700,
          textAlign: "left",
          mb: 3,
        }}
      >
        Add Batches
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Start Date"
              value={formik.values.startDate}
              onChange={(value) => formik.setFieldValue("startDate", value)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error:
                    formik.touched.startDate &&
                    Boolean(formik.errors.startDate),
                  helperText:
                    formik.touched.startDate &&
                    (formik.errors.startDate as string),
                },
              }}
              disablePast
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="End Date"
              value={formik.values.endDate}
              onChange={(value) => formik.setFieldValue("endDate", value)}
              minDate={formik.values.startDate || undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error:
                    formik.touched.endDate && Boolean(formik.errors.endDate),
                  helperText:
                    formik.touched.endDate && (formik.errors.endDate as string),
                },
              }}
              disablePast
            />
          </LocalizationProvider>

          <Autocomplete
            options={ROLES}
            getOptionLabel={(option) => option.label}
            value={formik.values.userRole}
            onChange={(_, newValue) =>
              formik.setFieldValue("userRole", newValue)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Role"
                error={
                  formik.touched.userRole && Boolean(formik.errors.userRole)
                }
                helperText={
                  formik.touched.userRole && (formik.errors.userRole as string)
                }
              />
            )}
          />

          <Autocomplete
            options={CATEGORY_DATA}
            getOptionLabel={(option) => option.label}
            value={formik.values.category}
            onChange={(_, newValue) =>
              formik.setFieldValue("category", newValue)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                error={
                  formik.touched.category && Boolean(formik.errors.category)
                }
                helperText={
                  formik.touched.category && (formik.errors.category as string)
                }
              />
            )}
          />

          {formik.values.questions.map((q, index) => {
            const questionErrors = formik.errors.questions as any[] | undefined;
            const questionTouched = formik.touched.questions as
              | any[]
              | undefined;
            const hasError =
              Boolean(questionTouched?.[index]?.question) &&
              Boolean(questionErrors?.[index]?.question);

            return (
              <Box
                key={index}
                sx={{ display: "flex", gap: 1, alignItems: "center" }}
              >
                <TextField
                  label={`Question ${index + 1}`}
                  fullWidth
                  value={q.question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  onBlur={() =>
                    formik.setFieldTouched(`questions[${index}].question`, true)
                  }
                  error={hasError}
                  helperText={
                    hasError ? questionErrors?.[index]?.question : undefined
                  }
                />
                <IconButton
                  onClick={() => handleDeleteQuestion(index)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </Box>
            );
          })}

          <Box sx={{ textAlign: "right" }}>
            <Button
              endIcon={<Add />}
              sx={{ color: COLORS.PRIMARY_NAVY }}
              onClick={handleAddQuestion}
            >
              Add Question
            </Button>
          </Box>

          <Button
            type="submit"
            sx={{
              backgroundColor: COLORS.PRIMARY_NAVY,
              border: `1px solid ${COLORS.PRIMARY_NAVY}`,
              width: 150,
              height: 40,
              borderRadius: 2,
              color: COLORS.WHITE,
              ":hover": {
                color: COLORS.PRIMARY_NAVY,
                backgroundColor: COLORS.TRANSPARENT,
              },
            }}
            disabled={creating}
          >
            {creating ? (
              <CircularProgress color="inherit" size={16} />
            ) : (
              "Submit"
            )}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default AddBatches;
