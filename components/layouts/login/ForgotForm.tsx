import React from "react";
import { Box, Button, InputAdornment, CircularProgress } from "@mui/material";
import { Email } from "@mui/icons-material";
import { COLORS } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import { CustomTextField } from "./CustomTextField";

interface ForgotFormProps {
  identifier: string;
  setIdentifier: (val: string) => void;
  handleForgotSubmit: () => void;
  forgotLoading: boolean;
}

export const ForgotForm: React.FC<ForgotFormProps> = ({
  identifier,
  setIdentifier,
  handleForgotSubmit,
  forgotLoading,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <CustomTextField
        fullWidth
        placeholder="Email address"
        value={identifier}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value)}
        error={!!identifier && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)}
        helperText={
          !!identifier && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
            ? "Please enter a valid email address"
            : ""
        }
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: "rgba(255, 255, 255, 0.4)", fontSize: 20, ml: 0.5 }} />
              </InputAdornment>
            ),
          },
        }}
      />
      <Button
        fullWidth
        variant="contained"
        onClick={handleForgotSubmit}
        disabled={
          forgotLoading ||
          !identifier ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
        }
        sx={{
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
          "Send Verification Code"
        )}
      </Button>
    </Box>
  );
};

