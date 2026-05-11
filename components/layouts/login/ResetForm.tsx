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
            color: COLORS.TEXT_PRIMARY,
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
                  backgroundColor: "#F9FAFB",
                  transition: "all 0.2s",
                  "& fieldset": { border: "1px solid transparent" },
                  "&:hover fieldset": {
                    border: `1px solid #E5E7EB`,
                  },
                  "&.Mui-focused": {
                    backgroundColor: COLORS.WHITE,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    "& fieldset": {
                      border: `2px solid ${COLORS.PRIMARY_NAVY}`,
                    },
                  },
                  "& input": {
                    textAlign: "center",
                    padding: { xs: "12px 0", sm: "16px 0" },
                    fontWeight: 800,
                    fontSize: { xs: 20, sm: 24 },
                    fontFamily: outfit.style.fontFamily,
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
            color: COLORS.TEXT_PRIMARY,
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
                      color: COLORS.TEXT_SECONDARY,
                      fontSize: 20,
                    }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowNewPassword}
                    edge="end"
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
          textTransform: "none",
          transition: "all 0.3s ease",
          boxShadow: "0 10px 20px rgba(11, 23, 39, 0.15)",
          "&:hover": {
            background: "#1A293D",
            transform: "translateY(-3px)",
            boxShadow: "0 15px 30px rgba(11, 23, 39, 0.2)",
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
