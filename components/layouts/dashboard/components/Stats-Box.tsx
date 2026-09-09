import { poppins, roboto } from "@/utils/fonts";
import { Box, Card, Typography } from "@mui/material";
import { COLORS } from "@/utils/enum";
import React from "react";

interface STATS_CARD_PROPS {
  title: string;
  count: string | number;
  label?: string;
}

const StatsBox = ({ title, count, label }: STATS_CARD_PROPS) => {
  return (
    <Box sx={{ height: "100%" }}>
      {label && (
        <Typography
          sx={{ fontSize: 20, fontFamily: roboto.style.fontFamily, mb: 2 }}
        >
          {label}
        </Typography>
      )}
      <Card
        sx={{
          p: 3,
          backgroundColor: COLORS.WHITE,
          borderRadius: "16px",
          border: `1px solid ${COLORS.GLASS_BORDER}`,
          boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.02)",
          height: label ? "calc(100% - 46px)" : "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.08)",
            borderColor: COLORS.PRIMARY_NAVY,
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: poppins.style.fontFamily,
            fontSize: "36px",
            fontWeight: 700,
            color: COLORS.PRIMARY_NAVY,
            lineHeight: 1.1,
            mb: 1.5,
          }}
        >
          {count}
        </Typography>
        <Typography
          sx={{
            fontFamily: roboto.style.fontFamily,
            fontSize: "15px",
            color: COLORS.TEXT_SECONDARY,
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          {title}
        </Typography>
      </Card>
    </Box>
  );
};

export default StatsBox;
