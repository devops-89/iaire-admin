"use client";
import React, { useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { WarningAmber } from "@mui/icons-material";
import { useModal } from "@/store/useModal";
import useSnackbar from "@/store/useSnackbar";
import { CountriesControllers } from "@/app/api/countriesControllers";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";

interface ConfirmDeleteCountryProps {
  countryId: number;
  countryName: string;
  onSuccess: () => void;
}

const ConfirmDeleteCountry: React.FC<ConfirmDeleteCountryProps> = ({ countryId, countryName, onSuccess }) => {
  const { hideModal } = useModal();
  const { setSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response: any = await CountriesControllers.deleteCountry(countryId);
      if (response.data.success) {
        setSnackbar("Country deleted successfully", "success");
        hideModal();
        onSuccess();
      }
    } catch (error: any) {
      setSnackbar(
        error.response?.data?.message || "Failed to delete country",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 1, textAlign: "center" }}>
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          bgcolor: "rgba(244, 67, 54, 0.08)",
          color: COLORS.ERROR,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2.5
        }}
      >
        <WarningAmber sx={{ fontSize: 32 }} />
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontFamily: poppins.style.fontFamily,
          fontWeight: 700,
          color: COLORS.PRIMARY_NAVY,
          mb: 1
        }}
      >
        Delete Country?
      </Typography>

      <Typography
        sx={{
          fontFamily: poppins.style.fontFamily,
          fontSize: "14px",
          color: COLORS.TEXT_SECONDARY,
          lineHeight: 1.5,
          mb: 4,
          px: 2
        }}
      >
        Are you sure you want to delete <strong style={{ color: COLORS.PRIMARY_NAVY }}>{countryName}</strong>? This action is permanent and cannot be undone.
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          onClick={hideModal}
          disabled={loading}
          sx={{
            textTransform: "none",
            fontFamily: poppins.style.fontFamily,
            fontWeight: 600,
            color: COLORS.TEXT_SECONDARY,
            borderRadius: "10px",
            px: 3,
            py: 1
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: COLORS.ERROR,
            borderRadius: "10px",
            textTransform: "none",
            px: 4,
            py: 1,
            fontFamily: poppins.style.fontFamily,
            fontWeight: 600,
            "&:hover": { bgcolor: "#d32f2f" },
            boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
            transition: "all 0.2s ease"
          }}
        >
          {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Delete"}
        </Button>
      </Box>
    </Box>
  );
};

export default ConfirmDeleteCountry;
