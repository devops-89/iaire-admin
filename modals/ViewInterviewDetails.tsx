"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Chip,
  Button,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  School,
  Work,
  CalendarMonth,
  Person,
  Email,
  Phone,
  LocationOn,
  Info,
  Layers,
  Cancel,
} from "@mui/icons-material";
import { useModal } from "@/store/useModal";
import { TrainingControllers } from "@/app/api/trainingControllers";
import { poppins } from "@/utils/fonts";
import { COLORS, TRAINING_NOMINATION_STATUS } from "@/utils/enum";

interface ViewInterviewDetailsProps {
  teacherId: number;
}

const FS = { fontFamily: poppins.style.fontFamily };

const ViewInterviewDetails: React.FC<ViewInterviewDetailsProps> = ({ teacherId }) => {
  const { hideModal } = useModal();
  const [teacherDetails, setTeacherDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response: any = await TrainingControllers.getTrainingTeacherDetails(teacherId);
        if (response.data.success) {
          setTeacherDetails(response.data.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch teacher details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [teacherId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
        <CircularProgress size={40} sx={{ color: COLORS.PRIMARY_NAVY }} />
      </Box>
    );
  }

  if (!teacherDetails) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography sx={{ ...FS, color: COLORS.TEXT_SECONDARY }}>
          Teacher details not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0.5 }}>
      {/* Header Section as a styled Banner */}
      <Box
        sx={{
          p: 3,
          bgcolor: COLORS.PRIMARY_NAVY,
          color: "white",
          borderRadius: "18px",
          position: "relative",
          mb: 4,
          boxShadow: "0 10px 25px rgba(11, 23, 39, 0.15)",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", gap: 3 }}>
          <Avatar
            src={teacherDetails.teacher.profileImage}
            sx={{ width: 84, height: 84, border: "4px solid rgba(255,255,255,0.2)" }}
          />
          <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
            <Typography sx={{ ...FS, fontSize: 22, fontWeight: 800 }}>
              {teacherDetails?.teacher?.fullName || `${teacherDetails?.teacher?.firstName || ""} ${teacherDetails?.teacher?.lastName || ""}`.trim() || "Unknown Teacher"}
            </Typography>
            <Typography sx={{ ...FS, fontSize: 13, color: "rgba(255,255,255,0.8)", mt: 0.5 }}>
              {teacherDetails.teacher.role} • {teacherDetails.teacher.experienceYears} Years Experience
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 1.5, justifyContent: { xs: "center", sm: "flex-start" } }}
            >
              <Chip
                label={teacherDetails.status.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 10,
                  height: 24,
                  textTransform: "none",
                  border: "1px solid rgba(255,255,255,0.3)"
                }}
              />
              <Chip
                label={teacherDetails.training.type}
                size="small"
                sx={{ bgcolor: COLORS.ACCENT_TAN, color: "white", fontWeight: 700, fontSize: 10, height: 24 }}
              />
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Content Section */}
      <Grid container spacing={4}>
        {/* Left Column: Teacher Info */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography sx={{ ...FS, fontSize: 15, fontWeight: 800, mb: 2, color: COLORS.PRIMARY_NAVY, display: "flex", alignItems: "center", gap: 1 }}>
            <Info sx={{ fontSize: 18 }} /> Teacher Information
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Email sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
              <Box>
                <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY }}>Email Address</Typography>
                <Typography sx={{ ...FS, fontSize: 13, fontWeight: 600, wordBreak: "break-all" }}>{teacherDetails.teacher.email}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Phone sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
              <Box>
                <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY }}>Phone Number</Typography>
                <Typography sx={{ ...FS, fontSize: 13, fontWeight: 600 }}>
                  {teacherDetails.teacher.phone.startsWith("+") ? teacherDetails.teacher.phone : `${teacherDetails.teacher.countryCode} ${teacherDetails.teacher.phone}`}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Layers sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
              <Box>
                <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY }}>Primary Subjects</Typography>
                <Typography sx={{ ...FS, fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>
                  {teacherDetails.teacher.primarySubjects.map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Person sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
              <Box>
                <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY }}>Gender</Typography>
                <Typography sx={{ ...FS, fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>{teacherDetails.teacher.gender.toLowerCase()}</Typography>
              </Box>
            </Box>
          </Stack>
        </Grid>

        {/* Right Column: Training & School Info */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography sx={{ ...FS, fontSize: 15, fontWeight: 800, mb: 2, color: COLORS.PRIMARY_NAVY, display: "flex", alignItems: "center", gap: 1 }}>
            <School sx={{ fontSize: 18 }} /> Training & Institution
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <Work sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY, mt: 0.5 }} />
              <Box>
                <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY }}>Nominated School</Typography>
                <Typography sx={{ ...FS, fontSize: 13, fontWeight: 700 }}>{teacherDetails.training.school.name}</Typography>
                <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                  {teacherDetails.training.school.city}, {teacherDetails.training.school.state}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Info sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
              <Box>
                <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY }}>Training Title</Typography>
                <Typography sx={{ ...FS, fontSize: 13, fontWeight: 600 }}>{teacherDetails.training.title || `${teacherDetails.training.type} Training`}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CalendarMonth sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
              <Box>
                <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY }}>Availability Window</Typography>
                <Typography sx={{ ...FS, fontSize: 13, fontWeight: 600 }}>
                  {new Date(teacherDetails.availableFrom).toLocaleDateString()} - {new Date(teacherDetails.availableTo).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <LocationOn sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
              <Box>
                <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY }}>Training Mode</Typography>
                <Chip label={teacherDetails.training.mode} size="small" sx={{ fontWeight: 800, fontSize: 9, height: 20, bgcolor: "rgba(11, 23, 39, 0.05)" }} />
              </Box>
            </Box>

            {/* Status & Rejection Reason */}
            <Box sx={{ pt: 1 }}>
              <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>Nomination Status</Typography>
              <Chip
                label={teacherDetails.status.replace('_', ' ')}
                size="small"
                sx={{
                  fontWeight: 800,
                  fontSize: 10,
                  bgcolor:
                    teacherDetails.status === TRAINING_NOMINATION_STATUS.IAIRE_APPROVED ? "rgba(16, 185, 129, 0.1)" :
                      teacherDetails.status === TRAINING_NOMINATION_STATUS.REJECTED ? "rgba(239, 68, 68, 0.1)" :
                        "rgba(11, 23, 39, 0.05)",
                  color:
                    teacherDetails.status === TRAINING_NOMINATION_STATUS.IAIRE_APPROVED ? "#059669" :
                      teacherDetails.status === TRAINING_NOMINATION_STATUS.REJECTED ? "#DC2626" :
                        COLORS.PRIMARY_NAVY,
                }}
              />
              {teacherDetails.status === TRAINING_NOMINATION_STATUS.REJECTED && teacherDetails.reason && (
                <Box sx={{ mt: 2, p: 2, bgcolor: "rgba(239, 68, 68, 0.05)", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, 0.1)" }}>
                  <Typography sx={{ ...FS, fontSize: 10, color: "#DC2626", fontWeight: 700, mb: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Cancel sx={{ fontSize: 14 }} /> Rejection Reason
                  </Typography>
                  <Typography sx={{ ...FS, fontSize: 12, color: COLORS.BLACK, fontStyle: "italic" }}>
                    "{teacherDetails.reason}"
                  </Typography>
                </Box>
              )}
            </Box>
          </Stack>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3, borderStyle: "dashed" }} />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={hideModal}
          variant="outlined"
          sx={{ borderRadius: "10px", textTransform: "none", px: 4, color: COLORS.TEXT_SECONDARY, borderColor: "rgba(0,0,0,0.1)" }}
        >
          Close Profile
        </Button>
      </Box>
    </Box>
  );
};

export default ViewInterviewDetails;
