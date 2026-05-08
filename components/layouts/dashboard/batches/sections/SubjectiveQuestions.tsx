import React from "react";
import { Box, Typography, Chip, Button, Stack, Card, IconButton, Grid, TextField } from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

interface SubjectiveQuestionsProps {
  formik: any;
  fontStyle: any;
}

const SubjectiveQuestions: React.FC<SubjectiveQuestionsProps> = ({ formik, fontStyle }) => {
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography sx={{ ...fontStyle, fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
          Subjective Questions <Chip label={formik.values.subjectiveQuestions.length} size="small" />
        </Typography>
        <Button 
          startIcon={<AddCircle />} 
          size="small" 
          onClick={() => formik.setFieldValue("subjectiveQuestions", [...formik.values.subjectiveQuestions, { question: "", answer: "" }])}
          sx={{ ...fontStyle, textTransform: "none" }}
        >
          Add Subjective
        </Button>
      </Box>
      <Stack spacing={2}>
        {formik.values.subjectiveQuestions.map((q: any, index: number) => (
          <Card key={index} variant="outlined" sx={{ p: 2, borderRadius: "12px", bgcolor: "rgba(0,0,0,0.01)" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography sx={{ ...fontStyle, fontWeight: 600, fontSize: 13 }}>Question {index + 1}</Typography>
              <IconButton 
                size="small" 
                color="error" 
                onClick={() => {
                  const newQs = [...formik.values.subjectiveQuestions];
                  newQs.splice(index, 1);
                  formik.setFieldValue("subjectiveQuestions", newQs);
                }}
              >
                <RemoveCircle fontSize="small" />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Question"
                  name={`subjectiveQuestions[${index}].question`}
                  value={q.question}
                  onChange={formik.handleChange}
                  sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: "8px", ...fontStyle } }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Ideal Answer"
                  multiline
                  rows={2}
                  name={`subjectiveQuestions[${index}].answer`}
                  value={q.answer}
                  onChange={formik.handleChange}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", ...fontStyle } }}
                />
              </Grid>
            </Grid>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default SubjectiveQuestions;
