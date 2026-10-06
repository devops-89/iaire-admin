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
  EventAvailable,
  DescriptionOutlined,
} from "@mui/icons-material";
import { useModal } from "@/store/useModal";
import { TrainingControllers } from "@/app/api/trainingControllers";
import { poppins } from "@/utils/fonts";
import { COLORS, TRAINING_NOMINATION_STATUS } from "@/utils/enum";
import moment from "moment";

interface ViewInterviewDetailsProps {
  teacherId: number;
}

const FS = { fontFamily: poppins.style.fontFamily };

const formatStatusText = (status?: string) => {
  if (!status) return "--";
  return status
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const getStatusBadgeStyle = (status?: string) => {
  switch (status) {
    case TRAINING_NOMINATION_STATUS.TRAINING_COMPLETED:
      return {
        bgcolor: COLORS.STATUS_SUCCESS_BG,
        color: COLORS.STATUS_SUCCESS_TEXT,
        border: `1px solid ${COLORS.STATUS_SUCCESS_BORDER}`,
      };
    case TRAINING_NOMINATION_STATUS.IAIRE_APPROVED:
    case TRAINING_NOMINATION_STATUS.SCHOOL_APPROVED:
      return {
        bgcolor: COLORS.STATUS_INFO_BG,
        color: COLORS.STATUS_INFO_TEXT,
        border: `1px solid ${COLORS.STATUS_INFO_BORDER}`,
      };
    case TRAINING_NOMINATION_STATUS.INTERVIEW_SCHEDULED:
    case TRAINING_NOMINATION_STATUS.INTERVIEW_COMPLETED:
      return {
        bgcolor: COLORS.STATUS_PURPLE_BG,
        color: COLORS.STATUS_PURPLE_TEXT,
        border: `1px solid ${COLORS.STATUS_PURPLE_BORDER}`,
      };
    case TRAINING_NOMINATION_STATUS.REJECTED:
      return {
        bgcolor: COLORS.STATUS_ERROR_BG,
        color: COLORS.STATUS_ERROR_TEXT,
        border: `1px solid ${COLORS.STATUS_ERROR_BORDER}`,
      };
    case TRAINING_NOMINATION_STATUS.SELF_NOMINATED:
    case TRAINING_NOMINATION_STATUS.SCHOOL_ASSIGNED:
    default:
      return {
        bgcolor: COLORS.STATUS_WARNING_BG,
        color: COLORS.STATUS_WARNING_TEXT,
        border: `1px solid ${COLORS.STATUS_WARNING_BORDER}`,
      };
  }
};

const ViewInterviewDetails: React.FC<ViewInterviewDetailsProps> = ({
  teacherId,
}) => {
  const { hideModal } = useModal();
  const [teacherDetails, setTeacherDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchDetails = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response: any =
        await TrainingControllers.getTrainingTeacherDetails(teacherId);

      // Handle all possible API response wrapping
      const details =
        response?.data?.data?.data ||
        response?.data?.data ||
        response?.data;

      if (details) {
        setTeacherDetails(details);
      } else {
        setErrorMsg("Teacher record not found.");
      }
    } catch (error: any) {
      console.error("Failed to fetch teacher details", error);
      setErrorMsg(
        error?.response?.data?.message || "Failed to load teacher details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchDetails();
    }
  }, [teacherId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          py: 8,
          gap: 2,
        }}
      >
        <CircularProgress size={36} sx={{ color: COLORS.PRIMARY_NAVY }} />
        <Typography sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY }}>
          Loading profile details...
        </Typography>
      </Box>
    );
  }

  if (errorMsg || !teacherDetails) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography
          sx={{ ...FS, fontSize: 14, color: COLORS.TEXT_SECONDARY, mb: 2 }}
        >
          {errorMsg || "Teacher details not found."}
        </Typography>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
          <Button
            onClick={fetchDetails}
            variant="contained"
            size="small"
            sx={{
              ...FS,
              bgcolor: COLORS.PRIMARY_NAVY,
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            Retry
          </Button>
          <Button
            onClick={hideModal}
            variant="outlined"
            size="small"
            sx={{
              ...FS,
              borderColor: COLORS.BORDER_GRAY,
              color: COLORS.TEXT_PRIMARY,
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            Close
          </Button>
        </Stack>
      </Box>
    );
  }

  // Safe data resolution
  const teacher =
    teacherDetails?.teacher || teacherDetails?.user || teacherDetails || {};
  const training = teacherDetails?.training || {};
  const school = training?.school || teacherDetails?.school || {};
  const batch = training?.batch || teacherDetails?.batch || {};

  const programName = training?.title || batch?.name || "";
  const trainingDescription =
    training?.description || teacherDetails?.description || "";
  const availableFromDate = teacherDetails?.availableFrom || training?.startDate;
  const availableToDate = teacherDetails?.availableTo || training?.endDate;

  const fullName =
    teacher?.fullName ||
    `${teacher?.firstName || ""} ${teacher?.lastName || ""}`.trim() ||
    teacher?.name ||
    "--";

  const email = teacher?.email || "--";
  const phone = teacher?.phone
    ? teacher.phone.startsWith("+")
      ? teacher.phone
      : `${teacher.countryCode ? teacher.countryCode + " " : ""}${teacher.phone}`
    : "--";

  const primarySubjects = Array.isArray(teacher?.primarySubjects)
    ? teacher.primarySubjects
        .map((s: any) =>
          typeof s === "string"
            ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
            : s,
        )
        .join(", ")
    : typeof teacher?.primarySubjects === "string"
      ? teacher.primarySubjects
      : "--";

  const status = teacherDetails?.status;
  const statusBadgeStyle = getStatusBadgeStyle(status);

  return (
    <Box sx={{ p: 0.5 }}>
      {/* Header Banner */}
      <Box
        sx={{
          p: 3,
          bgcolor: COLORS.PRIMARY_NAVY,
          color: COLORS.WHITE,
          borderRadius: "16px",
          position: "relative",
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "center", sm: "flex-start" },
            gap: 2.5,
          }}
        >
          <Avatar
            src={teacher?.profileImage}
            alt={fullName}
            sx={{
              width: 72,
              height: 72,
              border: `3px solid ${COLORS.WHITE_ALPHA_20}`,
              bgcolor: COLORS.WHITE_ALPHA_15,
              color: COLORS.WHITE,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {fullName.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ textAlign: { xs: "center", sm: "left" }, flex: 1 }}>
            <Typography sx={{ ...FS, fontSize: 20, fontWeight: 700, color: COLORS.WHITE, textTransform: "capitalize" }}>
              {fullName}
            </Typography>

            <Typography
              sx={{
                ...FS,
                fontSize: 13,
                color: COLORS.WHITE_ALPHA_75,
                mt: 0.25,
              }}
            >
              {teacher?.role ? formatStatusText(teacher.role) : "Teacher"}
              {teacher?.experienceYears
                ? ` • ${teacher.experienceYears} Years Experience`
                : ""}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                mt: 1.5,
                justifyContent: { xs: "center", sm: "flex-start" },
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Chip
                label={formatStatusText(status)}
                size="small"
                sx={{
                  ...FS,
                  fontSize: 11,
                  fontWeight: 600,
                  height: 24,
                  borderRadius: "6px",
                  ...statusBadgeStyle,
                }}
              />
              {programName && (
                <Chip
                  label={programName}
                  size="small"
                  sx={{
                    ...FS,
                    fontSize: 11,
                    fontWeight: 500,
                    height: 24,
                    borderRadius: "6px",
                    bgcolor: COLORS.WHITE_ALPHA_12,
                    color: COLORS.WHITE,
                  }}
                />
              )}
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Content Section */}
      <Grid container spacing={3}>
        {/* Left Column: Teacher Personal Information */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography
            sx={{
              ...FS,
              fontSize: 13,
              fontWeight: 700,
              mb: 2,
              color: COLORS.PRIMARY_NAVY,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Info sx={{ fontSize: 18, color: COLORS.PRIMARY_NAVY }} /> Mentor Information
          </Typography>

          <Stack spacing={2}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
              <Email sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY, mt: 0.2 }} />
              <Box>
                <Typography
                  sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}
                >
                  Email Address
                </Typography>
                <Typography
                  sx={{
                    ...FS,
                    fontSize: 13,
                    fontWeight: 600,
                    color: COLORS.TEXT_PRIMARY,
                    wordBreak: "break-all",
                  }}
                >
                  {email}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
              <Phone sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY, mt: 0.2 }} />
              <Box>
                <Typography
                  sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}
                >
                  Phone Number
                </Typography>
                <Typography
                  sx={{
                    ...FS,
                    fontSize: 13,
                    fontWeight: 600,
                    color: COLORS.TEXT_PRIMARY,
                  }}
                >
                  {phone}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
              <Layers sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY, mt: 0.2 }} />
              <Box>
                <Typography
                  sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}
                >
                  Primary Subjects
                </Typography>
                <Typography
                  sx={{
                    ...FS,
                    fontSize: 13,
                    fontWeight: 600,
                    color: COLORS.TEXT_PRIMARY,
                  }}
                >
                  {primarySubjects}
                </Typography>
              </Box>
            </Box>

            {teacher?.gender && (
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <Person sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY, mt: 0.2 }} />
                <Box>
                  <Typography
                    sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}
                  >
                    Gender
                  </Typography>
                  <Typography
                    sx={{
                      ...FS,
                      fontSize: 13,
                      fontWeight: 600,
                      color: COLORS.TEXT_PRIMARY,
                      textTransform: "capitalize",
                    }}
                  >
                    {teacher.gender}
                  </Typography>
                </Box>
              </Box>
            )}
          </Stack>
        </Grid>

        {/* Right Column: Training & School Information */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography
            sx={{
              ...FS,
              fontSize: 13,
              fontWeight: 700,
              mb: 2,
              color: COLORS.PRIMARY_NAVY,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <School sx={{ fontSize: 18, color: COLORS.PRIMARY_NAVY }} /> Training & School
          </Typography>

          <Stack spacing={2}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
              <Work sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY, mt: 0.2 }} />
              <Box>
                <Typography
                  sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}
                >
                  Nominated School
                </Typography>
                <Typography
                  sx={{
                    ...FS,
                    fontSize: 13,
                    fontWeight: 600,
                    color: COLORS.TEXT_PRIMARY,
                  }}
                >
                  {school?.name || "--"}
                </Typography>
                {(school?.city || school?.state) && (
                  <Typography
                    sx={{ ...FS, fontSize: 12, color: COLORS.TEXT_SECONDARY }}
                  >
                    {[school?.city, school?.state, school?.country]
                      .filter(Boolean)
                      .join(", ")}
                  </Typography>
                )}
              </Box>
            </Box>

            {trainingDescription && (
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <DescriptionOutlined
                  sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY, mt: 0.2 }}
                />
                <Box>
                  <Typography
                    sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}
                  >
                    Description
                  </Typography>
                  <Typography
                    sx={{
                      ...FS,
                      fontSize: 13,
                      fontWeight: 500,
                      color: COLORS.TEXT_PRIMARY,
                      lineHeight: 1.5,
                    }}
                  >
                    {trainingDescription}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
              <CalendarMonth
                sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY, mt: 0.2 }}
              />
              <Box>
                <Typography
                  sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}
                >
                  Availability Window
                </Typography>
                <Typography
                  sx={{
                    ...FS,
                    fontSize: 13,
                    fontWeight: 600,
                    color: COLORS.TEXT_PRIMARY,
                  }}
                >
                  {availableFromDate
                    ? moment(availableFromDate).format("DD MMM YYYY")
                    : "--"}{" "}
                  -{" "}
                  {availableToDate
                    ? moment(availableToDate).format("DD MMM YYYY")
                    : "--"}
                </Typography>
              </Box>
            </Box>

            {teacherDetails?.interviewScheduledAt && (
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <EventAvailable
                  sx={{ fontSize: 18, color: COLORS.SUCCESS_DARK, mt: 0.2 }}
                />
                <Box>
                  <Typography
                    sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}
                  >
                    Interview Scheduled At
                  </Typography>
                  <Typography
                    sx={{
                      ...FS,
                      fontSize: 13,
                      fontWeight: 600,
                      color: COLORS.SUCCESS_DARK,
                    }}
                  >
                    {moment(teacherDetails.interviewScheduledAt).format(
                      "DD MMM YYYY, hh:mm A",
                    )}
                  </Typography>
                </Box>
              </Box>
            )}

            {(training?.mode || teacherDetails?.mode) && (
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <LocationOn
                  sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY, mt: 0.2 }}
                />
                <Box>
                  <Typography
                    sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}
                  >
                    Training Mode
                  </Typography>
                  <Typography
                    sx={{
                      ...FS,
                      fontSize: 13,
                      fontWeight: 600,
                      color: COLORS.TEXT_PRIMARY,
                      textTransform: "capitalize",
                    }}
                  >
                    {training?.mode || teacherDetails?.mode}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Rejection Reason if Rejected */}
            {teacherDetails?.reason && (
              <Box
                sx={{
                  p: 1.75,
                  bgcolor: COLORS.ERROR_LIGHT_BG,
                  borderRadius: "10px",
                  border: `1px solid ${COLORS.ERROR_LIGHT_BORDER}`,
                }}
              >
                <Typography
                  sx={{
                    ...FS,
                    fontSize: 11,
                    color: COLORS.ERROR_DARK,
                    fontWeight: 700,
                    mb: 0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Cancel sx={{ fontSize: 14 }} /> Rejection Reason
                </Typography>
                <Typography
                  sx={{
                    ...FS,
                    fontSize: 12,
                    color: COLORS.PRIMARY_NAVY,
                    fontStyle: "italic",
                  }}
                >
                  "{teacherDetails.reason}"
                </Typography>
              </Box>
            )}
          </Stack>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2.5, borderColor: COLORS.BORDER_GRAY }} />

      {/* Footer Actions */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={hideModal}
          variant="outlined"
          sx={{
            ...FS,
            borderRadius: "8px",
            textTransform: "none",
            px: 3,
            fontSize: "13px",
            fontWeight: 500,
            color: COLORS.TEXT_PRIMARY,
            borderColor: COLORS.BORDER_GRAY,
            "&:hover": {
              borderColor: COLORS.BORDER_LIGHT,
              bgcolor: COLORS.BG_LIGHT,
            },
          }}
        >
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default ViewInterviewDetails;
