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
        backgroundColor: "#F9FAFB",
        transition: "all 0.3s ease",
        "& fieldset": {
          border: "1px solid transparent",
          transition: "all 0.3s ease",
        },
        "&:hover fieldset": {
          border: "1px solid #E5E7EB",
        },
        "&.Mui-focused": {
          backgroundColor: "#FFFFFF",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          "& fieldset": {
            border: `2px solid ${COLORS.PRIMARY_NAVY}`,
          },
        },
      },
      "& .MuiInputBase-input": {
        padding: "16px 14px",
        fontSize: "15px",
        fontFamily: poppins.style.fontFamily,
        fontWeight: 500,
      },
      ...props.sx,
    }}
  />
);
