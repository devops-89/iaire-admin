"use client";

import { COLORS } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import { Box, Chip, Grid, Skeleton, Typography } from "@mui/material";
import { useEffect } from "react";

import { useDashboardCount } from "@/hooks/common/useDashboard";
import StatsBox from "./components/Stats-Box";

const DashboardOverview = () => {
  const { getDashboardCount, loading, data } = useDashboardCount();

  useEffect(() => {
    getDashboardCount();
  }, []);

  const sections = data
    ? [
        { label: "Users", items: data.users },
        { label: "Patents", items: data.patents },
        { label: "Research Publications", items: data.researchPublications },
        { label: "Startups", items: data.startups },
      ]
    : [];

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 4 }}
    >
      {/* Welcome & Overview Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: poppins.style.fontFamily,
              fontWeight: 800,
              color: COLORS.TEXT_PRIMARY,
              letterSpacing: -0.5,
            }}
          >
            Overview
          </Typography>
        </Box>
        <Chip
          label={new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
          sx={{
            bgcolor: COLORS.WHITE,
            border: "1px solid rgba(0,0,0,0.05)",
            fontFamily: poppins.style.fontFamily,
            fontWeight: 600,
            color: COLORS.TEXT_PRIMARY,
            p: 1.5,
            height: "40px",
            borderRadius: "12px",
          }}
        />
      </Box>
      <Box>
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
                <Skeleton
                  variant="rectangular"
                  height={100}
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          data && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {sections.map(
                (section, idx) =>
                  section.items &&
                  section.items.length > 0 && (
                    <Box key={idx}>
                      <Typography
                        variant="h5"
                        sx={{
                          mb: 2,
                          fontFamily: poppins.style.fontFamily,
                          fontWeight: 600,
                          color: COLORS.TEXT_PRIMARY,
                        }}
                      >
                        {section.label}
                      </Typography>
                      <Grid container spacing={3}>
                        {section.items.map((stat, index) => (
                          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <StatsBox title={stat.title} count={stat.count} />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  ),
              )}
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};

export default DashboardOverview;
