"use client";
import React from "react";
import { Box, Typography, Grid, Card, Avatar, LinearProgress, Stack, Button } from "@mui/material";
import { RocketLaunch, EmojiObjects, Paid, TrendingUp, MoreVert } from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";

const STARTUP_STAGES = [
  { stage: "Ideation", count: 145, icon: <EmojiObjects />, color: "#FF9800", percentage: 40 },
  { stage: "Seed Funded", count: 86, icon: <Paid />, color: "#4CAF50", percentage: 25 },
  { stage: "Series A+", count: 32, icon: <TrendingUp />, color: "#2196F3", percentage: 15 },
  { stage: "Exited", count: 12, icon: <RocketLaunch />, color: "#9C27B0", percentage: 5 },
];

const RECENT_STARTUPS = [
  { name: "EduTech AI", industry: "Education", funding: "$2.5M", status: "Seed", logo: "EA" },
  { name: "GreenDrive", industry: "Automotive", funding: "$1.2M", status: "Ideation", logo: "GD" },
  { name: "HealthPal", industry: "Healthcare", funding: "$15M", status: "Series B", logo: "HP" },
];

const StartupsManagement = () => {
  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: poppins.style.fontFamily, fontWeight: 700, color: COLORS.BLACK }}>
            Startup Ecosystem
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<RocketLaunch />}
          sx={{ 
            bgcolor: COLORS.PRIMARY_NAVY, 
            borderRadius: "12px", 
            textTransform: "none",
            px: 3,
            py: 1.2,
            fontFamily: poppins.style.fontFamily,
            fontWeight: 600,
            "&:hover": { bgcolor: COLORS.SECONDARY_NAVY }
          }}
        >
          Launch New Incubator
        </Button>
      </Box>

      {/* Lifecycle Funnel */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {STARTUP_STAGES.map((item, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
            <Card sx={{ 
              p: 3, 
              borderRadius: "24px", 
              textAlign: "center",
              boxShadow: "0px 10px 30px rgba(0,0,0,0.02)",
              border: "1px solid rgba(0,0,0,0.03)",
              height: "100%"
            }}>
              <Avatar sx={{ 
                bgcolor: "rgba(9, 9, 11, 0.05)", 
                color: COLORS.PRIMARY_NAVY, 
                width: 50, 
                height: 50, 
                mx: "auto", 
                mb: 2,
                borderRadius: "12px"
              }}>
                {item.icon}
              </Avatar>
              <Typography sx={{ fontSize: 24, fontWeight: 800, fontFamily: poppins.style.fontFamily }}>
                {item.count}
              </Typography>
              <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 13, fontWeight: 500 }}>
                {item.stage}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Industry Distribution */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 3, borderRadius: "24px", boxShadow: "0px 15px 35px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.03)" }}>
            <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 3, fontFamily: poppins.style.fontFamily }}>
              Industry Focus Areas
            </Typography>
            <Stack spacing={3}>
              {[
                { label: "Fintech", value: 75, color: "#09090B" },
                { label: "Healthcare", value: 60, color: "#3F3F46" },
                { label: "AI & ML", value: 90, color: "#71717A" },
                { label: "SaaS", value: 45, color: "#A1A1AA" },
              ].map((industry, idx) => (
                <Box key={idx}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{industry.label}</Typography>
                    <Typography sx={{ fontSize: 14, color: COLORS.TEXT_SECONDARY }}>{industry.value} Startups</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={industry.value} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5, 
                      bgcolor: "rgba(0,0,0,0.05)",
                      "& .MuiLinearProgress-bar": { bgcolor: industry.color }
                    }} 
                  />
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* Featured Startups */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 3, borderRadius: "24px", boxShadow: "0px 15px 35px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.03)", height: "100%" }}>
            <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 3, fontFamily: poppins.style.fontFamily }}>
              Featured Startups
            </Typography>
            <Stack spacing={2}>
              {RECENT_STARTUPS.map((startup, idx) => (
                <Box key={idx} sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between",
                  p: 2,
                  borderRadius: "16px",
                  bgcolor: "rgba(0,0,0,0.02)",
                  transition: "all 0.2s",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.04)", transform: "scale(1.02)" }
                }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: COLORS.PRIMARY_NAVY, fontSize: 14, fontWeight: 700 }}>{startup.logo}</Avatar>
                    <Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{startup.name}</Typography>
                      <Typography sx={{ fontSize: 12, color: COLORS.TEXT_SECONDARY }}>{startup.industry}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>{startup.funding}</Typography>
                    <Typography sx={{ fontSize: 11, color: COLORS.TEXT_SECONDARY }}>{startup.status}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
            <Button fullWidth sx={{ mt: 3, textTransform: "none", color: COLORS.TEXT_SECONDARY, fontSize: 13 }}>
              View All Portfolios
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StartupsManagement;
