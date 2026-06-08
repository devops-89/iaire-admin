"use client";
import React from "react";
import { Box, Typography, Grid, Card, Avatar, Chip, Skeleton } from "@mui/material";
import { School, Business, People } from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";
import { useSchools } from "@/hooks/common/useSchools";

const BOARD_COLORS = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#F44336", "#00BCD4", "#673AB7"];

const SchoolsManagement = () => {
  const { boardAnalytics, loading } = useSchools();

  const totalStats = boardAnalytics.reduce(
    (acc, curr) => ({
      schools: acc.schools + curr.totalSchools,
      teachers: acc.teachers + curr.totalTeachers,
      students: acc.students + curr.totalStudents,
    }),
    { schools: 0, teachers: 0, students: 0 }
  );

  const statsCards = [
    { label: "Total Boards", value: boardAnalytics.length, icon: <Business />, color: COLORS.PRIMARY_NAVY },
    { label: "Active Schools", value: totalStats.schools.toLocaleString(), icon: <School />, color: COLORS.PRIMARY_NAVY },
    { label: "Total Teachers", value: totalStats.teachers.toLocaleString(), icon: <People />, color: COLORS.PRIMARY_NAVY },
    { label: "Total Students", value: totalStats.students.toLocaleString(), icon: <People />, color: COLORS.PRIMARY_NAVY },
  ];

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
        {statsCards.map((stat, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
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
                {loading ? (
                  <Skeleton width={60} height={40} />
                ) : (
                  <Typography sx={{ fontSize: 28, fontWeight: 700, fontFamily: poppins.style.fontFamily }}>{stat.value}</Typography>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Boards Grid */}
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, fontFamily: poppins.style.fontFamily }}>
        Educational Boards Hierarchy
      </Typography>

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
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={200} sx={{ borderRadius: "24px" }} />
          ))
        ) : (
          boardAnalytics.map((board, idx) => (
            <Card
              key={board.boardId}
              sx={{
                p: 0,
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0px 10px 25px rgba(0,0,0,0.04)",
                border: "1px solid rgba(0,0,0,0.03)",
                transition: "all 0.3s ease",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                "&:hover": { transform: "translateY(-5px)", boxShadow: "0px 20px 40px rgba(0,0,0,0.08)" }
              }}
            >
              <Box sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2, minHeight: 60 }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: COLORS.PRIMARY_NAVY, flexShrink: 0, mt: 0.8 }} />
                    <Typography sx={{ fontSize: 16, fontWeight: 700, fontFamily: poppins.style.fontFamily, lineHeight: 1.2 }}>
                      {board.boardName}
                    </Typography>
                  </Box>
                  <Chip label="Active" size="small" sx={{ bgcolor: "rgba(76, 175, 80, 0.1)", color: "#4CAF50", fontWeight: 600, fontSize: 10 }} />
                </Box>

                <Grid container spacing={2} sx={{ pt: 2, borderTop: "1px solid rgba(0,0,0,0.03)" }}>
                  <Grid size={{ xs: 4 }}>
                    <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 11, mb: 0.5 }}>Schools</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: 16, color: COLORS.PRIMARY_NAVY }}>{board.totalSchools}</Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 11, mb: 0.5 }}>Teachers</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: 16, color: COLORS.PRIMARY_NAVY }}>{board.totalTeachers}</Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 11, mb: 0.5 }}>Students</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: 16, color: COLORS.PRIMARY_NAVY }}>{board.totalStudents}</Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ height: 6, width: "100%", bgcolor: COLORS.PRIMARY_NAVY, opacity: 0.8 }} />
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
};

export default SchoolsManagement;
