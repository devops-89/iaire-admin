import { poppins } from "@/utils/fonts";
import { Box, Card, Typography } from "@mui/material";
import React from "react";

interface STATS_CARD_PROPS {
  title: string;
  count: string;
}

const StatsBox = ({ title, count }: STATS_CARD_PROPS) => {
  return (
    <Box>
      <Card sx={{ p: 2 }}>
        <Typography
          sx={{ fontFamily: poppins.style.fontFamily, fontSize: "12px" }}
        >
          {title}
        </Typography>
      </Card>
    </Box>
  );
};

export default StatsBox;
