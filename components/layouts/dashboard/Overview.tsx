"use client";
import React, { useEffect } from "react";
import { COLORS } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import { Box, Chip, Skeleton, Typography } from "@mui/material";
import { People, Gavel, Science, RocketLaunch } from "@mui/icons-material";

import { useDashboardCount, DashboardData } from "@/hooks/common/useDashboard";
import StatsBox from "./components/Stats-Box";

interface SectionConfig {
  key: keyof DashboardData;
  label: string;
  icon: React.ReactNode;
}
const SECTIONS_CONFIG: SectionConfig[] = [
  {
    key: "users",
    label: "Users",
    icon: <People sx={{ fontSize: 20 }} />,
  },
  {
    key: "patents",
    label: "Patents",
    icon: <Gavel sx={{ fontSize: 20 }} />,
  },
  {
    key: "researchPublications",
    label: "Research Publications",
    icon: <Science sx={{ fontSize: 20 }} />,
  },
  {
    key: "startups",
    label: "Startups",
    icon: <RocketLaunch sx={{ fontSize: 20 }} />,
  },
];

const DashboardOverview = () => {
  const { getDashboardCount, loading, data } = useDashboardCount();

  useEffect(() => {
    getDashboardCount();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 4.5,
        pb: 4,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: poppins.style.fontFamily,
            fontSize: "34px",
            fontWeight: 700,
            color: COLORS.TEXT_PRIMARY,
            letterSpacing: -0.5,
          }}
        >
          Overview
        </Typography>

        <Chip
          label={new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
          sx={{
            bgcolor: COLORS.WHITE,
            border: "1px solid #E4E4E7",
            fontFamily: poppins.style.fontFamily,
            fontWeight: 600,
            color: COLORS.TEXT_PRIMARY,
            p: 1.5,
            height: "40px",
            borderRadius: "12px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
          }}
        />
      </Box>

      {/* Sections */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4.5 }}>
        {loading ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 2.5,
            }}
          >
            {[1, 2, 3, 4].map((item) => (
              <Skeleton
                key={item}
                variant="rectangular"
                height={130}
                sx={{ borderRadius: "14px" }}
              />
            ))}
          </Box>
        ) : (
          data &&
          SECTIONS_CONFIG.map((section) => {
            const items = data[section.key] || [];
            if (!items || items.length === 0) return null;

            return (
              <Box key={section.key}>
                {/* Section Title & Metric Badge */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      bgcolor: "#F4F4F5",
                      color: COLORS.PRIMARY_NAVY,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {section.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: poppins.style.fontFamily,
                      fontWeight: 700,
                      color: COLORS.TEXT_PRIMARY,
                      fontSize: "1.2rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {section.label}
                  </Typography>
                  <Chip
                    label={`${items.length} Metrics`}
                    size="small"
                    sx={{
                      height: "22px",
                      fontSize: "11px",
                      fontWeight: 600,
                      bgcolor: "#F4F4F5",
                      color: COLORS.TEXT_SECONDARY,
                      borderRadius: "6px",
                    }}
                  />
                </Box>

                {/* Balanced Responsive Grid */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      items.length === 5
                        ? {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                            lg: "repeat(5, 1fr)",
                          }
                        : {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(4, 1fr)",
                          },
                    gap: 2.5,
                  }}
                >
                  {items.map((stat, index) => (
                    <StatsBox
                      key={index}
                      title={stat.title}
                      count={stat.count}
                      icon={section.icon}
                    />
                  ))}
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default DashboardOverview;
