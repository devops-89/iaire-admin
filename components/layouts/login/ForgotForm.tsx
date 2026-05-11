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
                <Email sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 20 }} />
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
          "Send Verification Code"
        )}
      </Button>
    </Box>
  );
};
