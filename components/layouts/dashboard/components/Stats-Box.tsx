"use client";

import React from "react";
import { Box, Card, Typography } from "@mui/material";
import { COLORS } from "@/utils/enum";
import { poppins, roboto } from "@/utils/fonts";

interface STATS_CARD_PROPS {
  title: string;
  count: string | number;
  label?: string;
  icon?: React.ReactNode;
}

const StatsBox: React.FC<STATS_CARD_PROPS> = ({
  title,
  count,
  label,
  icon,
}) => {
  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      {label && (
        <Typography
          sx={{
            fontSize: 18,
            fontFamily: poppins.style.fontFamily,
            fontWeight: 600,
            color: COLORS.TEXT_PRIMARY,
            mb: 1.5,
          }}
        >
          {label}
        </Typography>
      )}
      <Card
        sx={{
          p: 3,
          bgcolor: COLORS.WHITE,
          borderRadius: "14px",
          border: "1px solid #E4E4E7",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
          height: label ? "calc(100% - 40px)" : "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "130px",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 10px 24px -4px rgba(0, 0, 0, 0.08)",
            borderColor: COLORS.PRIMARY_NAVY,
            "& .icon-badge": {
              bgcolor: COLORS.PRIMARY_NAVY,
              color: COLORS.WHITE,
            },
          },
        }}
      >
        {/* Top: Value & Optional Icon */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1.5,
          }}
        >
          <Typography
            sx={{
              fontFamily: poppins.style.fontFamily,
              fontSize: "2.25rem",
              fontWeight: 700,
              color: COLORS.PRIMARY_NAVY,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {count}
          </Typography>

          {icon && (
            <Box
              className="icon-badge"
              sx={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                bgcolor: "#F4F4F5",
                color: COLORS.PRIMARY_NAVY,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        {/* Bottom: Title */}
        <Typography
          sx={{
            fontFamily: roboto.style.fontFamily,
            fontSize: "14px",
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
