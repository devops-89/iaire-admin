"use client";
import React, { useState } from "react";
import { Box, Button, CircularProgress, Grid, TextField, Typography, InputAdornment } from "@mui/material";
import { Public, Flag, Phone, Paid } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useModal } from "@/store/useModal";
import useSnackbar from "@/store/useSnackbar";
import { CountriesControllers } from "@/app/api/countriesControllers";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";

interface AddCountryProps {
  onSuccess?: () => void;
}

const AddCountry: React.FC<AddCountryProps> = ({ onSuccess }) => {
  const { hideModal } = useModal();
  const { setSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Country name is required"),
    code: Yup.string().required("Country code is required"),
    phoneCode: Yup.string().required("Phone dial code is required"),
    currencyCode: Yup.string().required("Currency code is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      code: "",
      phoneCode: "",
      currencyCode: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response: any = await CountriesControllers.createCountry(values);
        if (response.data.success) {
          setSnackbar("Country added successfully", "success");
          hideModal();
          if (onSuccess) onSuccess();
        }
      } catch (error: any) {
        setSnackbar(
          error.response?.data?.message || "Failed to add country",
          "error"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box sx={{ p: 0.5 }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: poppins.style.fontFamily,
            fontWeight: 700,
            color: COLORS.PRIMARY_NAVY,
            fontSize: "20px",
            letterSpacing: "-0.5px",
            mb: 0.5
          }}
        >
          Add New Country
        </Typography>
        <Typography
          sx={{
            fontFamily: poppins.style.fontFamily,
            fontSize: "12px",
            color: "rgba(9, 9, 11, 0.4)",
            fontWeight: 500
          }}
        >
          Add supported country locations to configure pricing plans and regions.
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2.5}>
          <Grid size={12}>
            <Typography sx={{ fontSize: "12px", fontWeight: 600, mb: 1, fontFamily: poppins.style.fontFamily, color: "rgba(9, 9, 11, 0.65)" }}>
              Country Name
            </Typography>
            <TextField
              fullWidth
              name="name"
              placeholder="Enter Country Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Public sx={{ color: "rgba(9, 9, 11, 0.35)", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  style: { borderRadius: "10px", fontFamily: poppins.style.fontFamily, fontSize: "13px" }
                }
              }}
            />
          </Grid>

          <Grid size={4}>
            <Typography sx={{ fontSize: "12px", fontWeight: 600, mb: 1, fontFamily: poppins.style.fontFamily, color: "rgba(9, 9, 11, 0.65)" }}>
              ISO Code
            </Typography>
            <TextField
              fullWidth
              name="code"
              placeholder="Enter ISO Code (e.g. KR)"
              value={formik.values.code}
              onChange={formik.handleChange}
              error={formik.touched.code && Boolean(formik.errors.code)}
              helperText={formik.touched.code && formik.errors.code}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Flag sx={{ color: "rgba(9, 9, 11, 0.35)", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  style: { borderRadius: "10px", fontFamily: poppins.style.fontFamily, fontSize: "13px" }
                }
              }}
            />
          </Grid>

          <Grid size={4}>
            <Typography sx={{ fontSize: "12px", fontWeight: 600, mb: 1, fontFamily: poppins.style.fontFamily, color: "rgba(9, 9, 11, 0.65)" }}>
              Dial Code
            </Typography>
            <TextField
              fullWidth
              name="phoneCode"
              placeholder="Enter Dial Code (e.g. +82)"
              value={formik.values.phoneCode}
              onChange={formik.handleChange}
              error={formik.touched.phoneCode && Boolean(formik.errors.phoneCode)}
              helperText={formik.touched.phoneCode && formik.errors.phoneCode}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: "rgba(9, 9, 11, 0.35)", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  style: { borderRadius: "10px", fontFamily: poppins.style.fontFamily, fontSize: "13px" }
                }
              }}
            />
          </Grid>

          <Grid size={4}>
            <Typography sx={{ fontSize: "12px", fontWeight: 600, mb: 1, fontFamily: poppins.style.fontFamily, color: "rgba(9, 9, 11, 0.65)" }}>
              Currency
            </Typography>
            <TextField
              fullWidth
              name="currencyCode"
              placeholder="Enter Currency Code (e.g. KRW)"
              value={formik.values.currencyCode}
              onChange={formik.handleChange}
              error={formik.touched.currencyCode && Boolean(formik.errors.currencyCode)}
              helperText={formik.touched.currencyCode && formik.errors.currencyCode}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Paid sx={{ color: "rgba(9, 9, 11, 0.35)", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  style: { borderRadius: "10px", fontFamily: poppins.style.fontFamily, fontSize: "13px" }
                }
              }}
            />
          </Grid>

          <Grid size={12} sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
            <Button
              onClick={hideModal}
              disabled={loading}
              sx={{
                textTransform: "none",
                fontFamily: poppins.style.fontFamily,
                fontWeight: 600,
                fontSize: "13px",
                color: COLORS.TEXT_SECONDARY,
                borderRadius: "10px",
                px: 3,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: COLORS.PRIMARY_NAVY,
                borderRadius: "10px",
                textTransform: "none",
                px: 4,
                py: 1.2,
                fontFamily: poppins.style.fontFamily,
                fontWeight: 600,
                fontSize: "13px",
                boxShadow: "0 4px 12px rgba(9, 9, 11, 0.15)",
                "&:hover": {
                  bgcolor: COLORS.SECONDARY_NAVY,
                  boxShadow: "0 6px 16px rgba(9, 9, 11, 0.25)",
                },
                transition: "all 0.2s ease"
              }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Add Country"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddCountry;
