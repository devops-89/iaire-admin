"use client";
import React from "react";
import { Box, Typography, Grid, Card, Avatar, Divider, Chip, LinearProgress } from "@mui/material";
import { School, Business, People, ArrowForwardIos } from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";

const BOARDS_DATA = [
  { 
    name: "CBSE Board", 
    schools: 450, 
    teachers: "12.5k", 
    students: "200k",
    color: "#4CAF50",
    progress: 85
  },
  { 
    name: "ICSE Board", 
    schools: 120, 
    teachers: "4.2k", 
    students: "85k",
    color: "#2196F3",
    progress: 65
  },
  { 
    name: "State Board", 
    schools: 890, 
    teachers: "25k", 
    students: "500k",
    color: "#FF9800",
    progress: 92
  },
  { 
    name: "International Board", 
    schools: 45, 
    teachers: "1.8k", 
    students: "15k",
    color: "#9C27B0",
    progress: 40
  }
];

const SchoolsManagement = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: poppins.style.fontFamily, fontWeight: 700, color: COLORS.BLACK }}>
          Board Management
        </Typography>
        <Typography variant="body1" sx={{ fontFamily: poppins.style.fontFamily, color: COLORS.TEXT_SECONDARY, mt: 0.5 }}>
          Explore the hierarchy of educational boards, schools, and faculty.
        </Typography>
      </Box>

      {/* Top Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[
          { label: "Total Boards", value: "4", icon: <Business />, color: COLORS.PRIMARY_NAVY },
          { label: "Active Schools", value: "1,505", icon: <School />, color: "#4CAF50" },
          { label: "Total Teachers", value: "43.5k", icon: <People />, color: COLORS.ACCENT_TAN },
          { label: "Total Students", value: "800k", icon: <People />, color: COLORS.INFO },
        ].map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ 
              p: 3, 
              borderRadius: "20px", 
              boxShadow: "0px 10px 20px rgba(0,0,0,0.02)",
              display: "flex",
              alignItems: "center",
              gap: 2,
              border: "1px solid rgba(0,0,0,0.03)",
              height: "100%"
            }}>
              <Avatar sx={{ bgcolor: `${stat.color}15`, color: stat.color, width: 60, height: 60, borderRadius: "15px" }}>
                {stat.icon}
              </Avatar>
              <Box>
                <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 14, fontFamily: poppins.style.fontFamily }}>{stat.label}</Typography>
                <Typography sx={{ fontSize: 28, fontWeight: 700, fontFamily: poppins.style.fontFamily }}>{stat.value}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Boards Grid */}
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, fontFamily: poppins.style.fontFamily }}>
        Educational Boards Hierarchy
      </Typography>
      
      {/* Boards Grid using CSS Grid for perfect symmetry */}
      <Box 
        sx={{ 
          display: "grid", 
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)"
          },
          gap: 3,
          alignItems: "stretch",
          width: "100%"
        }}
      >
        {BOARDS_DATA.map((board, idx) => (
          <Card
            key={idx}
            sx={{ 
              p: 0, 
              borderRadius: "24px", 
              overflow: "hidden",
              boxShadow: "0px 10px 25px rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.03)",
              transition: "all 0.3s ease",
              height: "100%",
              minHeight: "200px", // Increased for larger fonts
              display: "flex",
              flexDirection: "column",
              "&:hover": { transform: "translateY(-5px)", boxShadow: "0px 20px 40px rgba(0,0,0,0.08)" }
            }}
          >
            <Box sx={{ p: 3, flexGrow: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: board.color, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 18, fontWeight: 700, fontFamily: poppins.style.fontFamily }}>
                    {board.name}
                  </Typography>
                </Box>
                <Chip label="Active" size="small" sx={{ bgcolor: "rgba(76, 175, 80, 0.1)", color: "#4CAF50", fontWeight: 600, fontSize: 10 }} />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 12, mb: 0.5 }}>Schools</Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: 18, color: COLORS.PRIMARY_NAVY }}>{board.schools}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 12, mb: 0.5 }}>Teachers</Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: 18, color: COLORS.PRIMARY_NAVY }}>{board.teachers}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 12, mb: 0.5 }}>Students</Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: 18, color: COLORS.PRIMARY_NAVY }}>{board.students}</Typography>
                </Grid>
              </Grid>
            </Box>
            
            <Box sx={{ height: 6, width: "100%", bgcolor: board.color, opacity: 0.8 }} />
          </Card>
        ))}
      </Box>


    </Box>
  );
};

export default SchoolsManagement;
