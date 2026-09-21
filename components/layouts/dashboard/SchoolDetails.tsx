"use client";
import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  IconButton,
  Chip,
  Skeleton,
} from "@mui/material";
import {
  ArrowBack,
  School as SchoolIcon,
  People,
  Science,
  EmojiObjects,
  AccountTree,
  CardMembership,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";
import { useSchoolDetails } from "@/hooks/common/useSchools";
import { useRouter, usePathname } from "next/navigation";
import StatCard from "./components/StatCard";
import UserTable from "./components/UserTable";

interface SchoolDetailsProps {
  schoolId: string;
}

const SchoolDetails: React.FC<SchoolDetailsProps> = ({ schoolId }) => {
  const { data, loading, fetchSchoolDetails } = useSchoolDetails();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (schoolId) {
      fetchSchoolDetails(schoolId);
    }
  }, [schoolId]);

  const school = data?.school;

  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          onClick={() => router.back()}
          sx={{ bgcolor: "rgba(0,0,0,0.04)" }}
        >
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h4"
          sx={{
            fontFamily: poppins.style.fontFamily,
            fontWeight: 700,
            color: COLORS.BLACK,
          }}
        >
          School Details
        </Typography>
      </Box>

      {/* School Header Info */}
      <Card
        sx={{
          mb: 4,
          borderRadius: "16px",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
          border: "1px solid #d7d7d7",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
            {loading ? (
              <Skeleton variant="circular" width={80} height={80} />
            ) : (
              <Avatar
                src={school?.logo}
                alt={school?.name}
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "rgba(0,0,0,0.04)",
                  color: COLORS.PRIMARY_NAVY,
                }}
              >
                <SchoolIcon fontSize="large" />
              </Avatar>
            )}
            <Box sx={{ flex: 1 }}>
              {loading ? (
                <>
                  <Skeleton variant="text" width={250} height={40} />
                  <Skeleton variant="text" width={150} />
                  <Skeleton variant="text" width={300} />
                </>
              ) : (
                <>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: poppins.style.fontFamily,
                      fontWeight: 700,
                      color: COLORS.PRIMARY_NAVY,
                      textTransform: "capitalize",
                      mb: 0.5,
                    }}
                  >
                    {school?.name || "N/A"}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Chip
                      label={school?.isActive !== false ? "Active" : "Inactive"}
                      size="small"
                      sx={{
                        bgcolor:
                          school?.isActive !== false
                            ? "rgba(76, 175, 80, 0.1)"
                            : "rgba(244, 67, 54, 0.1)",
                        color:
                          school?.isActive !== false ? "#4CAF50" : "#F44336",
                        fontWeight: 600,
                        fontSize: 11,
                      }}
                    />
                    {school?.affiliationNumber && (
                      <Chip
                        label={`Affiliation: ${school.affiliationNumber}`}
                        size="small"
                        sx={{
                          bgcolor: "rgba(0,0,0,0.05)",
                          fontFamily: poppins.style.fontFamily,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      />
                    )}
                    {school?.affiliationCertificateDownloadUrl && (
                      <Chip
                        label="Download Certificate"
                        size="small"
                        icon={<DownloadIcon style={{ fontSize: 16 }} />}
                        onClick={() =>
                          window.open(
                            school.affiliationCertificateDownloadUrl,
                            "_blank",
                          )
                        }
                        sx={{
                          bgcolor: "rgba(33, 150, 243, 0.1)",
                          color: "#2196F3",
                          fontFamily: poppins.style.fontFamily,
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "rgba(33, 150, 243, 0.2)" },
                        }}
                      />
                    )}
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: poppins.style.fontFamily,
                      color: COLORS.TEXT_SECONDARY,
                      fontSize: 14,
                    }}
                  >
                    {[
                      school?.addressLine1,
                      school?.addressLine2,
                      school?.city,
                      school?.state,
                      school?.zipCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </Typography>
                  {school?.website && (
                    <Typography
                      sx={{
                        fontFamily: poppins.style.fontFamily,
                        color: COLORS.PRIMARY_NAVY,
                        fontSize: 14,
                        mt: 0.5,
                        "& a": {
                          color: "inherit",
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        },
                      }}
                    >
                      <a
                        href={
                          school.website.startsWith("http")
                            ? school.website
                            : `https://${school.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {school.website}
                      </a>
                    </Typography>
                  )}
                </>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard
            title="Mentors"
            value={data?.teacherCount || 0}
            icon={<People />}
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard
            title="Students"
            value={data?.studentCount || 0}
            icon={<People />}
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard
            title="Innovations"
            value={data?.innovationsPendingCount || 0}
            icon={<EmojiObjects />}
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard
            title="Patents"
            value={data?.patentGrantedCount || 0}
            icon={<CardMembership />}
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard
            title="Research"
            value={data?.researchCount || 0}
            icon={<Science />}
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard
            title="Startups"
            value={data?.startupCount || 0}
            icon={<AccountTree />}
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* User Lists */}
      <UserTable
        title="Mentors"
        users={data?.teachers || []}
        loading={loading}
        onViewDetails={(user) => router.push(`${pathname}/users/${user.id}`)}
      />
      <UserTable
        title="Students"
        users={data?.students || []}
        loading={loading}
        onViewDetails={(user) => router.push(`${pathname}/users/${user.id}`)}
      />
    </Box>
  );
};

export default SchoolDetails;
