"use client";
import React from "react";
import { Box, Typography, Grid, Card, Stack, Avatar, Chip } from "@mui/material";
import { Article, Psychology, Public, Groups } from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";

const ResearchManagement = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: poppins.style.fontFamily, fontWeight: 700, color: COLORS.BLACK }}>
          Research & Publications
        </Typography>
        <Typography variant="body1" sx={{ fontFamily: poppins.style.fontFamily, color: COLORS.TEXT_SECONDARY, mt: 0.5 }}>
          Showcasing academic excellence and groundbreaking studies.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Research Stats Area */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={2}>
            {[
              { label: "Published Papers", value: "840+", icon: <Article />, color: COLORS.PRIMARY_NAVY },
              { label: "Research Scholars", value: "250", icon: <Groups />, color: "#4CAF50" },
              { label: "Global Citations", value: "15.4k", icon: <Public />, color: "#2196F3" },
              { label: "Ongoing Projects", value: "45", icon: <Psychology />, color: "#9C27B0" },
            ].map((stat, idx) => (
              <Grid item xs={6} key={idx}>
                <Card sx={{ p: 3, borderRadius: "20px", textAlign: "center", border: "1px solid rgba(0,0,0,0.03)" }}>
                  <Box sx={{ color: stat.color, mb: 1 }}>{stat.icon}</Box>
                  <Typography sx={{ fontSize: 22, fontWeight: 800 }}>{stat.value}</Typography>
                  <Typography sx={{ fontSize: 12, color: COLORS.TEXT_SECONDARY }}>{stat.label}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Top Research Categories */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, borderRadius: "24px", height: "100%", boxShadow: "0px 15px 35px rgba(0,0,0,0.04)" }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 3 }}>Trending Research Areas</Typography>
            <Stack spacing={2}>
              {[
                { area: "Artificial Intelligence", growth: "+45%", color: COLORS.PRIMARY_NAVY },
                { area: "Renewable Energy", growth: "+32%", color: "#4CAF50" },
                { area: "Biotechnology", growth: "+28%", color: "#2196F3" },
                { area: "Quantum Physics", growth: "+15%", color: "#9C27B0" },
              ].map((item, idx) => (
                <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1.5, borderRadius: "12px", bgcolor: "rgba(0,0,0,0.01)" }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{item.area}</Typography>
                  <Chip label={item.growth} size="small" sx={{ bgcolor: `${item.color}15`, color: item.color, fontWeight: 700, fontSize: 10 }} />
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResearchManagement;
