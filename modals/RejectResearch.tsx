"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Cancel } from "@mui/icons-material";
import { useModal } from "@/store/useModal";
import useSnackbar from "@/store/useSnackbar";
import { ResearchControllers } from "@/app/api/researchControllers";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";

interface RejectResearchProps {
  researchId: number | string;
  status: string;
  onSuccess?: () => void;
}

const FS = { fontFamily: poppins.style.fontFamily };

const RejectResearch: React.FC<RejectResearchProps> = ({
  researchId,
  status,
  onSuccess,
}) => {
  const { hideModal } = useModal();
  const { setSnackbar } = useSnackbar();
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirmReject = async () => {
    if (!researchId) return;
    setLoading(true);
    try {
      const response: any = await ResearchControllers.updateResearchStatus(
        researchId,
        { status, reviewComments: rejectReason || undefined },
      );
      if (response.success || response.statusCode === 200 || response.message) {
        setSnackbar("Research rejected", "success");
        hideModal();
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      setSnackbar(error.response?.data?.message || "Failed to reject", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 0.5 }}>
      <Typography
        sx={{
          ...FS,
          fontWeight: 700,
          fontSize: 18,
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            bgcolor: "rgba(239, 68, 68, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Cancel sx={{ color: COLORS.ERROR, fontSize: 20 }} />
        </Box>
        Reject Research
      </Typography>

      <Typography
        sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY, mb: 2.5 }}
      >
        You are about to reject this research submission. Optionally provide a
        reason for the rejection.
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Reason for rejection (optional)..."
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
        sx={{
          mb: 4,
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            fontFamily: poppins.style.fontFamily,
            fontSize: 14,
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: COLORS.ERROR,
            },
          },
        }}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
        <Button
          onClick={hideModal}
          sx={{
            ...FS,
            textTransform: "none",
            color: COLORS.TEXT_SECONDARY,
            borderRadius: "10px",
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirmReject}
          disabled={loading}
          sx={{
            ...FS,
            textTransform: "none",
            backgroundColor: COLORS.ERROR,
            borderRadius: "10px",
            px: 3,
            fontWeight: 600,
            "&:hover": { backgroundColor: "#DC2626" },
          }}
        >
          {loading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            "Confirm Reject"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default RejectResearch;
