"use client";
import React from "react";
import { Box, Grid, Typography, Card, Divider } from "@mui/material";
import {
  School,
  People,
  Person,
  RocketLaunch,
  Description,
  Article,
  Public,
  EventNote,
  Assessment,
} from "@mui/icons-material";
import KpiCard from "@/components/widgets/KpiCard";
import { COLORS, FONT_SIZE } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

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
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: poppins.style.fontFamily,
            fontWeight: 700,
            color: COLORS.BLACK,
          }}
        >
          Analytics Overview
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: poppins.style.fontFamily,
            color: COLORS.TEXT_SECONDARY,
          }}
        >
          Welcome back! Here's what's happening with your platform today.
        </Typography>
      </Box>

      {/* KPI Cards Grid - Using CSS Grid for guaranteed 4 columns */}
      <Box 
        sx={{ 
          display: "grid", 
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)"
          },
          gap: 3,
          mb: 4,
          width: "100%"
        }}
      >
        {[
          { title: "Total Schools", count: "1,240", icon: <School />, color: COLORS.PRIMARY_NAVY },
          { title: "Total Teachers", count: "8,520", icon: <People />, color: COLORS.ACCENT_TAN },
          { title: "Total Students", count: "45,000", icon: <Person />, color: "#00C49F" },
          { title: "Total Startups", count: "340", icon: <RocketLaunch />, color: "#FFBB28" },
          { title: "Total Boards", count: "12", icon: <Assessment />, color: "#0088FE" },
          { title: "Total Countries", count: "45", icon: <Public />, color: "#6366F1" },
          { title: "Total Interviews", count: "1,150", icon: <EventNote />, color: "#F43F5E" },
          { title: "Research Papers", count: "210", icon: <Article />, color: "#FF8042" },
        ].map((item, index) => (
          <KpiCard key={index} {...item} />
        ))}
      </Box>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Growth Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ p: 3, borderRadius: "20px", boxShadow: "0px 10px 20px rgba(0,0,0,0.03)" }}>
            <Typography sx={{ fontWeight: 600, mb: 3, fontFamily: poppins.style.fontFamily }}>Student & Startup Growth</Typography>
            <Box sx={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={GROWTH_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0px 10px 30px rgba(0,0,0,0.1)" }} />
                  <Legend verticalAlign="top" align="right" height={36} />
                  <Line type="monotone" dataKey="students" stroke={COLORS.PRIMARY_NAVY} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="startups" stroke={COLORS.ACCENT_TAN} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Membership Distribution */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ p: 3, borderRadius: "20px", boxShadow: "0px 10px 20px rgba(0,0,0,0.03)", height: "100%" }}>
            <Typography sx={{ fontWeight: 600, mb: 3, fontFamily: poppins.style.fontFamily }}>Membership Distribution</Typography>
            <Box sx={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MEMBERSHIP_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {MEMBERSHIP_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ fontSize: 14, color: COLORS.TEXT_SECONDARY }}>Total Active Plans</Typography>
              <Typography sx={{ fontWeight: 700 }}>1,000</Typography>
            </Box>
          </Card>
        </Grid>

        {/* Teacher Training Stats */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 3, borderRadius: "20px", boxShadow: "0px 10px 20px rgba(0,0,0,0.03)" }}>
            <Typography sx={{ fontWeight: 600, mb: 3, fontFamily: poppins.style.fontFamily }}>Teacher Training Statistics</Typography>
            <Box sx={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TRAINING_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill={COLORS.PRIMARY_NAVY} radius={[4, 4, 0, 0]} barSize={40} />
                  <Bar dataKey="pending" fill="#E0E0E0" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
