"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { useModal } from "@/store/useModal";
import useSnackbar from "@/store/useSnackbar";
import { TrainingControllers } from "@/app/api/trainingControllers";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";
import { PRIMARY_BUTTON_STYLE, TEXTFIELD_STYLE_VALIDATION } from "@/utils/style";

interface ScheduleInterviewProps {
  selectedTeacher: any;
  onSuccess?: () => void;
}

const FS = { fontFamily: poppins.style.fontFamily };

const ScheduleInterview: React.FC<ScheduleInterviewProps> = ({ selectedTeacher, onSuccess }) => {
  const { hideModal } = useModal();
  const { setSnackbar } = useSnackbar();
  const [interviewDate, setInterviewDate] = useState<Dayjs | null>(
    selectedTeacher?.interviewScheduledAt ? dayjs(selectedTeacher.interviewScheduledAt) : null
  );
  const [loading, setLoading] = useState(false);

  const handleConfirmSchedule = async () => {
    if (!interviewDate || !selectedTeacher) return;
    setLoading(true);
    try {
      const response: any = await TrainingControllers.scheduleInterview(
        selectedTeacher.id,
        interviewDate.toISOString()
      );
      if (response.data.success) {
        setSnackbar("Interview scheduled successfully", "success");
        hideModal();
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      setSnackbar(error.response?.data?.message || "Failed to schedule interview", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 0.5 }}>
      <Typography sx={{ fontWeight: 800, fontFamily: poppins.style.fontFamily, pb: 1.5, color: COLORS.PRIMARY_NAVY, fontSize: 20 }}>
        {selectedTeacher?.interviewScheduledAt ? "Reschedule Interview" : "Schedule Interview"}
      </Typography>

      <Typography variant="body2" sx={{ color: COLORS.TEXT_SECONDARY, mb: 4, ...FS }}>
        {selectedTeacher?.interviewScheduledAt
          ? `You are rescheduling the interview for `
          : `Select a date and time for the interview with `
        }
        <strong style={{ color: COLORS.BLACK }}>
          {selectedTeacher?.teacher?.fullName || `${selectedTeacher?.teacher?.firstName || ""} ${selectedTeacher?.teacher?.lastName || ""}`.trim()}
        </strong>.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDateTimePicker
            label="Interview Date & Time"
            value={interviewDate}
            onChange={(newValue: any) => setInterviewDate(newValue)}
            disablePast // Prevent past dates
            closeOnSelect={false}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
                sx: {
                  ...TEXTFIELD_STYLE_VALIDATION,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    backgroundColor: "rgba(11, 23, 39, 0.02)",
                  }
                }
              },
              toolbar: {
                hidden: false,
              },
              actionBar: {
                actions: ['cancel', 'accept'] // Very clear Cancel and OK buttons
              }
            }}
          />
        </LocalizationProvider>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
        <Button
          onClick={hideModal}
          sx={{
            ...FS,
            color: COLORS.TEXT_SECONDARY,
            textTransform: "none",
            fontWeight: 600,
            px: 3
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirmSchedule}
          disabled={loading || !interviewDate}
          sx={{
            ...PRIMARY_BUTTON_STYLE,
            width: "auto",
            px: 4,
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(11, 23, 39, 0.2)"
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : (selectedTeacher?.interviewScheduledAt ? "Update Schedule" : "Confirm Schedule")}
        </Button>
      </Box>
    </Box>
  );
};

export default ScheduleInterview;
