"use client";
import React, { useEffect } from "react";
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Chip,
  Divider,
  CircularProgress,
  Button,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useInnovationDetails } from "@/hooks/common/useInnovations";
import { roboto, montserrat } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";
import moment from "moment";

const InnovationDetails = ({ id }: { id: string | number }) => {
  const router = useRouter();
  const { getInnovationDetails, innovationDetails, loading } =
    useInnovationDetails();

  useEffect(() => {
    if (id) {
      getInnovationDetails(id);
    }
  }, [id]);

  if (loading || !innovationDetails) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const data = innovationDetails;

  const renderStatus = (status: string) => {
    let color = "default";
    if (
      status?.toUpperCase().includes("APPROVED") ||
      status?.toUpperCase() === "GRANTED"
    ) {
      color = "success";
    } else if (status?.toUpperCase().includes("REJECTED")) {
      color = "error";
    } else if (
      status?.toUpperCase() === "PENDING" ||
      status?.toUpperCase().includes("UNDER_REVIEW")
    ) {
      color = "warning";
    }
    return (
      <Chip
        label={status || "N/A"}
        color={color as any}
        sx={{ fontWeight: 600, textTransform: "capitalize" }}
      />
    );
  };

  const DetailRow = ({ label, value }: { label: string; value: any }) => {
    if (value === null || value === undefined || value === "") return null;
    return (
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="caption"
          sx={{
            color: COLORS.TEXT_SECONDARY,
            fontWeight: 600,
            display: "block",
            mb: 0.5,
            textTransform: "uppercase",
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: montserrat.style.fontFamily,
            fontWeight: 600,
            color: COLORS.TEXT_PRIMARY,
            wordBreak: "break-word",
          }}
        >
          {String(value)}
        </Typography>
      </Box>
    );
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => router.back()}
        sx={{
          textTransform: "none",
          color: COLORS.TEXT_PRIMARY,
          fontFamily: montserrat.style.fontFamily,
          fontWeight: 600,
          mb: 3,
        }}
      >
        Back to Innovations
      </Button>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            sx={{
              p: 4,
              borderRadius: "16px",
              border: `1px solid ${COLORS.GLASS_BORDER}`,
              boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
            }}
          >
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 4,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontFamily: roboto.style.fontFamily,
                  fontWeight: 800,
                  color: COLORS.PRIMARY_NAVY,
                  textTransform: "capitalize",
                }}
              >
                {data.title || "Untitled Innovation"}
              </Typography>
              {renderStatus(data.status)}
            </Stack>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: roboto.style.fontFamily,
                  fontWeight: 700,
                  mb: 1,
                  color: COLORS.PRIMARY_NAVY,
                }}
              >
                Problem Description
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: montserrat.style.fontFamily,
                  color: COLORS.TEXT_SECONDARY,
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                }}
              >
                {data.problemDescription || "No problem description provided."}
              </Typography>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: roboto.style.fontFamily,
                  fontWeight: 700,
                  mb: 1,
                  color: COLORS.PRIMARY_NAVY,
                }}
              >
                Proposed Solution
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: montserrat.style.fontFamily,
                  color: COLORS.TEXT_SECONDARY,
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                }}
              >
                {data.solution || "No solution provided."}
              </Typography>
            </Box>

            {data.reviewComments && (
              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  backgroundColor: "rgba(245, 158, 11, 0.05)",
                  borderRadius: "12px",
                  border: "1px solid rgba(245, 158, 11, 0.2)",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: roboto.style.fontFamily,
                    fontWeight: 700,
                    color: "#D97706",
                    mb: 1,
                  }}
                >
                  Reviewer Comments
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: montserrat.style.fontFamily,
                    color: COLORS.TEXT_PRIMARY,
                  }}
                >
                  {data.reviewComments}
                </Typography>
              </Box>
            )}
          </Card>

          {data.team && (
            <Card
              sx={{
                p: 4,
                mt: 4,
                borderRadius: "16px",
                border: `1px solid ${COLORS.GLASS_BORDER}`,
                boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: roboto.style.fontFamily,
                  fontWeight: 700,
                  mb: 3,
                  color: COLORS.PRIMARY_NAVY,
                }}
              >
                Team Details
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailRow label="Team Name" value={data.team.title} />
                  <DetailRow label="Team Code" value={data.team.teamCode} />
                  <DetailRow label="Type" value={data.team.type} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailRow
                    label="Mentor"
                    value={
                      data.team.mentor
                        ? `${data.team.mentor.firstName || ""} ${
                            data.team.mentor.lastName || ""
                          }`.trim()
                        : null
                    }
                  />
                  <DetailRow
                    label="Assistant Mentor"
                    value={
                      data.team.assistantMentor
                        ? `${data.team.assistantMentor.firstName || ""} ${
                            data.team.assistantMentor.lastName || ""
                          }`.trim()
                        : null
                    }
                  />
                </Grid>
              </Grid>
              {data.team.members && data.team.members.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: COLORS.TEXT_SECONDARY,
                      fontWeight: 600,
                      display: "block",
                      mb: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Members
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ flexWrap: "wrap" }}
                    useFlexGap
                  >
                    {data.team.members.map((m: any) =>
                      m.student ? (
                        <Chip
                          key={m.id}
                          label={`${m.student.firstName || ""} ${
                            m.student.lastName || ""
                          }`.trim()}
                          size="small"
                          sx={{ mb: 1 }}
                        />
                      ) : null,
                    )}
                  </Stack>
                </Box>
              )}
            </Card>
          )}

          {data.school && (
            <Card
              sx={{
                p: 4,
                mt: 4,
                borderRadius: "16px",
                border: `1px solid ${COLORS.GLASS_BORDER}`,
                boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: roboto.style.fontFamily,
                  fontWeight: 700,
                  mb: 3,
                  color: COLORS.PRIMARY_NAVY,
                }}
              >
                School Details
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailRow label="School Name" value={data.school.name} />
                  <DetailRow
                    label="Address"
                    value={[
                      data.school.addressLine1,
                      data.school.addressLine2,
                      data.school.city,
                      data.school.state,
                      data.school.zipCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  />
                  <DetailRow label="Board" value={data.school.board?.name} />
                  <DetailRow
                    label="Country"
                    value={data.school.country?.name}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailRow
                    label="Contact Person"
                    value={data.school.contactPersonName}
                  />
                  <DetailRow
                    label="Contact Email"
                    value={data.school.contactPersonEmail}
                  />
                  <DetailRow
                    label="Contact Phone"
                    value={data.school.contactPersonPhone}
                  />
                  <DetailRow
                    label="Affiliation Number"
                    value={data.school.affiliationNumber}
                  />
                </Grid>
              </Grid>
            </Card>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={4}>
            <Card
              sx={{
                p: 3,
                borderRadius: "16px",
                border: `1px solid ${COLORS.GLASS_BORDER}`,
                boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: roboto.style.fontFamily,
                  fontWeight: 700,
                  mb: 3,
                  color: COLORS.PRIMARY_NAVY,
                }}
              >
                Submission Details
              </Typography>

              <Stack spacing={2.5}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: COLORS.TEXT_SECONDARY,
                      fontWeight: 600,
                      display: "block",
                      mb: 0.5,
                    }}
                  >
                    SUBMITTED BY
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: montserrat.style.fontFamily,
                      fontWeight: 600,
                      color: COLORS.TEXT_PRIMARY,
                    }}
                  >
                    {data.teamId
                      ? `Team: ${data.team?.title || "N/A"}`
                      : `${data.creator?.firstName || ""} ${data.creator?.lastName || ""}`.trim() ||
                        data.creator?.fullName ||
                        "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: COLORS.TEXT_SECONDARY,
                      fontWeight: 600,
                      display: "block",
                      mb: 0.5,
                    }}
                  >
                    SCHOOL
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: montserrat.style.fontFamily,
                      fontWeight: 600,
                      color: COLORS.TEXT_PRIMARY,
                      textTransform: "capitalize",
                    }}
                  >
                    {data.school?.name || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: COLORS.TEXT_SECONDARY,
                      fontWeight: 600,
                      display: "block",
                      mb: 0.5,
                    }}
                  >
                    DATE ADDED
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: montserrat.style.fontFamily,
                      fontWeight: 600,
                      color: COLORS.TEXT_PRIMARY,
                    }}
                  >
                    {data.createdAt
                      ? moment(data.createdAt).format("DD MMM YYYY, hh:mm A")
                      : "N/A"}
                  </Typography>
                </Box>
              </Stack>
            </Card>

            {data.creator && (
              <Card
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  border: `1px solid ${COLORS.GLASS_BORDER}`,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: roboto.style.fontFamily,
                    fontWeight: 700,
                    mb: 3,
                    color: COLORS.PRIMARY_NAVY,
                  }}
                >
                  Creator Details
                </Typography>
                <Stack spacing={0}>
                  <DetailRow
                    label="Name"
                    value={
                      data.creator.fullName ||
                      `${data.creator.firstName || ""} ${
                        data.creator.lastName || ""
                      }`.trim() ||
                      data.creator.username
                    }
                  />
                  <DetailRow label="Email" value={data.creator.email} />
                  <DetailRow label="Phone" value={data.creator.phone} />
                  <DetailRow label="Role" value={data.creator.role} />
                  <DetailRow
                    label="Membership Tier"
                    value={data.creator.membershipTier}
                  />
                  <DetailRow
                    label="Membership Code"
                    value={data.creator.membershipCode}
                  />
                </Stack>
              </Card>
            )}

            <Card
              sx={{
                p: 3,
                borderRadius: "16px",
                border: `1px solid ${COLORS.GLASS_BORDER}`,
                boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: roboto.style.fontFamily,
                  fontWeight: 700,
                  mb: 3,
                  color: COLORS.PRIMARY_NAVY,
                }}
              >
                Additional Information
              </Typography>
              <Stack spacing={0}>
                <DetailRow label="Display ID" value={data.displayId} />
                <DetailRow
                  label="Created By Teacher"
                  value={data.isCreatedByTeacher ? "Yes" : "No"}
                />
                <DetailRow
                  label="Created For India"
                  value={data.isCreatedForIndia ? "Yes" : "No"}
                />
                <DetailRow
                  label="Created For USA"
                  value={data.isCreatedForUSA ? "Yes" : "No"}
                />
                <DetailRow
                  label="Draft Status"
                  value={data.isDraft ? "Draft" : "Final"}
                />
                <DetailRow
                  label="Updated At"
                  value={
                    data.updatedAt
                      ? moment(data.updatedAt).format("DD MMM YYYY, hh:mm A")
                      : null
                  }
                />
                <DetailRow
                  label="Granted At"
                  value={
                    data.grantedAt
                      ? moment(data.grantedAt).format("DD MMM YYYY, hh:mm A")
                      : null
                  }
                />
              </Stack>
            </Card>

            {data.attorneyTemplateDownloadUrl && (
              <Card
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  border: `1px solid ${COLORS.GLASS_BORDER}`,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: roboto.style.fontFamily,
                    fontWeight: 700,
                    mb: 2,
                    color: COLORS.PRIMARY_NAVY,
                  }}
                >
                  Attorney Template
                </Typography>
                <Box
                  sx={{
                    p: 1.5,
                    border: `1px solid ${COLORS.GLASS_BORDER}`,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: montserrat.style.fontFamily,
                      color: COLORS.INFO,
                      fontWeight: 600,
                      "&:hover": {
                        textDecoration: "underline",
                        cursor: "pointer",
                      },
                    }}
                    onClick={() =>
                      window.open(data.attorneyTemplateDownloadUrl, "_blank")
                    }
                  >
                    Download Final Template
                  </Typography>
                </Box>
              </Card>
            )}

            {data.attachments && data.attachments.length > 0 && (
              <Card
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  border: `1px solid ${COLORS.GLASS_BORDER}`,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: roboto.style.fontFamily,
                    fontWeight: 700,
                    mb: 2,
                    color: COLORS.PRIMARY_NAVY,
                  }}
                >
                  Attachments
                </Typography>
                <Stack spacing={1}>
                  {data.attachments.map((file: any, index: number) => (
                    <Box
                      key={index}
                      sx={{
                        p: 1.5,
                        border: `1px solid ${COLORS.GLASS_BORDER}`,
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: montserrat.style.fontFamily,
                          color: COLORS.INFO,
                          fontWeight: 600,
                          "&:hover": {
                            textDecoration: "underline",
                            cursor: "pointer",
                          },
                        }}
                        onClick={() => window.open(file.url, "_blank")}
                      >
                        {file.fileName || `Attachment ${index + 1}`}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Card>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InnovationDetails;
