import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import {
  CalendarMonth,
  Info,
  Laptop,
  People,
  QuestionAnswer,
  School,
} from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";
import { Batch } from "@/utils/type";
import moment from "moment";

const FS = { fontFamily: poppins.style.fontFamily };

interface BatchDetailsDialogProps {
  open: boolean;
  record: Batch | null;
  onClose: () => void;
}

const BatchDetailsDialog = ({
  open,
  record,
  onClose,
}: BatchDetailsDialogProps) => (
  <Dialog
    fullWidth
    maxWidth="md"
    open={open}
    onClose={onClose}
    slotProps={{
      paper: { sx: { borderRadius: "28px", p: 0, overflow: "hidden" } },
      backdrop: {
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(8px)",
        },
      },
    }}
  >
    {record && (
      <Box>
        {/* Header Banner */}
        <Box sx={{ p: 4, bgcolor: COLORS.PRIMARY_NAVY, color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                borderRadius: "16px",
              }}
            >
              <People sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography sx={{ ...FS, fontSize: 22, fontWeight: 800 }}>
                {record.name || "Unnamed Batch"}
              </Typography>
              <Typography
                sx={{
                  ...FS,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.8)",
                  mt: 0.5,
                }}
              >
                Category: {record.category} • Attendees:{" "}
                {record.userRole === "TEACHER"
                  ? "Mentor / Teacher"
                  : record.userRole}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                sx={{
                  ...FS,
                  fontSize: 15,
                  fontWeight: 800,
                  mb: 2,
                  color: COLORS.PRIMARY_NAVY,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Info sx={{ fontSize: 18 }} /> Core Configuration
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: "16px",
                  bgcolor: "rgba(0,0,0,0.01)",
                }}
              >
                <Stack spacing={2}>
                  {/* Timeline */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <CalendarMonth
                      sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }}
                    />
                    <Box>
                      <Typography
                        sx={{
                          ...FS,
                          fontSize: 10,
                          color: COLORS.TEXT_SECONDARY,
                        }}
                      >
                        Timeline Dates
                      </Typography>
                      <Typography sx={{ ...FS, fontSize: 13, fontWeight: 600 }}>
                        {moment(record.startDate).format("MMM DD, YYYY")} –{" "}
                        {moment(record.endDate).format("MMM DD, YYYY")}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Laptop
                      sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }}
                    />
                    <Box>
                      <Typography
                        sx={{
                          ...FS,
                          fontSize: 10,
                          color: COLORS.TEXT_SECONDARY,
                        }}
                      >
                        Training Mode
                      </Typography>
                      <Typography
                        sx={{
                          ...FS,
                          fontSize: 13,
                          fontWeight: 600,
                          textTransform: "capitalize",
                        }}
                      >
                        {(record as any).mode || "Standard Online / Classroom"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* User role */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <School
                      sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }}
                    />
                    <Box>
                      <Typography
                        sx={{
                          ...FS,
                          fontSize: 10,
                          color: COLORS.TEXT_SECONDARY,
                        }}
                      >
                        Attendees / User Role
                      </Typography>
                      <Typography sx={{ ...FS, fontSize: 13, fontWeight: 600 }}>
                        {record.userRole}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Paper>

              {(record as any).description && (
                <Box sx={{ mt: 3 }}>
                  <Typography
                    sx={{
                      ...FS,
                      fontSize: 14,
                      fontWeight: 800,
                      color: COLORS.PRIMARY_NAVY,
                      mb: 1.5,
                    }}
                  >
                    Batch Description
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2.5,
                      borderRadius: "16px",
                      bgcolor: "rgba(0,0,0,0.01)",
                    }}
                  >
                    <Typography
                      sx={{
                        ...FS,
                        fontSize: 13,
                        color: COLORS.TEXT_PRIMARY,
                        lineHeight: 1.6,
                      }}
                    >
                      {(record as any).description}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                sx={{
                  ...FS,
                  fontSize: 15,
                  fontWeight: 800,
                  mb: 2,
                  color: COLORS.PRIMARY_NAVY,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <QuestionAnswer sx={{ fontSize: 18 }} /> Evaluation Questions
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: "16px",
                  bgcolor: "rgba(0,0,0,0.01)",
                  maxHeight: 320,
                  overflowY: "auto",
                }}
              >
                {(record as any).questions?.length > 0 ? (
                  <Stack spacing={2}>
                    {(record as any).questions.map((q: any, idx: number) => (
                      <Box
                        key={q.id || idx}
                        sx={{
                          p: 1.5,
                          bgcolor: COLORS.WHITE,
                          borderRadius: "8px",
                          border: "1px solid rgba(0,0,0,0.04)",
                        }}
                      >
                        <Typography
                          sx={{
                            ...FS,
                            fontSize: 13,
                            fontWeight: 700,
                            color: COLORS.TEXT_PRIMARY,
                          }}
                        >
                          Q{idx + 1}: {q.question}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Chip
                            label={q.type || "Text Input"}
                            size="small"
                            sx={{
                              bgcolor: "rgba(0,0,0,0.04)",
                              fontSize: 9,
                              height: 18,
                              fontWeight: 600,
                            }}
                          />
                          {q.required && (
                            <Chip
                              label="Required"
                              size="small"
                              sx={{
                                bgcolor: alpha(COLORS.ERROR, 0.05),
                                color: COLORS.ERROR,
                                border: `1px solid ${alpha(COLORS.ERROR, 0.2)}`,
                                fontSize: 9,
                                height: 18,
                                fontWeight: 600,
                              }}
                            />
                          )}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Stack
                    sx={{
                      py: 4,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    spacing={1}
                  >
                    <QuestionAnswer
                      sx={{
                        fontSize: 32,
                        color: alpha(COLORS.PRIMARY_NAVY, 0.15),
                      }}
                    />
                    <Typography
                      sx={{
                        ...FS,
                        fontSize: 13,
                        color: COLORS.TEXT_SECONDARY,
                        textAlign: "center",
                      }}
                    >
                      No admission or evaluation questions configured.
                    </Typography>
                  </Stack>
                )}
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderStyle: "dashed" }} />

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                px: 4,
                color: COLORS.TEXT_SECONDARY,
                borderColor: "rgba(0,0,0,0.1)",
              }}
            >
              Close details
            </Button>
          </Box>
        </Box>
      </Box>
    )}
  </Dialog>
);

export default BatchDetailsDialog;
