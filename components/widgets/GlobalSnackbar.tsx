"use client";
import React from "react";
import { Snackbar, Alert } from "@mui/material";
import useSnackbar from "@/store/useSnackbar";

const GlobalSnackbar = () => {
  const { open, message, variant, hideSnackbar } = useSnackbar();

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={hideSnackbar}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={hideSnackbar}
        severity={variant}
        variant="filled"
        sx={{ width: "100%", borderRadius: "10px" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;
