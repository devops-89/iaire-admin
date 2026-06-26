import React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { COLORS } from "@/utils/enum";
import { poppins } from "@/utils/fonts";

export const CustomTextField = (props: TextFieldProps) => (
  <TextField
    {...props}
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: "16px",
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        color: COLORS.WHITE,
        "& fieldset": {
          border: "none",
        },
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
        },
        "&.Mui-focused": {
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          border: `1px solid ${COLORS.PRIMARY_NAVY}`,
          boxShadow: `0 0 20px rgba(1, 90, 80, 0.25)`,
        },
        "&.Mui-error": {
          border: `1px solid ${COLORS.ERROR}`,
          boxShadow: `0 0 15px rgba(244, 67, 54, 0.15)`,
        },
        "& input:-webkit-autofill": {
          WebkitBoxShadow: `0 0 0 1000px #091322 inset !important`,
          WebkitTextFillColor: `${COLORS.WHITE} !important`,
          transition: "background-color 5000s ease-in-out 0s",
        },
      },
      "& .MuiInputBase-input": {
        padding: "16px 16px 16px 8px",
        fontSize: "15px",
        fontFamily: poppins.style.fontFamily,
        fontWeight: 500,
        color: COLORS.WHITE,
        "&::placeholder": {
          color: "rgba(255, 255, 255, 0.4)",
          opacity: 1,
        },
      },
      "& .MuiFormHelperText-root": {
        marginLeft: "12px",
        marginTop: "6px",
        fontSize: "12px",
        fontFamily: poppins.style.fontFamily,
        fontWeight: 500,
        "&.Mui-error": {
          color: "#FF5252",
        },
      },
      ...props.sx,
    }}
  />
);

