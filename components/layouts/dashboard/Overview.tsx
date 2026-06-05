"use client";
import { poppins } from "@/utils/fonts";
import { Box, Stack, Typography } from "@mui/material";

const GROWTH_DATA = [
  { name: "Jan", students: 400, startups: 240 },
  { name: "Feb", students: 600, startups: 300 },
  { name: "Mar", students: 900, startups: 200 },
  { name: "Apr", students: 1200, startups: 278 },
  { name: "May", students: 1500, startups: 189 },
  { name: "Jun", students: 2000, startups: 239 },
];

const MEMBERSHIP_DATA = [
  { name: "Basic", value: 400 },
  { name: "Premium", value: 300 },
  { name: "Enterprise", value: 300 },
];

const TRAINING_DATA = [
  { name: "Q1", completed: 40, pending: 24 },
  { name: "Q2", completed: 30, pending: 13 },
  { name: "Q3", completed: 20, pending: 98 },
  { name: "Q4", completed: 27, pending: 39 },
];

const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const DashboardOverview = () => {
  return (
    <Box>
      <Stack
        direction="row"
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography variant="h5" sx={{ fontFamily: poppins.style.fontFamily }}>
          Overview
        </Typography>
      </Stack>
    </Box>
  );
};

export default DashboardOverview;
