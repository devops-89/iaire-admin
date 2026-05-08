import { roboto } from "@/utils/fonts";
import { Box, Typography } from "@mui/material";
import React from "react";

const AddBatches = () => {
  return (
    <Box>
      <Typography
        sx={{
          fontFamily: roboto.style.fontFamily,
          fontSize: 20,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        Add Batches
      </Typography>
    </Box>
  );
};

export default AddBatches;
