"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";

const PatentManagement = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontFamily: poppins.style.fontFamily, fontSize: "34px", fontWeight: 700, color: COLORS.PRIMARY_NAVY, letterSpacing: -0.5 }}>
        Patent Management
      </Typography>
    </Box>
  );
};

export default PatentManagement;
