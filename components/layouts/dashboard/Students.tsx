"use client";
import React from "react";
import { Box, Typography, Grid, Card, Avatar, Stack, Paper, IconButton } from "@mui/material";
import { Person, WorkspacePremium, LocalLibrary, MoreHoriz, FilterList } from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";

const TOP_STUDENTS = [
  { name: "Alex Johnson", grade: "12th", score: "98%", avatar: "AJ", color: "#FFD700" },
  { name: "Sarah Miller", grade: "10th", score: "96%", avatar: "SM", color: "#C0C0C0" },
  { name: "David Chen", grade: "11th", score: "95%", avatar: "DC", color: "#CD7F32" },
];

const StudentsManagement = () => {
  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: poppins.style.fontFamily, fontWeight: 700, color: COLORS.BLACK }}>
            Student Community
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: poppins.style.fontFamily, color: COLORS.TEXT_SECONDARY, mt: 0.5 }}>
            Empowering the next generation through data-driven insights.
          </Typography>
        </Box>
        <IconButton sx={{ bgcolor: COLORS.WHITE, boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
          <FilterList />
        </IconButton>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Main Stats */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 4, borderRadius: "24px", bgcolor: COLORS.PRIMARY_NAVY, color: "white", position: "relative", overflow: "hidden" }}>
            <Box sx={{ position: "absolute", top: -20, right: -20, width: 150, height: 150, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.05)" }} />
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ opacity: 0.7, fontSize: 14 }}>Active Students</Typography>
                <Typography sx={{ fontSize: 36, fontWeight: 800 }}>45,200</Typography>
                <Typography sx={{ fontSize: 12, color: "#4CAF50", mt: 1 }}>+12% this month</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ opacity: 0.7, fontSize: 14 }}>Avg. Attendance</Typography>
                <Typography sx={{ fontSize: 36, fontWeight: 800 }}>94.2%</Typography>
                <Typography sx={{ fontSize: 12, color: "#4CAF50", mt: 1 }}>Stable performance</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ opacity: 0.7, fontSize: 14 }}>Certified Skills</Typography>
                <Typography sx={{ fontSize: 36, fontWeight: 800 }}>12.8k</Typography>
                <Typography sx={{ fontSize: 12, color: "#4CAF50", mt: 1 }}>+850 this week</Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Top Performers Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, borderRadius: "24px", boxShadow: "0px 15px 35px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.03)" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography sx={{ fontWeight: 700, fontFamily: poppins.style.fontFamily }}>Top Performers</Typography>
              <WorkspacePremium sx={{ color: "#FFD700" }} />
            </Box>
            <Stack spacing={2}>
              {TOP_STUDENTS.map((student, idx) => (
                <Box key={idx} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ width: 35, height: 35, bgcolor: student.color, fontSize: 12, fontWeight: 700 }}>{student.avatar}</Avatar>
                    <Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{student.name}</Typography>
                      <Typography sx={{ fontSize: 11, color: COLORS.TEXT_SECONDARY }}>Grade: {student.grade}</Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 800 }}>{student.score}</Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Activity Grid */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, borderRadius: "20px", textAlign: "center", border: "1px dashed rgba(0,0,0,0.1)", bgcolor: "transparent" }}>
            <LocalLibrary sx={{ color: COLORS.PRIMARY_NAVY, mb: 1 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 700 }}>Homework Completion</Typography>
            <Typography sx={{ fontSize: 12, color: COLORS.TEXT_SECONDARY }}>88% Rate</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, borderRadius: "20px", textAlign: "center", border: "1px dashed rgba(0,0,0,0.1)", bgcolor: "transparent" }}>
            <Person sx={{ color: "#4CAF50", mb: 1 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 700 }}>Parent Meetings</Typography>
            <Typography sx={{ fontSize: 12, color: COLORS.TEXT_SECONDARY }}>1,200 Scheduled</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, borderRadius: "20px", textAlign: "center", border: "1px dashed rgba(0,0,0,0.1)", bgcolor: "transparent" }}>
            <WorkspacePremium sx={{ color: COLORS.ACCENT_TAN, mb: 1 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 700 }}>Olympic Winners</Typography>
            <Typography sx={{ fontSize: 12, color: COLORS.TEXT_SECONDARY }}>45 Gold Medals</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, borderRadius: "20px", textAlign: "center", border: "1px dashed rgba(0,0,0,0.1)", bgcolor: "transparent" }}>
            <MoreHoriz sx={{ color: COLORS.TEXT_SECONDARY, mb: 1 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 700 }}>Extracurriculars</Typography>
            <Typography sx={{ fontSize: 12, color: COLORS.TEXT_SECONDARY }}>20+ Clubs Active</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentsManagement;
