"use client";
import { useModal } from "@/store/useModal";
import {
  Modal as MuiModal,
  Box,
  Backdrop,
  IconButton,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

const baseStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxHeight: "90vh",
  bgcolor: "background.paper",
  boxShadow: "0 24px 48px rgba(0,0,0,0.15)",
  p: { xs: 3, md: 5 },
  borderRadius: "24px",
  outline: "none",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(0,0,0,0.1)",
    borderRadius: "10px",
  },
};

export default function Modal() {
  const { content, config, hideModal } = useModal();

  const handleClose = () => hideModal();

  const getWidth = () => {
    if (config?.width) return config.width;
    if (config?.size === "sm") return "420px";
    if (config?.size === "lg") return "800px";
    return "600px"; // Default md size
  };

  const modalStyle = {
    ...baseStyle,
    width: { xs: "90%", sm: getWidth() },
    maxWidth: config?.maxWidth || "95vw",
  };

  return (
    <MuiModal
      open={!!content}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(5px)",
          },
        },
      }}
    >
      <Fade in={!!content}>
        <Box sx={modalStyle}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 15,
              right: 15,
              color: "rgba(0,0,0,0.5)",
              "&:hover": {
                color: "black",
                backgroundColor: "rgba(0,0,0,0.05)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ mt: 1 }}>{content}</Box>
        </Box>
      </Fade>
    </MuiModal>
  );
}
