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
  IconButton,
  Paper,
} from "@mui/material";
import {
  ArrowBack,
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
  Refresh,
} from "@mui/icons-material";
import { TrainingControllers } from "@/app/api/trainingControllers";
import { poppins } from "@/utils/fonts";
import { COLORS, TRAINING_NOMINATION_STATUS, TYPOGRAPHY } from "@/utils/enum";
import { useRouter } from "next/navigation";
import moment from "moment";

interface InterviewDetailsProps {
  teacherId: string | number;
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

const InterviewDetails: React.FC<InterviewDetailsProps> = ({ teacherId }) => {
  const router = useRouter();
  const [teacherDetails, setTeacherDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchDetails = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response: any =
        await TrainingControllers.getTrainingTeacherDetails(Number(teacherId));

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
        error?.response?.data?.message || "Failed to load mentor details.",
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
      <Box sx={{ width: "100%", py: 4 }}>
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            onClick={() => router.push("/dashboard/interviews")}
            sx={{
              color: COLORS.PRIMARY_NAVY,
              bgcolor: COLORS.INPUT_BG,
              "&:hover": { bgcolor: COLORS.HOVER_BG },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ ...TYPOGRAPHY.PAGE_TITLE }}>
            Mentor Details
          </Typography>
        </Box>
        <Paper
          sx={{
            p: 8,
            borderRadius: "16px",
            border: `1px solid ${COLORS.BORDER_GRAY}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <CircularProgress size={36} sx={{ color: COLORS.PRIMARY_NAVY }} />
          <Typography sx={{ ...FS, fontSize: 14, color: COLORS.TEXT_SECONDARY }}>
            Loading mentor profile details...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (errorMsg || !teacherDetails) {
    return (
      <Box sx={{ width: "100%", py: 4 }}>
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            onClick={() => router.push("/dashboard/interviews")}
            sx={{
              color: COLORS.PRIMARY_NAVY,
              bgcolor: COLORS.INPUT_BG,
              "&:hover": { bgcolor: COLORS.HOVER_BG },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ ...TYPOGRAPHY.PAGE_TITLE }}>
            Mentor Details
          </Typography>
        </Box>
        <Paper
          sx={{
            p: 6,
            borderRadius: "16px",
            border: `1px solid ${COLORS.BORDER_GRAY}`,
            textAlign: "center",
          }}
        >
          <Typography
            sx={{ ...FS, fontSize: 15, color: COLORS.TEXT_SECONDARY, mb: 2.5 }}
          >
            {errorMsg || "Mentor details not found."}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
            <Button
              onClick={fetchDetails}
              variant="contained"
              startIcon={<Refresh />}
              sx={{
                ...FS,
                bgcolor: COLORS.PRIMARY_NAVY,
                textTransform: "none",
                borderRadius: "8px",
                px: 2.5,
              }}
            >
              Retry
            </Button>
            <Button
              onClick={() => router.push("/dashboard/interviews")}
              variant="outlined"
              sx={{
                ...FS,
                borderColor: COLORS.BORDER_GRAY,
                color: COLORS.TEXT_PRIMARY,
                textTransform: "none",
                borderRadius: "8px",
                px: 2.5,
              }}
            >
              Back to Training Management
            </Button>
          </Stack>
        </Paper>
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
    <Box sx={{ width: "100%", pb: 4 }}>
      {/* Top Page Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            onClick={() => router.push("/dashboard/interviews")}
            sx={{
              color: COLORS.PRIMARY_NAVY,
              bgcolor: COLORS.INPUT_BG,
              "&:hover": { bgcolor: COLORS.HOVER_BG },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ ...TYPOGRAPHY.PAGE_TITLE }}>
            Mentor Details
          </Typography>
        </Box>

        <Button
          onClick={() => router.push("/dashboard/interviews")}
          variant="outlined"
          sx={{
            ...FS,
            fontSize: "13px",
            borderColor: COLORS.BORDER_GRAY,
            color: COLORS.TEXT_PRIMARY,
            textTransform: "none",
            borderRadius: "8px",
            px: 2,
            "&:hover": {
              borderColor: COLORS.PRIMARY_NAVY,
              bgcolor: COLORS.HOVER_BG,
            },
          }}
        >
          Back to List
        </Button>
      </Box>

      {/* Main Content Card */}
      <Paper
        sx={{
          p: { xs: 2.5, md: 3.5 },
          borderRadius: "16px",
          border: `1px solid ${COLORS.BORDER_GRAY}`,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
          bgcolor: COLORS.WHITE,
        }}
      >
        {/* Hero Banner Card */}
        <Box
          sx={{
            p: 3,
            bgcolor: COLORS.PRIMARY_NAVY,
            color: COLORS.WHITE,
            borderRadius: "14px",
            mb: 3.5,
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
                width: 76,
                height: 76,
                border: `3px solid ${COLORS.WHITE_ALPHA_20}`,
                bgcolor: COLORS.WHITE_ALPHA_15,
                color: COLORS.WHITE,
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              {fullName.charAt(0).toUpperCase()}
            </Avatar>

            <Box sx={{ textAlign: { xs: "center", sm: "left" }, flex: 1 }}>
              <Typography
                sx={{
                  ...FS,
                  fontSize: 22,
                  fontWeight: 700,
                  color: COLORS.WHITE,
                }}
              >
                {fullName}
              </Typography>

              <Typography
                sx={{
                  ...FS,
                  fontSize: 13.5,
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

        {/* 2-Column Info Grid */}
        <Grid container spacing={4}>
          {/* Left Column: Mentor Information */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography
              sx={{
                ...FS,
                fontSize: 14,
                fontWeight: 700,
                mb: 2.5,
                color: COLORS.PRIMARY_NAVY,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Info sx={{ fontSize: 19, color: COLORS.PRIMARY_NAVY }} /> Mentor Information
            </Typography>

            <Stack spacing={2.5}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <Email
                  sx={{ fontSize: 19, color: COLORS.TEXT_SECONDARY, mt: 0.2 }}
                />
                <Box>
                  <Typography
                    sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}
                  >
                    Email Address
                  </Typography>
                  <Typography
                    sx={{
                      ...FS,
                      fontSize: 13.5,
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
                <Phone
                  sx={{ fontSize: 19, color: COLORS.TEXT_SECONDARY, mt: 0.2 }}
                />
                <Box>
                  <Typography
                    sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}
                  >
                    Phone Number
                  </Typography>
                  <Typography
                    sx={{
                      ...FS,
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: COLORS.TEXT_PRIMARY,
                    }}
                  >
                    {phone}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <Layers
                  sx={{ fontSize: 19, color: COLORS.TEXT_SECONDARY, mt: 0.2 }}
                />
                <Box>
                  <Typography
                    sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}
                  >
                    Primary Subjects
                  </Typography>
                  <Typography
                    sx={{
                      ...FS,
                      fontSize: 13.5,
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
                  <Person
                    sx={{ fontSize: 19, color: COLORS.TEXT_SECONDARY, mt: 0.2 }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        ...FS,
                        fontSize: 11.5,
                        color: COLORS.TEXT_SECONDARY,
                      }}
                    >
                      Gender
                    </Typography>
                    <Typography
                      sx={{
                        ...FS,
                        fontSize: 13.5,
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

          {/* Right Column: Training & School */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography
              sx={{
                ...FS,
                fontSize: 14,
                fontWeight: 700,
                mb: 2.5,
                color: COLORS.PRIMARY_NAVY,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <School sx={{ fontSize: 19, color: COLORS.PRIMARY_NAVY }} /> Training & School
            </Typography>

            <Stack spacing={2.5}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <Work
                  sx={{ fontSize: 19, color: COLORS.TEXT_SECONDARY, mt: 0.2 }}
                />
                <Box>
                  <Typography
                    sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}
                  >
                    Nominated School
                  </Typography>
                  <Typography
                    sx={{
                      ...FS,
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: COLORS.TEXT_PRIMARY,
                    }}
                  >
                    {school?.name || "--"}
                  </Typography>
                  {(school?.city || school?.state) && (
                    <Typography
                      sx={{
                        ...FS,
                        fontSize: 12,
                        color: COLORS.TEXT_SECONDARY,
                        mt: 0.25,
                      }}
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
                    sx={{ fontSize: 19, color: COLORS.TEXT_SECONDARY, mt: 0.2 }}
                  />
                  <Box>
                    <Typography
                      sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}
                    >
                      Description
                    </Typography>
                    <Typography
                      sx={{
                        ...FS,
                        fontSize: 13,
                        fontWeight: 500,
                        color: COLORS.TEXT_PRIMARY,
                        lineHeight: 1.6,
                        mt: 0.25,
                      }}
                    >
                      {trainingDescription}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <CalendarMonth
                  sx={{ fontSize: 19, color: COLORS.TEXT_SECONDARY, mt: 0.2 }}
                />
                <Box>
                  <Typography
                    sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}
                  >
                    Availability Window
                  </Typography>
                  <Typography
                    sx={{
                      ...FS,
                      fontSize: 13.5,
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
                    sx={{ fontSize: 19, color: COLORS.SUCCESS_DARK, mt: 0.2 }}
                  />
                  <Box>
                    <Typography
                      sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}
                    >
                      Interview Scheduled At
                    </Typography>
                    <Typography
                      sx={{
                        ...FS,
                        fontSize: 13.5,
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
                    sx={{ fontSize: 19, color: COLORS.TEXT_SECONDARY, mt: 0.2 }}
                  />
                  <Box>
                    <Typography
                      sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}
                    >
                      Training Mode
                    </Typography>
                    <Typography
                      sx={{
                        ...FS,
                        fontSize: 13.5,
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

              {teacherDetails?.reason && (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: COLORS.ERROR_LIGHT_BG,
                    borderRadius: "10px",
                    border: `1px solid ${COLORS.ERROR_LIGHT_BORDER}`,
                  }}
                >
                  <Typography
                    sx={{
                      ...FS,
                      fontSize: 12,
                      color: COLORS.ERROR_DARK,
                      fontWeight: 700,
                      mb: 0.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Cancel sx={{ fontSize: 16 }} /> Rejection Reason
                  </Typography>
                  <Typography
                    sx={{
                      ...FS,
                      fontSize: 13,
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
      </Paper>
    </Box>
  );
};

export default InterviewDetails;
