import { COLORS, FONT_SIZE } from "./enum";
import { SxProps, Theme } from "@mui/material";

export const TEXTFIELD_STYLE_VALIDATION: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: COLORS.INPUT_BG,
    "& fieldset": {
      border: "1px solid black",
    },
    "&:hover fieldset": {
      border: "1px solid black",
    },
    "&.Mui-focused fieldset": {
      border: "2px solid black",
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: `0 0 0 1000px ${COLORS.INPUT_BG} inset !important`,
      WebkitTextFillColor: "black !important",
      transition: "background-color 5000s ease-in-out 0s",
    },
  },
  "& .MuiInputBase-input": {
    padding: "12px 14px",
    fontSize: FONT_SIZE.FS16,
    "&::placeholder": {
      color: "black !important",
      opacity: 1,
    },
  },
};

export const GLASS_CARD_STYLE: SxProps<Theme> = {
  background: "rgba(255, 255, 255, 0.6)",
  backdropFilter: "blur(20px)",
  webkitBackdropFilter: "blur(20px)",
  borderRadius: "32px",
  border: "1px solid rgba(255, 255, 255, 0.7)",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
  padding: "40px",
  width: "100%",
  maxWidth: "450px",
};

export const PRIMARY_BUTTON_STYLE: SxProps<Theme> = {
  borderRadius: "12px",
  padding: "12px",
  textTransform: "none",
  fontWeight: 600,
  fontSize: FONT_SIZE.FS16,
  background: "black",
  color: "white",
  border: "2px solid rgba(255, 255, 255, 0.1)", 
  boxShadow: "0 4px 14px 0 rgba(0,0,0,0.39)",
  "&:hover": {
    background: "#222222",
    boxShadow: "0 6px 20px rgba(0,0,0,0.23)",
  },
};

export const SOCIAL_BUTTON_STYLE: SxProps<Theme> = {
  borderRadius: "12px",
  border: "1px solid #E0E0E0",
  padding: "10px",
  minWidth: "auto",
  flex: 1,
  "&:hover": {
    backgroundColor: "#F5F5F5",
    borderColor: "#BDBDBD",
  },
};
