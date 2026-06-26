import React, { useState } from "react";
import { Box, Button, IconButton, InputAdornment, Typography, CircularProgress, TextField } from "@mui/material";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { COLORS } from "@/utils/enum";
import { poppins, outfit } from "@/utils/fonts";
import { CustomTextField } from "./CustomTextField";

interface ResetFormProps {
  otp: string;
  setOtp: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  handleResetSubmit: () => void;
  forgotLoading: boolean;
}

export const ResetForm: React.FC<ResetFormProps> = ({
  otp,
  setOtp,
  newPassword,
  setNewPassword,
  handleResetSubmit,
  forgotLoading,
}) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);

  // OTP Box Handling
  const otpArray = otp.split("").concat(Array(6).fill("")).slice(0, 6);
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtpArray = [...otpArray];
    newOtpArray[index] = value;
    const newOtp = newOtpArray.join("");
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography
          sx={{
            fontFamily: poppins.style.fontFamily,
            fontSize: "14px",
            fontWeight: 600,
            color: "rgba(255, 255, 255, 0.9)",
          }}
        >
          Verification Code
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1.5,
            justifyContent: "space-between",
          }}
        >
          {otpArray.map((digit, index) => (
            <TextField
              key={index}
              id={`otp-${index}`}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  transition: "all 0.2s ease-in-out",
                  color: COLORS.WHITE,
                  "& fieldset": { border: "none" },
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    border: `1px solid ${COLORS.PRIMARY_NAVY}`,
                    boxShadow: "0 0 16px rgba(1, 90, 80, 0.25)",
                  },
                  "& input": {
                    textAlign: "center",
                    padding: { xs: "12px 0", sm: "16px 0" },
                    fontWeight: 800,
                    fontSize: { xs: 20, sm: 24 },
                    fontFamily: outfit.style.fontFamily,
                    color: COLORS.WHITE,
                  },
                },
              }}
            />
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          mt: 1,
        }}
      >
        <Typography
          sx={{
            fontFamily: poppins.style.fontFamily,
            fontSize: "14px",
            fontWeight: 600,
            color: "rgba(255, 255, 255, 0.9)",
          }}
        >
          New Password
        </Typography>
        <CustomTextField
          fullWidth
          name="new-password"
          type={showNewPassword ? "text" : "password"}
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Lock
                    sx={{
                      color: "rgba(255, 255, 255, 0.4)",
                      fontSize: 20,
                      ml: 0.5,
                    }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowNewPassword}
                    edge="end"
                    sx={{ color: "rgba(255, 255, 255, 0.4)", mr: 0.5 }}
                  >
                    {showNewPassword ? (
                      <VisibilityOff sx={{ fontSize: 20 }} />
                    ) : (
                      <Visibility sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Button
        fullWidth
        variant="contained"
        onClick={handleResetSubmit}
        disabled={forgotLoading || otp.length < 6 || !newPassword}
        sx={{
          mt: 2,
          padding: "16px",
          fontSize: "16px",
          fontWeight: 600,
          fontFamily: poppins.style.fontFamily,
          borderRadius: "16px",
          background: COLORS.PRIMARY_NAVY,
          color: COLORS.WHITE,
          textTransform: "none",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 8px 24px rgba(1, 90, 80, 0.3)",
          "&:hover": {
            background: "#017a6d",
            transform: "translateY(-2px)",
            boxShadow: "0 12px 32px rgba(1, 90, 80, 0.45)",
          },
          "&:disabled": {
            background: "rgba(255, 255, 255, 0.12)",
            color: "rgba(255, 255, 255, 0.3)",
            boxShadow: "none",
          },
        }}
      >
        {forgotLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Update Password"
        )}
      </Button>
    </Box>
  );
};

