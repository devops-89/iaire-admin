"use client";
import React from "react";
import { Box, Card, Typography, Icon } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";
import { COLORS, FONT_SIZE } from "@/utils/enum";
import { poppins } from "@/utils/fonts";

interface KpiCardProps {
  title: string;
  count: string | number;
  icon: React.ReactElement;
  color?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, count, icon, color = COLORS.PRIMARY_NAVY }) => {


  return (
    <Card
      sx={{
        p: 3,
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: COLORS.WHITE,
        boxShadow: "0px 10px 20px rgba(0,0,0,0.03)",
        border: "1px solid rgba(0,0,0,0.03)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0px 15px 30px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: FONT_SIZE.FS14,
            color: COLORS.TEXT_SECONDARY,
            fontFamily: poppins.style.fontFamily,
            fontWeight: 500,
            mb: 0.5,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: FONT_SIZE.FS28,
            fontWeight: 700,
            fontFamily: poppins.style.fontFamily,
            color: COLORS.BLACK,
          }}
        >
          {count}
        </Typography>
      </Box>

      <Box
        sx={{
          width: 55,
          height: 55,
          borderRadius: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: `${color}15`, 
          color: color,
        }}
      >
        {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { 
          sx: { fontSize: 30 } 
        })}
      </Box>
    </Card>
  );
};

export default KpiCard;
