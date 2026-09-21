import React from "react";
import { Box, Card, CardContent, Typography, Skeleton } from "@mui/material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  loading,
}) => (
  <Card
    sx={{
      borderRadius: "16px",
      boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
      border: "1px solid #d7d7d7",
      height: "100%",
    }}
  >
    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Box
        sx={{
          p: 1.5,
          borderRadius: "12px",
          bgcolor: "rgba(0,0,0,0.04)",
          color: COLORS.PRIMARY_NAVY,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          sx={{
            fontFamily: poppins.style.fontFamily,
            color: COLORS.TEXT_SECONDARY,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>
        {loading ? (
          <Skeleton variant="text" width={60} height={32} />
        ) : (
          <Typography
            sx={{
              fontFamily: poppins.style.fontFamily,
              color: COLORS.PRIMARY_NAVY,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {value}
          </Typography>
        )}
      </Box>
    </CardContent>
  </Card>
);

export default StatCard;
