"use client";

import React, { useEffect, useState } from "react";
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
  Paper,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  School,
  Person,
  Email,
  Phone,
  LocationOn,
  AccountBalance,
  Lightbulb,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { HonorariumControllers } from "@/app/api/honorariumControllers";
import { poppins } from "@/utils/fonts";
import { COLORS, HONORARIUM_STATUS, TYPOGRAPHY } from "@/utils/enum";
import { HonorariumItem } from "@/utils/type";
import moment from "moment";

interface HonorariumDetailsProps {
  honorariumId: string | number;
}

const FS = { fontFamily: poppins.style.fontFamily };

const getStatusBadgeStyle = (status?: string) => {
  switch (status?.toUpperCase()) {
    case HONORARIUM_STATUS.PAID:
      return {
        bgcolor: COLORS.STATUS_SUCCESS_BG,
        color: COLORS.STATUS_SUCCESS_TEXT,
        border: `1px solid ${COLORS.STATUS_SUCCESS_BORDER}`,
      };
    case HONORARIUM_STATUS.APPROVED:
      return {
        bgcolor: COLORS.STATUS_INFO_BG,
        color: COLORS.STATUS_INFO_TEXT,
        border: `1px solid ${COLORS.STATUS_INFO_BORDER}`,
      };
    case HONORARIUM_STATUS.TRANSACTION_PENDING:
    case "TRANSACTION_PENDING":
    case "TRANSACTION PENDING":
      return {
        bgcolor: COLORS.STATUS_PURPLE_BG,
        color: COLORS.STATUS_PURPLE_TEXT,
        border: `1px solid ${COLORS.STATUS_PURPLE_BORDER}`,
      };
    case HONORARIUM_STATUS.REJECTED:
      return {
        bgcolor: COLORS.STATUS_ERROR_BG,
        color: COLORS.STATUS_ERROR_TEXT,
        border: `1px solid ${COLORS.STATUS_ERROR_BORDER}`,
      };
    case HONORARIUM_STATUS.PENDING:
    default:
      return {
        bgcolor: COLORS.STATUS_WARNING_BG,
        color: COLORS.STATUS_WARNING_TEXT,
        border: `1px solid ${COLORS.STATUS_WARNING_BORDER}`,
      };
  }
};

const formatTitleCase = (str?: string) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const HonorariumDetails: React.FC<HonorariumDetailsProps> = ({ honorariumId }) => {
  const router = useRouter();

  const [details, setDetails] = useState<HonorariumItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDetails = async () => {
    if (!honorariumId) return;
    setLoading(true);
    try {
      const response: any = await HonorariumControllers.getHonorariumDetails(honorariumId);
      if (response?.data?.success) {
        const item =
          response.data?.data?.data ||
          response.data?.data ||
          response.data;
        setDetails(item);
      }
    } catch (error) {
      console.error("Error fetching honorarium details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [honorariumId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress sx={{ color: COLORS.PRIMARY_NAVY }} />
      </Box>
    );
  }

  if (!details) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography sx={{ ...FS, fontSize: 16, color: COLORS.TEXT_SECONDARY, mb: 2 }}>
          Honorarium request not found or failed to load.
        </Typography>
        <Button
          onClick={() => router.push("/dashboard/honorarium")}
          variant="contained"
          sx={{
            ...FS,
            bgcolor: COLORS.PRIMARY_NAVY,
            color: COLORS.WHITE,
            textTransform: "none",
            borderRadius: "8px",
          }}
        >
          Back to List
        </Button>
      </Box>
    );
  }

  const {
    id,
    team,
    type,
    achievementType,
    amount,
    description,
    accountHolderName,
    bankName,
    accountNumber,
    ifscCode,
    branchName,
    status,
    school,
    creator,
    createdAt,
  } = details;

  const mentorName =
    creator?.fullName ||
    (creator?.firstName ? `${creator.firstName} ${creator.lastName || ""}`.trim() : "--");

  const statusBadgeStyle = getStatusBadgeStyle(status);

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      {/* Top Header & Navigation */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <IconButton
          onClick={() => router.push("/dashboard/honorarium")}
          sx={{
            color: COLORS.PRIMARY_NAVY,
            bgcolor: COLORS.INPUT_BG,
            "&:hover": { bgcolor: COLORS.HOVER_BG },
          }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ ...TYPOGRAPHY.PAGE_TITLE }}>
          Honorarium Details
        </Typography>
      </Box>

      {/* Hero Banner */}
      <Box
        sx={{
          p: 3.5,
          bgcolor: COLORS.PRIMARY_NAVY,
          color: COLORS.WHITE,
          borderRadius: "16px",
          mb: 3.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "center", sm: "flex-start" },
            gap: 3,
          }}
        >
          <Avatar
            src={creator?.profileImage}
            alt={mentorName}
            sx={{
              width: 80,
              height: 80,
              border: `3px solid ${COLORS.WHITE_ALPHA_20}`,
              bgcolor: COLORS.WHITE_ALPHA_15,
              color: COLORS.WHITE,
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {mentorName.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ textAlign: { xs: "center", sm: "left" }, flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
              <Typography
                sx={{
                  ...FS,
                  fontSize: 24,
                  fontWeight: 700,
                  color: COLORS.WHITE,
                  textTransform: "capitalize",
                }}
              >
                {mentorName}
              </Typography>

              <Chip
                label={status || "PENDING"}
                size="small"
                sx={{
                  ...FS,
                  fontSize: 12,
                  fontWeight: 600,
                  height: 26,
                  borderRadius: "6px",
                  ...statusBadgeStyle,
                }}
              />
            </Box>

            <Typography
              sx={{
                ...FS,
                fontSize: 13.5,
                color: COLORS.WHITE_ALPHA_75,
                mt: 0.5,
              }}
            >
              Honorarium Request #{id} • Submitted on {moment(createdAt).format("DD MMMM YYYY, hh:mm A")}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 2,
                justifyContent: { xs: "center", sm: "flex-start" },
                flexWrap: "wrap",
              }}
            >
              {type && (
                <Chip
                  label={formatTitleCase(type)}
                  size="small"
                  sx={{
                    ...FS,
                    fontSize: 11,
                    fontWeight: 600,
                    height: 24,
                    borderRadius: "6px",
                    bgcolor: COLORS.WHITE_ALPHA_12,
                    color: COLORS.WHITE,
                  }}
                />
              )}
              {achievementType && (
                <Chip
                  label={`Achievement: ${formatTitleCase(achievementType)}`}
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
              {amount !== null && amount !== undefined ? (
                <Chip
                  label={`Amount: ₹${Number(amount).toLocaleString()}`}
                  size="small"
                  sx={{
                    ...FS,
                    fontSize: 11,
                    fontWeight: 600,
                    height: 24,
                    borderRadius: "6px",
                    bgcolor: COLORS.STATUS_SUCCESS_BG,
                    color: COLORS.STATUS_SUCCESS_TEXT,
                  }}
                />
              ) : (
                <Chip
                  label="Amount: Pending Evaluation"
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
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Detailed Cards Grid */}
      <Grid container spacing={3.5}>
        {/* Bank & Payment Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "16px",
              border: `1px solid ${COLORS.BORDER_GRAY}`,
              bgcolor: COLORS.WHITE,
              height: "100%",
            }}
          >
            <Typography
              sx={{
                ...FS,
                fontSize: 15,
                fontWeight: 700,
                color: COLORS.PRIMARY_NAVY,
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2.5,
              }}
            >
              <AccountBalance sx={{ fontSize: 20, color: COLORS.INFO }} />
              Bank & Disbursal Information
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Typography sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}>
                  Account Holder Name
                </Typography>
                <Typography sx={{ ...FS, fontSize: 14, fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>
                  {accountHolderName || "--"}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}>
                  Bank Name
                </Typography>
                <Typography sx={{ ...FS, fontSize: 14, fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>
                  {bankName || "--"}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}>
                  Account Number
                </Typography>
                <Typography
                  sx={{
                    ...FS,
                    fontSize: 14,
                    fontWeight: 600,
                    color: COLORS.TEXT_PRIMARY,
                    letterSpacing: "0.5px",
                  }}
                >
                  {accountNumber || "--"}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}>
                    IFSC Code
                  </Typography>
                  <Typography sx={{ ...FS, fontSize: 13.5, fontWeight: 600, color: COLORS.PRIMARY_NAVY }}>
                    {ifscCode || "--"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}>
                    Branch
                  </Typography>
                  <Typography sx={{ ...FS, fontSize: 13.5, fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>
                    {branchName || "--"}
                  </Typography>
                </Grid>
              </Grid>

              {/* Honorarium Amount Highlight Card */}
              <Box
                sx={{
                  p: 2,
                  mt: 0.5,
                  borderRadius: "12px",
                  bgcolor: COLORS.BG_LIGHT,
                  border: `1px solid ${COLORS.BORDER_GRAY}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}>
                    Honorarium Amount
                  </Typography>
                  <Typography
                    sx={{
                      ...FS,
                      fontSize: 18,
                      fontWeight: 700,
                      color: amount ? COLORS.SUCCESS_DARK : COLORS.TEXT_PRIMARY,
                      mt: 0.25,
                    }}
                  >
                    {amount !== null && amount !== undefined
                      ? `₹${Number(amount).toLocaleString()}`
                      : "Pending Evaluation / Not Set"}
                  </Typography>
                </Box>
                <Chip
                  label={amount ? "Configured" : "Not Set"}
                  size="small"
                  sx={{
                    ...FS,
                    fontSize: 11,
                    fontWeight: 600,
                    bgcolor: amount ? COLORS.STATUS_SUCCESS_BG : COLORS.STATUS_WARNING_BG,
                    color: amount ? COLORS.STATUS_SUCCESS_TEXT : COLORS.STATUS_WARNING_TEXT,
                  }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "16px",
              border: `1px solid ${COLORS.BORDER_GRAY}`,
              bgcolor: COLORS.WHITE,
              height: "100%",
            }}
          >
            <Typography
              sx={{
                ...FS,
                fontSize: 15,
                fontWeight: 700,
                color: COLORS.PRIMARY_NAVY,
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2.5,
              }}
            >
              <Person sx={{ fontSize: 20, color: COLORS.INFO }} />
              Mentor / Teacher Details
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Typography sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}>
                  Email Address
                </Typography>
                <Typography sx={{ ...FS, fontSize: 14, fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>
                  {creator?.email || "--"}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}>
                  Phone
                </Typography>
                <Typography sx={{ ...FS, fontSize: 14, fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>
                  {creator?.phone ? `${creator.countryCode || ""} ${creator.phone}` : "--"}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}>
                  Experience
                </Typography>
                <Typography sx={{ ...FS, fontSize: 14, fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>
                  {creator?.experienceYears ? `${creator.experienceYears} Years` : "--"}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}>
                  Primary Subjects
                </Typography>
                <Typography sx={{ ...FS, fontSize: 13.5, fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>
                  {Array.isArray(creator?.primarySubjects)
                    ? creator.primarySubjects.join(", ")
                    : "--"}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Team & Innovation Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "16px",
              border: `1px solid ${COLORS.BORDER_GRAY}`,
              bgcolor: COLORS.WHITE,
            }}
          >
            <Typography
              sx={{
                ...FS,
                fontSize: 15,
                fontWeight: 700,
                color: COLORS.PRIMARY_NAVY,
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2.5,
              }}
            >
              <Lightbulb sx={{ fontSize: 20, color: COLORS.WARNING_DARK }} />
              Team & Innovation Project
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Typography sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}>
                  Team Name
                </Typography>
                <Typography sx={{ ...FS, fontSize: 14, fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>
                  {team?.title || "--"}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}>
                  Team Code
                </Typography>
                <Typography sx={{ ...FS, fontSize: 13.5, fontWeight: 500, color: COLORS.TEXT_SECONDARY }}>
                  {team?.teamCode || "--"}
                </Typography>
              </Box>

              {team?.members && team.members.length > 0 && (
                <Box>
                  <Typography sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY, mb: 1 }}>
                    Team Members ({team.members.length})
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {team.members.map((member: any, idx: number) => (
                      <Chip
                        key={member.id || idx}
                        label={member.student?.fullName || `Student ID #${member.studentId}`}
                        size="small"
                        sx={{ ...FS, fontSize: 11.5 }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* School Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "16px",
              border: `1px solid ${COLORS.BORDER_GRAY}`,
              bgcolor: COLORS.WHITE,
            }}
          >
            <Typography
              sx={{
                ...FS,
                fontSize: 15,
                fontWeight: 700,
                color: COLORS.PRIMARY_NAVY,
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2.5,
              }}
            >
              <School sx={{ fontSize: 20, color: COLORS.INDIGO }} />
              School Details
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Typography sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}>
                  School Name
                </Typography>
                <Typography sx={{ ...FS, fontSize: 14, fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>
                  {school?.name || "--"}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}>
                  School Code
                </Typography>
                <Typography sx={{ ...FS, fontSize: 13.5, fontWeight: 500, color: COLORS.TEXT_SECONDARY }}>
                  {school?.code || "--"}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ ...FS, fontSize: 11.5, color: COLORS.TEXT_SECONDARY }}>
                  Location
                </Typography>
                <Typography sx={{ ...FS, fontSize: 13.5, fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>
                  {[school?.city, school?.state, school?.zipCode].filter(Boolean).join(", ") || "--"}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Description Section */}
        {description && (
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "16px",
                border: `1px solid ${COLORS.BORDER_GRAY}`,
                bgcolor: COLORS.WHITE,
              }}
            >
              <Typography
                sx={{
                  ...FS,
                  fontSize: 15,
                  fontWeight: 700,
                  color: COLORS.PRIMARY_NAVY,
                  mb: 1.5,
                }}
              >
                Honorarium Description & Reason
              </Typography>
              <Typography
                sx={{
                  ...FS,
                  fontSize: 14,
                  color: COLORS.TEXT_PRIMARY,
                  lineHeight: 1.7,
                }}
              >
                {description}
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default HonorariumDetails;
