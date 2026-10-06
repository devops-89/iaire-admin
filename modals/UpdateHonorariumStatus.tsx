"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import { CheckCircle, Cancel, EditNote } from "@mui/icons-material";
import { useModal } from "@/store/useModal";
import useSnackbar from "@/store/useSnackbar";
import { HonorariumControllers } from "@/app/api/honorariumControllers";
import { poppins } from "@/utils/fonts";
import { COLORS, HONORARIUM_STATUS } from "@/utils/enum";
import { HonorariumItem } from "@/utils/type";

interface UpdateHonorariumStatusProps {
  honorarium: HonorariumItem;
  onSuccess?: () => void;
}

const FS = { fontFamily: poppins.style.fontFamily };

const STATUS_LIST = [
  { label: "Pending", value: HONORARIUM_STATUS.PENDING },
  { label: "Approved", value: HONORARIUM_STATUS.APPROVED },
  { label: "Transaction Pending", value: HONORARIUM_STATUS.TRANSACTION_PENDING },
  { label: "Paid", value: HONORARIUM_STATUS.PAID },
  { label: "Rejected", value: HONORARIUM_STATUS.REJECTED },
];

const UpdateHonorariumStatus: React.FC<UpdateHonorariumStatusProps> = ({
  honorarium,
  onSuccess,
}) => {
  const { hideModal } = useModal();
  const { setSnackbar } = useSnackbar();

  const [selectedStatus, setSelectedStatus] = useState<string>(
    honorarium?.status || HONORARIUM_STATUS.PENDING
  );
  const [amount, setAmount] = useState<string>(
    honorarium?.amount !== null && honorarium?.amount !== undefined
      ? String(honorarium.amount)
      : ""
  );
  const [remarks, setRemarks] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const mentorName =
    honorarium?.creator?.fullName ||
    (honorarium?.creator?.firstName
      ? `${honorarium.creator.firstName} ${honorarium.creator.lastName || ""}`.trim()
      : "--");

  const handleSubmit = async () => {
    if (!honorarium?.id) return;
    setSubmitting(true);
    try {
      const payload: any = {
        status: selectedStatus,
        ...(amount !== "" && !isNaN(Number(amount)) && { amount: Number(amount) }),
        ...(remarks.trim() && { remarks: remarks.trim() }),
      };

      const response: any = await HonorariumControllers.updateHonorariumStatus(
        honorarium.id,
        payload
      );

      if (response?.data?.success) {
        setSnackbar(
          response.data.message || "Honorarium status updated successfully",
          "success"
        );
        hideModal();
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      setSnackbar(
        error?.response?.data?.message || "Failed to update honorarium status",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 0.5 }}>
      {/* Title */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "10px",
            bgcolor: COLORS.STATUS_INFO_BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <EditNote sx={{ color: COLORS.INFO, fontSize: 24 }} />
        </Box>
        <Box>
          <Typography sx={{ ...FS, fontWeight: 700, fontSize: 17, color: COLORS.PRIMARY_NAVY }}>
            Update Honorarium Status
          </Typography>
          <Typography sx={{ ...FS, fontSize: 12.5, color: COLORS.TEXT_SECONDARY }}>
            Request #{honorarium?.id} for{" "}
            <strong style={{ color: COLORS.TEXT_PRIMARY, textTransform: "capitalize" }}>
              {mentorName}
            </strong>
          </Typography>
        </Box>
      </Box>

      {/* Form Fields */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
        {/* Status Dropdown */}
        <FormControl fullWidth size="small">
          <InputLabel id="honorarium-status-label" sx={{ ...FS, fontSize: 13.5 }}>
            Select Status
          </InputLabel>
          <Select
            labelId="honorarium-status-label"
            value={selectedStatus}
            label="Select Status"
            onChange={(e) => setSelectedStatus(e.target.value)}
            sx={{
              ...FS,
              fontSize: "13.5px",
              borderRadius: "10px",
              bgcolor: COLORS.BG_LIGHT,
            }}
          >
            {STATUS_LIST.map((opt) => (
              <MenuItem key={opt.value} value={opt.value} sx={{ ...FS, fontSize: 13 }}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Amount Field */}
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Honorarium Amount (optional)"
          placeholder="e.g. 5000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              sx: { ...FS, fontSize: 13.5 },
            },
            inputLabel: { sx: { ...FS, fontSize: 13.5 } },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              bgcolor: COLORS.BG_LIGHT,
            },
          }}
        />

        {/* Remarks / Reason */}
        <TextField
          fullWidth
          size="small"
          multiline
          rows={3}
          label="Remarks / Notes (optional)"
          placeholder="Provide any additional comments or reason for this status update..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          slotProps={{
            input: { sx: { ...FS, fontSize: 13.5 } },
            inputLabel: { sx: { ...FS, fontSize: 13.5 } },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              bgcolor: COLORS.BG_LIGHT,
            },
          }}
        />
      </Box>

      {/* Footer Actions */}
      <Box
        sx={{
          mt: 3.5,
          pt: 2,
          borderTop: `1px solid ${COLORS.BORDER_GRAY}`,
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
        }}
      >
        <Button
          onClick={hideModal}
          disabled={submitting}
          variant="outlined"
          sx={{
            ...FS,
            fontSize: "13px",
            borderColor: COLORS.BORDER_GRAY,
            color: COLORS.TEXT_PRIMARY,
            textTransform: "none",
            borderRadius: "8px",
            px: 2.5,
            "&:hover": { borderColor: COLORS.PRIMARY_NAVY, bgcolor: COLORS.HOVER_BG },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          variant="contained"
          sx={{
            ...FS,
            fontSize: "13px",
            bgcolor: COLORS.PRIMARY_NAVY,
            color: COLORS.WHITE,
            textTransform: "none",
            borderRadius: "8px",
            px: 3,
            "&:hover": { bgcolor: COLORS.SECONDARY_NAVY },
          }}
        >
          {submitting ? (
            <CircularProgress size={18} sx={{ color: COLORS.WHITE }} />
          ) : (
            "Save Changes"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateHonorariumStatus;
