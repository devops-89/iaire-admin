"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FILE_DATA, RESOURCES_CATEGORY } from "@/utils/constant";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";
import { FileUploadDropzone } from "@/components/widgets/FileUploadDropzone";
import { useAddResource } from "@/hooks/common/useResources";
import {
  Autocomplete,
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required").trim(),
  description: Yup.string().required("Description is required").trim(),
  resourceType: Yup.object().nullable().required("Resource type is required"),
  fileType: Yup.object().nullable().required("File type is required"),
  file: Yup.mixed().nullable().required("Document file is required"),
});

const AddResourceLayout = () => {
  const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState(0);
  const { loading, addResources } = useAddResource();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      resourceType: null as { label: string; value: string } | null,
      fileType: null as { label: string; value: string } | null,
      file: null as File | null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title.trim());
      formData.append("description", values.description.trim());
      formData.append("section", values.resourceType!.value);
      formData.append("fileType", values.fileType!.value);
      formData.append("file", values.file!);

      const success = await addResources(formData);
      if (success) {
        router.push("/dashboard/resources");
      }
    },
  });

  const handleFileSelection = (selectedFile: File) => {
    formik.setFieldValue("file", selectedFile);
    formik.setFieldTouched("file", true, false);
    setUploadProgress(0);

    // Mock progress simulation
    const duration = 1200; // 1.2s total upload
    const intervalTime = 40;
    const steps = duration / intervalTime;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const nextProgress = Math.min(Math.round((step / steps) * 100), 100);
      setUploadProgress(nextProgress);
      if (nextProgress >= 100) {
        clearInterval(interval);
      }
    }, intervalTime);
  };

  const handleRemoveFile = () => {
    formik.setFieldValue("file", null);
    setUploadProgress(0);
  };

  const getAcceptFileType = () => {
    const fileTypeVal = formik.values.fileType?.value;
    if (fileTypeVal === "PDF") return ".pdf";
    if (fileTypeVal === "PPT") return ".ppt,.pptx";
    if (fileTypeVal === "VIDEOS") return "video/*";
    if (fileTypeVal === "IMAGES") return "image/*";
    return "*";
  };

  const FS = { fontFamily: poppins.style.fontFamily };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
      <Typography
        sx={{
          fontSize: 28,
          fontWeight: 700,
          fontFamily: poppins.style.fontFamily,
          color: COLORS.TEXT_PRIMARY,
          letterSpacing: -0.5,
        }}
      >
        Add Resources
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={12}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 9, md: 12 }}>
                <Grid container spacing={3}>
                  {/* Title Field */}
                  <Grid size={12}>
                    <TextField
                      label="Resource Title*"
                      name="title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.title && Boolean(formik.errors.title)
                      }
                      helperText={formik.touched.title && formik.errors.title}
                      fullWidth
                      disabled={loading}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                    />
                  </Grid>

                  {/* Resource Type Field */}
                  <Grid size={6}>
                    <Autocomplete
                      options={RESOURCES_CATEGORY}
                      getOptionLabel={(option) => option.label}
                      value={formik.values.resourceType}
                      disabled={loading}
                      onChange={(_, newValue) => {
                        formik.setFieldValue("resourceType", newValue);
                        formik.setFieldTouched("resourceType", true, false);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Please Select Resource Type*"
                          error={
                            formik.touched.resourceType &&
                            Boolean(formik.errors.resourceType)
                          }
                          helperText={
                            formik.touched.resourceType &&
                            (formik.errors.resourceType as string)
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* File Type Field */}
                  <Grid size={6}>
                    <Autocomplete
                      options={FILE_DATA}
                      getOptionLabel={(option) => option.label}
                      value={formik.values.fileType}
                      disabled={loading}
                      onChange={(_, newValue) => {
                        formik.setFieldValue("fileType", newValue);
                        formik.setFieldTouched("fileType", true, false);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Please Select File Type*"
                          error={
                            formik.touched.fileType &&
                            Boolean(formik.errors.fileType)
                          }
                          helperText={
                            formik.touched.fileType &&
                            (formik.errors.fileType as string)
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Description Field */}
          <Grid size={12}>
            <TextField
              label="Description*"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              fullWidth
              multiline
              rows={5}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Grid>

          {/* Document Upload Field */}
          <Grid size={12}>
            <Typography
              sx={{
                ...FS,
                fontSize: 14,
                fontWeight: 600,
                color: COLORS.TEXT_PRIMARY,
                mb: 1,
              }}
            >
              Upload Document*
            </Typography>

            <FileUploadDropzone
              file={formik.values.file}
              onFileSelect={handleFileSelection}
              onFileRemove={handleRemoveFile}
              uploadProgress={uploadProgress}
              accept={getAcceptFileType()}
              helperText={
                formik.values.fileType
                  ? `Select a ${formik.values.fileType.label} file to upload`
                  : "Supports PDF, PPT, Videos, Images (max 10MB)"
              }
              error={
                formik.touched.file ? (formik.errors.file as string) : undefined
              }
            />
          </Grid>

          {/* Form Actions */}
          <Grid size={12} sx={{ mt: 3 }}>
            <Stack
              direction="row"
              spacing={2}
              sx={{ justifyContent: "flex-end" }}
            >
              <Button
                onClick={() => router.push("/dashboard/resources")}
                variant="outlined"
                disabled={loading}
                sx={{
                  borderRadius: "12px",
                  borderColor: "rgba(0,0,0,0.15)",
                  color: COLORS.TEXT_SECONDARY,
                  textTransform: "none",
                  ...FS,
                  px: 4,
                  py: 1.2,
                  "&:hover": {
                    borderColor: "rgba(0,0,0,0.3)",
                    bgcolor: "rgba(0,0,0,0.02)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  background: `linear-gradient(135deg, ${COLORS.PRIMARY_NAVY} 0%, #1A293D 100%)`,
                  borderRadius: "12px",
                  textTransform: "none",
                  ...FS,
                  px: 4,
                  py: 1.2,
                  fontWeight: 600,
                  boxShadow: "0 6px 15px 0 rgba(11, 23, 39, 0.15)",
                  transition: "all 0.3s",
                  "&:hover": {
                    boxShadow: "0 8px 20px 0 rgba(11, 23, 39, 0.25)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Save Resource"
                )}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddResourceLayout;
