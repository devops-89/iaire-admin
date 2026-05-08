import React from "react";
import { Box, Typography, Chip, Button, Stack, Card, IconButton, Grid, TextField, MenuItem } from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

interface ObjectiveQuestionsProps {
  formik: any;
  fontStyle: any;
}

const ObjectiveQuestions: React.FC<ObjectiveQuestionsProps> = ({ formik, fontStyle }) => {
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography sx={{ ...fontStyle, fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
          Objective Questions <Chip label={formik.values.objectiveQuestions.length} size="small" />
        </Typography>
        <Button 
          startIcon={<AddCircle />} 
          size="small" 
          onClick={() => formik.setFieldValue("objectiveQuestions", [...formik.values.objectiveQuestions, { question: "", options: ["", "", "", ""], answer: "" }])}
          sx={{ ...fontStyle, textTransform: "none" }}
        >
          Add Objective
        </Button>
      </Box>
      <Stack spacing={2}>
        {formik.values.objectiveQuestions.map((q: any, index: number) => (
          <Card key={index} variant="outlined" sx={{ p: 2, borderRadius: "12px", bgcolor: "rgba(0,0,0,0.01)" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography sx={{ ...fontStyle, fontWeight: 600, fontSize: 13 }}>Question {index + 1}</Typography>
              <IconButton 
                size="small" 
                color="error" 
                onClick={() => {
                  const newQs = [...formik.values.objectiveQuestions];
                  newQs.splice(index, 1);
                  formik.setFieldValue("objectiveQuestions", newQs);
                }}
              >
                <RemoveCircle fontSize="small" />
              </IconButton>
            </Box>
            <TextField
              fullWidth
              size="small"
              label="Question"
              name={`objectiveQuestions[${index}].question`}
              value={q.question}
              onChange={formik.handleChange}
              sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: "8px", ...fontStyle } }}
            />
            <Grid container spacing={1}>
              {q.options.map((opt: string, optIndex: number) => (
                <Grid key={optIndex} size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label={`Option ${String.fromCharCode(65 + optIndex)}`}
                    name={`objectiveQuestions[${index}].options[${optIndex}]`}
                    value={opt}
                    onChange={formik.handleChange}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", ...fontStyle } }}
                  />
                </Grid>
              ))}
            </Grid>
            <TextField
              select
              fullWidth
              size="small"
              label="Correct Answer"
              name={`objectiveQuestions[${index}].answer`}
              value={q.answer}
              onChange={formik.handleChange}
              sx={{ mt: 1.5, "& .MuiOutlinedInput-root": { borderRadius: "8px", ...fontStyle } }}
            >
              {q.options.map((opt: string, optIndex: number) => (
                <MenuItem key={optIndex} value={opt || `Option ${String.fromCharCode(65 + optIndex)}`}>
                  {`Option ${String.fromCharCode(65 + optIndex)}`}: {opt || "(Empty)"}
                </MenuItem>
              ))}
            </TextField>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default ObjectiveQuestions;
