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
} from "@mui/material";
import {
  School,
  Person,
  Email,
  Phone,
  LocationOn,
  Info,
  AccountBalance,
  Groups,
  Lightbulb,
  CreditCard,
  Edit,
  Close,
} from "@mui/icons-material";
import { useModal } from "@/store/useModal";
import { HonorariumControllers } from "@/app/api/honorariumControllers";
import { poppins } from "@/utils/fonts";
import { COLORS, HONORARIUM_STATUS } from "@/utils/enum";
import { HonorariumItem } from "@/utils/type";
import UpdateHonorariumStatus from "@/modals/UpdateHonorariumStatus";
import moment from "moment";


interface ViewHonorariumDetailsProps {
  honorariumId: number;
  initialData?: HonorariumItem;
  onStatusUpdated?: () => void;
}

const FS = { fontFamily: poppins.style.fontFamily };

/**
 * Returns color-coded style for honorarium status chips
 */
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

const ViewHonorariumDetails: React.FC<ViewHonorariumDetailsProps> = ({
  honorariumId,
  initialData,
  onStatusUpdated,
}) => {
  const { hideModal, showModal } = useModal();
  const [details, setDetails] = useState<HonorariumItem | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!honorariumId) return;
      setLoading(true);
      try {
        const response: any = await HonorariumControllers.getHonorariumDetails(honorariumId);
        if (response?.data?.success) {
          const item = response.data.data?.data || response.data.data;
          setDetails(item);
        }
      } catch (error) {
        console.error("Error fetching honorarium details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [honorariumId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
        <CircularProgress sx={{ color: COLORS.PRIMARY_NAVY }} />
      </Box>
    );
  }

  if (!details) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography sx={{ ...FS, fontSize: 16, color: COLORS.TEXT_SECONDARY }}>
          Unable to load honorarium details.
        </Typography>
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

  const handleOpenUpdateStatus = () => {
    if (details) {
      showModal(
        <UpdateHonorariumStatus
          honorarium={details}
          onSuccess={() => {
            if (onStatusUpdated) onStatusUpdated();
            hideModal();
          }}
        />,
        { size: "sm" }
      );
    }
  };

  return (
    <Box sx={{ p: 0.5, maxHeight: "85vh", overflowY: "auto" }}>
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
            src={creator?.profileImage}
            alt={mentorName}
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
            {mentorName.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ textAlign: { xs: "center", sm: "left" }, flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
              <Typography
                sx={{
                  ...FS,
                  fontSize: 20,
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
                  fontSize: 11,
                  fontWeight: 600,
                  height: 24,
                  borderRadius: "6px",
                  ...statusBadgeStyle,
                }}
              />
            </Box>

            <Typography
              sx={{
                ...FS,
                fontSize: 13,
                color: COLORS.WHITE_ALPHA_75,
                mt: 0.5,
              }}
            >
              Honorarium Request #{id} • Submitted on {moment(createdAt).format("DD MMM YYYY, hh:mm A")}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 1.5,
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
              {amount !== null && amount !== undefined && (
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
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Grid */}
      <Grid container spacing={3}>
        {/* Bank Account Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: "14px",
              border: `1px solid ${COLORS.BORDER_GRAY}`,
              bgcolor: COLORS.BG_LIGHT,
              height: "100%",
            }}
          >
            <Typography
              sx={{
                ...FS,
                fontSize: 14,
                fontWeight: 700,
                color: COLORS.PRIMARY_NAVY,
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <AccountBalance sx={{ fontSize: 18, color: COLORS.INFO }} />
              Bank & Payment Details
            </Typography>

            <Stack spacing={1.75}>
              <Box>
                <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                  Account Holder Name
                </Typography>
                <Typography sx={{ ...FS, fontSize: 13.5, fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>
                  {accountHolderName || "--"}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                  Bank Name
                </Typography>
                <Typography sx={{ ...FS, fontSize: 13.5, fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>
                  {bankName || "--"}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                  Account Number
                </Typography>
                <Typography
                  sx={{
                    ...FS,
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: COLORS.TEXT_PRIMARY,
                    letterSpacing: "1px",
                  }}
                >
                  {accountNumber || "--"}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                    IFSC Code
                  </Typography>
                  <Typography sx={{ ...FS, fontSize: 13, fontWeight: 600, color: COLORS.PRIMARY_NAVY }}>
                    {ifscCode || "--"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                    Branch Name
                  </Typography>
                  <Typography sx={{ ...FS, fontSize: 13, fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>
                    {branchName || "--"}
                  </Typography>
                </Grid>
              </Grid>

              {/* Amount Highlight */}
              <Box
                sx={{
                  p: 1.5,
                  mt: 0.5,
                  borderRadius: "10px",
                  bgcolor: COLORS.WHITE,
                  border: `1px solid ${COLORS.BORDER_GRAY}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                    Honorarium Amount
                  </Typography>
                  <Typography
                    sx={{
                      ...FS,
                      fontSize: 16,
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
                    fontSize: 10.5,
                    fontWeight: 600,
                    bgcolor: amount ? COLORS.STATUS_SUCCESS_BG : COLORS.STATUS_WARNING_BG,
                    color: amount ? COLORS.STATUS_SUCCESS_TEXT : COLORS.STATUS_WARNING_TEXT,
                  }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Mentor / Requester Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: "14px",
              border: `1px solid ${COLORS.BORDER_GRAY}`,
              bgcolor: COLORS.BG_LIGHT,
              height: "100%",
            }}
          >
            <Typography
              sx={{
                ...FS,
                fontSize: 14,
                fontWeight: 700,
                color: COLORS.PRIMARY_NAVY,
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <Person sx={{ fontSize: 18, color: COLORS.INFO }} />
              Mentor / Teacher Details
            </Typography>

            <Stack spacing={1.75}>
              <Box>
                <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                  Email Address
                </Typography>
                <Typography sx={{ ...FS, fontSize: 13.5, fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>
                  {creator?.email || "--"}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                  Phone Number
                </Typography>
                <Typography sx={{ ...FS, fontSize: 13.5, fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>
                  {creator?.phone ? `${creator.countryCode || ""} ${creator.phone}` : "--"}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                  Experience
                </Typography>
                <Typography sx={{ ...FS, fontSize: 13.5, fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>
                  {creator?.experienceYears ? `${creator.experienceYears} Years` : "--"}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                  Primary Subjects
                </Typography>
                <Typography sx={{ ...FS, fontSize: 13, fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>
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
              p: 2.5,
              borderRadius: "14px",
              border: `1px solid ${COLORS.BORDER_GRAY}`,
              bgcolor: COLORS.BG_LIGHT,
            }}
          >
            <Typography
              sx={{
                ...FS,
                fontSize: 14,
                fontWeight: 700,
                color: COLORS.PRIMARY_NAVY,
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <Lightbulb sx={{ fontSize: 18, color: COLORS.WARNING_DARK }} />
              Team & Innovation
            </Typography>

            <Stack spacing={1.5}>
              <Box>
                <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                  Team Name
                </Typography>
                <Typography sx={{ ...FS, fontSize: 13.5, fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>
                  {team?.title || "--"}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                  Team Code
                </Typography>
                <Typography sx={{ ...FS, fontSize: 13, fontWeight: 500, color: COLORS.TEXT_SECONDARY }}>
                  {team?.teamCode || "--"}
                </Typography>
              </Box>

              {team?.members && team.members.length > 0 && (
                <Box>
                  <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>
                    Team Members ({team.members.length})
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {team.members.map((member: any, idx: number) => (
                      <Chip
                        key={member.id || idx}
                        label={member.student?.fullName || `Student ID #${member.studentId}`}
                        size="small"
                        sx={{ ...FS, fontSize: 11 }}
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
              p: 2.5,
              borderRadius: "14px",
              border: `1px solid ${COLORS.BORDER_GRAY}`,
              bgcolor: COLORS.BG_LIGHT,
            }}
          >
            <Typography
              sx={{
                ...FS,
                fontSize: 14,
                fontWeight: 700,
                color: COLORS.PRIMARY_NAVY,
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <School sx={{ fontSize: 18, color: COLORS.INDIGO }} />
              School Details
            </Typography>

            <Stack spacing={1.5}>
              <Box>
                <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                  School Name
                </Typography>
                <Typography sx={{ ...FS, fontSize: 13.5, fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>
                  {school?.name || "--"}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                  School Code
                </Typography>
                <Typography sx={{ ...FS, fontSize: 13, fontWeight: 500, color: COLORS.TEXT_SECONDARY }}>
                  {school?.code || "--"}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                  Address
                </Typography>
                <Typography sx={{ ...FS, fontSize: 13, fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>
                  {[school?.city, school?.state, school?.zipCode].filter(Boolean).join(", ") || "--"}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Request Description */}
        {description && (
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: "14px",
                border: `1px solid ${COLORS.BORDER_GRAY}`,
                bgcolor: COLORS.BG_LIGHT,
              }}
            >
              <Typography
                sx={{
                  ...FS,
                  fontSize: 14,
                  fontWeight: 700,
                  color: COLORS.PRIMARY_NAVY,
                  mb: 1,
                }}
              >
                Request Description & Details
              </Typography>
              <Typography
                sx={{
                  ...FS,
                  fontSize: 13.5,
                  color: COLORS.TEXT_PRIMARY,
                  lineHeight: 1.6,
                }}
              >
                {description}
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Bottom Footer Actions */}
      <Box
        sx={{
          mt: 4,
          pt: 2.5,
          borderTop: `1px solid ${COLORS.BORDER_GRAY}`,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Button
          onClick={hideModal}
          variant="outlined"
          sx={{
            ...FS,
            fontSize: "13px",
            borderColor: COLORS.BORDER_GRAY,
            color: COLORS.TEXT_PRIMARY,
            textTransform: "none",
            borderRadius: "8px",
            px: 2.5,
            "&:hover": { borderColor: COLORS.PRIMARY_NAVY, bgcolor: COLORS.HOVER_BG },
          }}
        >
          Close
        </Button>
        <Button
          onClick={handleOpenUpdateStatus}
          variant="contained"
          startIcon={<Edit sx={{ fontSize: 16 }} />}
          sx={{
            ...FS,
            fontSize: "13px",
            bgcolor: COLORS.PRIMARY_NAVY,
            color: COLORS.WHITE,
            textTransform: "none",
            borderRadius: "8px",
            px: 2.5,
            "&:hover": { bgcolor: COLORS.SECONDARY_NAVY },
          }}
        >
          Update Status
        </Button>
      </Box>
    </Box>
  );
};

export default ViewHonorariumDetails;
