import React from "react";
import { Grid, Card, Box, Typography, Skeleton } from "@mui/material";
import { BatchPrediction, CalendarMonth, Category as CategoryIcon } from "@mui/icons-material";
import { COLORS, FONT_SIZE, CATEGORY } from "@/utils/enum";
import { Batch, Pagination } from "@/utils/type";

interface BatchStatsProps {
  loading: boolean;
  pagination: Pagination;
  batches: Batch[];
  fontStyle: any;
}

const BatchStats: React.FC<BatchStatsProps> = ({ loading, pagination, batches, fontStyle }) => {
  const stats = [
    { label: "Total Batches", value: pagination.total, color: COLORS.PRIMARY_NAVY, icon: <BatchPrediction /> },
    { label: "Active Training", value: batches.filter(b => b.isActive).length, color: "#4CAF50", icon: <CalendarMonth /> },
    { label: "Categories", value: Object.keys(CATEGORY).length, color: COLORS.ACCENT_TAN, icon: <CategoryIcon /> },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {stats.map((stat, i) => (
        <Grid key={i} size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: "20px",
              boxShadow: "0px 10px 20px rgba(0,0,0,0.03)",
              border: "1px solid rgba(0,0,0,0.03)",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: `${stat.color}18`,
                color: stat.color,
              }}
            >
              {stat.icon}
            </Box>
            <Box>
              <Typography sx={{ ...fontStyle, fontSize: FONT_SIZE.FS12, color: COLORS.TEXT_SECONDARY, fontWeight: 500 }}>
                {stat.label}
              </Typography>
              <Typography sx={{ ...fontStyle, fontSize: FONT_SIZE.FS28, fontWeight: 700, color: COLORS.BLACK }}>
                {loading ? <Skeleton width={40} /> : stat.value}
              </Typography>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default BatchStats;
