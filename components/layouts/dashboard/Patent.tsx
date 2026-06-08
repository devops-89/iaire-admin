"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import { poppins } from "@/utils/fonts";

const PatentManagement = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontFamily: poppins.style.fontFamily, fontWeight: 700 }}>
        Patent Management
      </Typography>
    </Box>
  );
};

export default PatentManagement;
