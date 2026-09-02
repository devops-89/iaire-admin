"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Avatar,
  Chip,
  Skeleton,
  alpha,
  Divider,
} from "@mui/material";
import {
  School,
  People,
  RocketLaunch,
  BatchPrediction,
  Description,
  CardMembership,
  Business,
  Schedule,
  TrendingUp,
  Public,
  CheckCircle,
  Gavel,
  AssignmentTurnedIn,
  EventAvailable,
} from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";

import { useDashboardCount } from "@/hooks/common/useDashboard";

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  loading: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  loading,
}) => {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: "24px",
        boxShadow: "0px 10px 25px rgba(0,0,0,0.02)",
        border: "1px solid rgba(0,0,0,0.04)",
        backgroundColor: COLORS.WHITE,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0px 20px 40px rgba(0,0,0,0.06)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              color: COLORS.TEXT_SECONDARY,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: poppins.style.fontFamily,
              mb: 0.5,
            }}
          >
            {title}
          </Typography>
          {loading ? (
            <Skeleton width={80} height={40} />
          ) : (
            <Typography
              sx={{
                fontSize: 26,
                fontWeight: 800,
                fontFamily: poppins.style.fontFamily,
                color: COLORS.TEXT_PRIMARY,
              }}
            >
              {value}
            </Typography>
          )}
        </Box>
        <Avatar
          sx={{
            bgcolor: alpha(color, 0.1),
            color: color,
            width: 52,
            height: 52,
            borderRadius: "16px",
          }}
        >
          {icon}
        </Avatar>
      </Box>
      <Typography
        sx={{
          color: COLORS.TEXT_SECONDARY,
          fontSize: 12,
          fontFamily: poppins.style.fontFamily,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          mt: 1,
        }}
      >
        <TrendingUp sx={{ fontSize: 16, color: COLORS.SUCCESS }} />
        {subtitle}
      </Typography>
    </Card>
  );
};

const DashboardOverview = () => {
  // States
  const [stats, setStats] = useState({
    boards: 0,
    schools: 0,
    teachers: 0,
    students: 0,
    innovations: 0,
    approvedInnovations: 0,
    attorneyReviews: 0,
    patents: 0,
    countries: 0,
    batches: 0,
    plans: 0,
    interviews: 0,
  });

  const { getDashboardCount, loading } = useDashboardCount();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await getDashboardCount();
        if (data) {
          const extractCount = (val: any, fallbackKey?: string): number => {
            let actualVal = val;
            if (actualVal === undefined && fallbackKey) {
              actualVal = data[fallbackKey];
            }
            
            if (Array.isArray(actualVal)) {
              if (actualVal.length > 0 && typeof actualVal[0] === "object" && "count" in actualVal[0]) {
                return Number(actualVal[0].count) || 0;
              }
              return actualVal.length;
            }

            if (actualVal && typeof actualVal === "object") {
              if ("count" in actualVal) {
                return Number(actualVal.count) || 0;
              }
              if ("total" in actualVal) {
                return Number(actualVal.total) || 0;
              }
              if ("value" in actualVal) {
                return Number(actualVal.value) || 0;
              }
              return 0;
            }
            
            return Number(actualVal) || 0;
          };

          setStats({
            boards: extractCount(data.boards, 'totalBoards'),
            schools: extractCount(data.schools, 'totalSchools'),
            teachers: extractCount(data.teachers, 'totalTeachers'),
            students: extractCount(data.students, 'totalStudents'),
            innovations: extractCount(data.innovations, 'totalInnovations'),
            approvedInnovations: extractCount(data.approvedInnovations, 'totalApprovedInnovations'),
            attorneyReviews: extractCount(data.attorneyReviews, 'totalAttorneyReviews'),
            patents: extractCount(data.patents, 'totalPatents'),
            countries: extractCount(data.countries, 'totalCountries'),
            batches: extractCount(data.batches, 'totalBatches'),
            plans: extractCount(data.plans, 'totalPlans'),
            interviews: extractCount(data.interviews, 'totalInterviews'),
          });
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statsCards = [
    {
      title: "Total Boards",
      value: stats.boards,
      subtitle: "Governing boards",
      icon: <Business />,
      color: COLORS.PRIMARY_NAVY,
    },
    {
      title: "Active Schools",
      value: stats.schools,
      subtitle: "Registered institutions",
      icon: <School />,
      color: COLORS.PRIMARY_NAVY,
    },
    {
      title: "Certified Teachers",
      value: stats.teachers,
      subtitle: "Faculty members",
      icon: <People />,
      color: COLORS.PRIMARY_NAVY,
    },
    {
      title: "Total Students",
      value: stats.students.toLocaleString(),
      subtitle: "Registered students",
      icon: <People />,
      color: COLORS.PRIMARY_NAVY,
    },
    {
      title: "Innovations Filed",
      value: stats.innovations,
      subtitle: "Total proposals",
      icon: <RocketLaunch />,
      color: COLORS.PRIMARY_NAVY,
    },
    {
      title: "Approved Projects",
      value: stats.approvedInnovations,
      subtitle: "IAIRE approved submissions",
      icon: <CheckCircle />,
      color: COLORS.PRIMARY_NAVY,
    },
    {
      title: "Attorney Reviews",
      value: stats.attorneyReviews,
      subtitle: "Under legal review",
      icon: <Gavel />,
      color: COLORS.PRIMARY_NAVY,
    },
    {
      title: "Patents Filed",
      value: stats.patents,
      subtitle: "Legal patent applications",
      icon: <Description />,
      color: COLORS.PRIMARY_NAVY,
    },
    {
      title: "Active Countries",
      value: stats.countries,
      subtitle: "Supported territories",
      icon: <Public />,
      color: COLORS.PRIMARY_NAVY,
    },
    {
      title: "Training Batches",
      value: stats.batches,
      subtitle: "Batches running",
      icon: <BatchPrediction />,
      color: COLORS.PRIMARY_NAVY,
    },
    {
      title: "Pricing Plans",
      value: stats.plans,
      subtitle: "Subscription programs",
      icon: <CardMembership />,
      color: COLORS.PRIMARY_NAVY,
    },
    {
      title: "Training Nominations",
      value: stats.interviews,
      subtitle: "Scheduled interviews",
      icon: <EventAvailable />,
      color: COLORS.PRIMARY_NAVY,
    },
  ];

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
          icon={
            <Schedule sx={{ color: `${COLORS.PRIMARY_NAVY} !important` }} />
          }
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

      {/* Summary Cards Grid */}
      <Grid container spacing={3}>
        {statsCards.map((card, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
            <SummaryCard
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
              icon={card.icon}
              color={card.color}
              loading={loading}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
