"use client";
import React, { useEffect, useState, forwardRef } from "react";
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Skeleton,
  IconButton,
  Tooltip,
  Stack,
  Tabs,
  Tab,
  Dialog,
  DialogContent,
  Slide,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";
import {
  Search,
  Visibility,
  Groups,
  Close,
  Person,
  School,
  Email,
  Phone,
  Article,
} from "@mui/icons-material";
import { poppins, outfit } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";
import { useResearch } from "@/hooks/common/useResearch";
import { ResearchSubmission } from "@/utils/type";
import dayjs from "dayjs";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FS = { fontFamily: poppins.style.fontFamily };

const getCreatorName = (creator: any) => {
  if (!creator) return "N/A";
  if (creator.fullName?.trim()) return creator.fullName;
  const combined = `${creator.firstName || ""} ${creator.lastName || ""}`.trim();
  return combined || creator.username || "N/A";
};

const getFormattedPhone = (creator: any) => {
  if (!creator?.phone) return "N/A";
  const phone = creator.phone.trim();
  const code = creator.countryCode?.trim() || "";
  
  if (phone.startsWith("+")) {
    return phone;
  }
  
  if (code && phone.startsWith(code.replace("+", ""))) {
    return `+${phone}`;
  }
  
  return code ? `${code} ${phone}` : phone;
};

const ResearchManagement = () => {
  const { researchData, loading, updatingStatus, pagination, fetchResearchData, updateStatus } = useResearch();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState<ResearchSubmission | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Debounced search effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchResearchData(searchQuery, page + 1, rowsPerPage, activeTab);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, page, rowsPerPage, activeTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    setPage(0);
  };

  const filteredData = researchData || [];

  const getStatusTextColor = (status: string) => {
    const s = status || "PENDING";
    switch (s.toUpperCase()) {
      case "PUBLISHED":
        return COLORS.SUCCESS;
      case "NOT_PUBLISHED":
        return COLORS.ERROR;
      case "ARCHIVED":
        return "#64748B";
      case "PENDING":
      default:
        return COLORS.WARNING;
    }
  };

  const getStatusBgColor = (status: string) => {
    return alpha(getStatusTextColor(status), 0.08);
  };

  const getStatusBorderColor = (status: string) => {
    return alpha(getStatusTextColor(status), 0.25);
  };

  const handleRowClick = (item: ResearchSubmission) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  return (
    <Box>
      {/* Overview Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 4,
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
            Research Management
          </Typography>
        </Box>
      </Box>

      {/* Main Table Card Container */}
      <Card
        sx={{
          p: 0,
          borderRadius: "24px",
          boxShadow: "0px 15px 35px rgba(0,0,0,0.04)",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.03)",
        }}
      >
        {/* Search and tabs header */}
        <Box sx={{ p: 3, display: "flex", gap: 2, flexDirection: "column", bgcolor: "#FFFFFF" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <TextField
              placeholder="Search submissions..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: COLORS.TEXT_SECONDARY }} />
                    </InputAdornment>
                  ),
                  style: { borderRadius: "10px", fontFamily: poppins.style.fontFamily },
                },
              }}
              sx={{ width: { xs: "100%", sm: 300 } }}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
            <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: COLORS.PRIMARY_NAVY,
                height: 3,
                borderRadius: "3px",
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: poppins.style.fontFamily,
                minWidth: "auto",
                px: 2.5,
                py: 1.5,
                color: "#64748B",
                "&.Mui-selected": {
                  color: COLORS.PRIMARY_NAVY,
                },
              },
            }}
          >
            <Tab label="All Submissions" value="ALL" />
            <Tab label="Pending Review" value="PENDING" />
            <Tab label="Published" value="PUBLISHED" />
              <Tab label="Not Published" value="NOT_PUBLISHED" />
              <Tab label="Archived" value="ARCHIVED" />
            </Tabs>
            
            <Typography sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY, fontWeight: 500, display: { xs: "none", md: "block" } }}>
              Total: <strong style={{ color: COLORS.PRIMARY_NAVY }}>{pagination?.total || 0}</strong> Submissions
            </Typography>
          </Box>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 900 }}>
            <TableHead sx={{ backgroundColor: "rgba(1, 90, 80, 0.02)" }}>
              <TableRow>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY, pl: 4, width: "42%" }}>
                  Research Details
                </TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>
                  Creator / Student
                </TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>
                  Team & Info
                </TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>
                  Date Submitted
                </TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>
                  Status
                </TableCell>
                <TableCell align="right" sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY, pr: 4 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ pl: 4 }}>
                      <Skeleton width="80%" height="24px" />
                      <Skeleton width="95%" height="16px" sx={{ mt: 0.5 }} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <Skeleton variant="circular" width={32} height={32} />
                        <Box>
                          <Skeleton width="100px" height="18px" />
                          <Skeleton width="80px" height="12px" sx={{ mt: 0.5 }} />
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Skeleton width="120px" height="20px" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="100px" height="20px" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="80px" height="24px" sx={{ borderRadius: "6px" }} />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 4 }}>
                      <Skeleton variant="circular" width={30} height={30} sx={{ ml: "auto" }} />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Stack spacing={1} sx={{ alignItems: "center", justifyContent: "center" }}>
                      <Article sx={{ fontSize: 48, color: alpha(COLORS.PRIMARY_NAVY, 0.2), mb: 1 }} />
                      <Typography sx={{ ...FS, fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>
                        No Submissions Found
                      </Typography>
                      <Typography sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY }}>
                        No records match the selected status or search filter.
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    onClick={() => handleRowClick(row)}
                    sx={{
                      cursor: "pointer",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    {/* Proposal Details */}
                    <TableCell sx={{ pl: 4 }}>
                      <Typography sx={{ ...FS, fontWeight: 700, color: COLORS.TEXT_PRIMARY, fontSize: 14 }}>
                        {row.title}
                      </Typography>
                      <Typography
                        sx={{
                          ...FS,
                          fontSize: 12,
                          color: COLORS.TEXT_SECONDARY,
                          mt: 0.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "480px",
                          lineHeight: 1.4,
                        }}
                      >
                        {row.description}
                      </Typography>
                      <Box sx={{ display: "flex", mt: 1 }}>
                        <Chip
                          label={row.topic}
                          size="small"
                          sx={{
                            ...FS,
                            fontSize: 10,
                            fontWeight: 600,
                            bgcolor: "rgba(1, 90, 80, 0.05)",
                            color: COLORS.PRIMARY_NAVY,
                            borderRadius: "4px",
                            height: 20,
                          }}
                        />
                      </Box>
                    </TableCell>

                    {/* Student Creator */}
                    <TableCell>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <Avatar
                          src={row.creator?.profileImageDownloadUrl || row.creator?.profileImage || ""}
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: alpha(COLORS.PRIMARY_NAVY, 0.1),
                            color: COLORS.PRIMARY_NAVY,
                          }}
                        >
                          <Person sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Box>
                          <Typography sx={{ ...FS, fontWeight: 600, fontSize: 13, color: COLORS.TEXT_PRIMARY }}>
                            {getCreatorName(row.creator)}
                          </Typography>
                          <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                            {row.creator?.email || "No email"}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* Team & Info */}
                    <TableCell>
                      {row.team ? (
                        <Box>
                          <Typography sx={{ ...FS, fontWeight: 600, fontSize: 13, color: COLORS.TEXT_PRIMARY }}>
                            {row.team.title}
                          </Typography>
                          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", mt: 0.25 }}>
                            <Groups sx={{ fontSize: 13, color: COLORS.TEXT_SECONDARY }} />
                            <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                              {row.team.teamCode}
                            </Typography>
                          </Stack>
                        </Box>
                      ) : (
                        <Typography sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY, fontStyle: "italic" }}>
                          Independent
                        </Typography>
                      )}
                    </TableCell>

                    {/* Date Submitted */}
                    <TableCell sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY }}>
                      {dayjs(row.createdAt).format("MMM DD, YYYY")}
                    </TableCell>

                    {/* Status Dropdown Select */}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={row.status || "PENDING"}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          await updateStatus(row.id, newStatus);
                        }}
                        disabled={updatingStatus}
                        sx={{
                          height: 32,
                          borderRadius: "8px",
                          ...FS,
                          fontSize: 11,
                          fontWeight: 700,
                          bgcolor: getStatusBgColor(row.status),
                          color: getStatusTextColor(row.status),
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: getStatusBorderColor(row.status),
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: getStatusTextColor(row.status),
                          },
                          "& .MuiSvgIcon-root": {
                            color: getStatusTextColor(row.status),
                          },
                        }}
                      >
                        <MenuItem value="PENDING" sx={{ ...FS, fontSize: 13, color: COLORS.WARNING, fontWeight: 600 }}>
                          Pending Review
                        </MenuItem>
                        <MenuItem value="PUBLISHED" sx={{ ...FS, fontSize: 13, color: COLORS.SUCCESS, fontWeight: 600 }}>
                          Published
                        </MenuItem>
                        <MenuItem value="NOT_PUBLISHED" sx={{ ...FS, fontSize: 13, color: COLORS.ERROR, fontWeight: 600 }}>
                          Not Published
                        </MenuItem>
                        <MenuItem value="ARCHIVED" sx={{ ...FS, fontSize: 13, color: "#64748B", fontWeight: 600 }}>
                          Archived
                        </MenuItem>
                      </Select>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right" sx={{ pr: 4 }} onClick={(e) => e.stopPropagation()}>
                      <IconButton
                        onClick={() => handleRowClick(row)}
                        sx={{
                          bgcolor: "rgba(0,0,0,0.03)",
                          "&:hover": { bgcolor: "rgba(0,0,0,0.08)" },
                        }}
                      >
                        <Visibility sx={{ color: COLORS.PRIMARY_NAVY, fontSize: 18 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pagination?.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{
            borderTop: "1px solid rgba(0,0,0,0.05)",
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
              fontFamily: poppins.style.fontFamily,
              margin: 0,
            }
          }}
        />
      </Card>

      {/* Submission Detail Modal Dialog */}
      {selectedItem && (
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          slots={{ transition: Transition }}
          maxWidth="md"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                borderRadius: "20px",
                p: 1,
                overflow: "hidden",
              },
            },
          }}
        >
          {/* Header section with Close Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              p: 3,
              pb: 2,
            }}
          >
            <Stack spacing={1} sx={{ width: "90%" }}>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <Chip
                  label={selectedItem.topic}
                  size="small"
                  sx={{
                    ...FS,
                    bgcolor: alpha(COLORS.PRIMARY_NAVY, 0.08),
                    color: COLORS.PRIMARY_NAVY,
                    fontWeight: 700,
                    fontSize: "11px",
                  }}
                />
                <Chip
                  label={selectedItem.status}
                  size="small"
                  sx={{
                    ...FS,
                    fontWeight: 700,
                    fontSize: 10,
                    height: 24,
                    bgcolor: getStatusBgColor(selectedItem.status),
                    color: getStatusTextColor(selectedItem.status),
                    border: `1px solid ${getStatusBorderColor(selectedItem.status)}`,
                    borderRadius: "6px",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: outfit.style.fontFamily,
                  fontWeight: 800,
                  fontSize: "22px",
                  color: COLORS.TEXT_PRIMARY,
                  lineHeight: 1.3,
                  mt: 1,
                }}
              >
                {selectedItem.title}
              </Typography>
            </Stack>
            <IconButton
              onClick={() => setDialogOpen(false)}
              sx={{
                bgcolor: "#F1F5F9",
                color: "#64748B",
                "&:hover": { bgcolor: "#E2E8F0" },
              }}
            >
              <Close sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          <DialogContent sx={{ p: 3, pt: 1, pb: 4 }}>
            <Grid container spacing={4}>
              {/* Left Column: Full Study Details */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Typography
                  sx={{
                    fontFamily: outfit.style.fontFamily,
                    fontWeight: 700,
                    fontSize: "15px",
                    color: COLORS.TEXT_PRIMARY,
                    mb: 1.5,
                  }}
                >
                  Abstract & Description
                </Typography>
                <Typography
                  sx={{
                    ...FS,
                    color: COLORS.TEXT_SECONDARY,
                    fontSize: "14px",
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                  }}
                >
                  {selectedItem.description}
                </Typography>
              </Grid>

              {/* Right Column: Author & Team Info Cards */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Stack spacing={3}>
                  {/* Author Card */}
                  <Card
                    sx={{
                      p: 2.5,
                      borderRadius: "16px",
                      border: "1px solid rgba(0, 0, 0, 0.04)",
                      boxShadow: "none",
                      bgcolor: "#F8FAFC",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: outfit.style.fontFamily,
                        fontWeight: 700,
                        fontSize: "14px",
                        color: COLORS.PRIMARY_NAVY,
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Person sx={{ fontSize: 18 }} /> Submitter Information
                    </Typography>

                    <Stack spacing={2}>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <Avatar
                          src={selectedItem.creator?.profileImageDownloadUrl || selectedItem.creator?.profileImage || ""}
                          sx={{
                            width: 38,
                            height: 38,
                            bgcolor: alpha(COLORS.PRIMARY_NAVY, 0.1),
                            color: COLORS.PRIMARY_NAVY,
                          }}
                        >
                          <Person sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Box>
                          <Typography sx={{ ...FS, fontSize: "13px", fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>
                            {getCreatorName(selectedItem.creator)}
                          </Typography>
                          <Typography sx={{ ...FS, fontSize: "11px", color: COLORS.TEXT_SECONDARY }}>
                            {selectedItem.creator?.role?.replace("_", " ")}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack spacing={1.2} sx={{ pt: 1.5, borderTop: "1px solid rgba(0,0,0,0.04)" }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                          <Email sx={{ fontSize: 15, color: COLORS.TEXT_SECONDARY }} />
                          <Typography sx={{ ...FS, fontSize: "12px", color: COLORS.TEXT_SECONDARY }}>
                            {selectedItem.creator?.email}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                          <Phone sx={{ fontSize: 15, color: COLORS.TEXT_SECONDARY }} />
                          <Typography sx={{ ...FS, fontSize: "12px", color: COLORS.TEXT_SECONDARY }}>
                            {getFormattedPhone(selectedItem.creator)}
                          </Typography>
                        </Stack>
                        {selectedItem.creator?.grade && (
                          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                            <School sx={{ fontSize: 15, color: COLORS.TEXT_SECONDARY }} />
                            <Typography sx={{ ...FS, fontSize: "12px", color: COLORS.TEXT_SECONDARY }}>
                              Grade {selectedItem.creator.grade}
                            </Typography>
                          </Stack>
                        )}
                        {selectedItem.creator?.state && (
                          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                            <School sx={{ fontSize: 15, color: COLORS.TEXT_SECONDARY }} />
                            <Typography sx={{ ...FS, fontSize: "12px", color: COLORS.TEXT_SECONDARY }}>
                              {selectedItem.creator.state}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>

                      {/* Parent / Guardian Details */}
                      {(selectedItem.creator?.fatherName || selectedItem.creator?.motherName) && (
                        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "1px solid rgba(0,0,0,0.04)" }}>
                          <Typography
                            sx={{
                              fontFamily: outfit.style.fontFamily,
                              fontWeight: 700,
                              fontSize: "11px",
                              color: COLORS.PRIMARY_NAVY,
                              mb: 1.5,
                              textTransform: "uppercase",
                              letterSpacing: 0.5,
                            }}
                          >
                            Parent / Guardian Details
                          </Typography>
                          <Grid container spacing={1.5}>
                            {selectedItem.creator?.fatherName && (
                              <Grid size={{ xs: 12 }}>
                                <Typography sx={{ ...FS, fontSize: "12px", color: COLORS.TEXT_PRIMARY, fontWeight: 600 }}>
                                  Father: {selectedItem.creator.fatherName}
                                </Typography>
                                {selectedItem.creator.fatherProfession && (
                                  <Typography sx={{ ...FS, fontSize: "11px", color: COLORS.TEXT_SECONDARY, pl: 2 }}>
                                    Profession: {selectedItem.creator.fatherProfession}
                                  </Typography>
                                )}
                                {(selectedItem.creator.fatherPhone || selectedItem.creator.fatherEmail) && (
                                  <Typography sx={{ ...FS, fontSize: "11px", color: COLORS.TEXT_SECONDARY, pl: 2 }}>
                                    Contact: {[selectedItem.creator.fatherPhone, selectedItem.creator.fatherEmail].filter(Boolean).join(" | ")}
                                  </Typography>
                                )}
                              </Grid>
                            )}
                            {selectedItem.creator?.motherName && (
                              <Grid size={{ xs: 12 }}>
                                <Typography sx={{ ...FS, fontSize: "12px", color: COLORS.TEXT_PRIMARY, fontWeight: 600, mt: selectedItem.creator?.fatherName ? 1 : 0 }}>
                                  Mother: {selectedItem.creator.motherName}
                                </Typography>
                                {selectedItem.creator.motherProfession && (
                                  <Typography sx={{ ...FS, fontSize: "11px", color: COLORS.TEXT_SECONDARY, pl: 2 }}>
                                    Profession: {selectedItem.creator.motherProfession}
                                  </Typography>
                                )}
                                {(selectedItem.creator.motherPhone || selectedItem.creator.motherEmail) && (
                                  <Typography sx={{ ...FS, fontSize: "11px", color: COLORS.TEXT_SECONDARY, pl: 2 }}>
                                    Contact: {[selectedItem.creator.motherPhone, selectedItem.creator.motherEmail].filter(Boolean).join(" | ")}
                                  </Typography>
                                )}
                              </Grid>
                            )}
                          </Grid>
                        </Box>
                      )}
                    </Stack>
                  </Card>

                  {/* Team Card */}
                  {selectedItem.team && (
                    <Card
                      sx={{
                        p: 2.5,
                        borderRadius: "16px",
                        border: "1px solid rgba(0, 0, 0, 0.04)",
                        boxShadow: "none",
                        bgcolor: "#F8FAFC",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: outfit.style.fontFamily,
                          fontWeight: 700,
                          fontSize: "14px",
                          color: COLORS.PRIMARY_NAVY,
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Groups sx={{ fontSize: 18 }} /> Team Affiliation
                      </Typography>

                      <Stack spacing={1.5}>
                        <Box>
                          <Typography sx={{ ...FS, fontSize: "13px", fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>
                            {selectedItem.team.title}
                          </Typography>
                          <Typography sx={{ ...FS, fontSize: "11px", color: COLORS.TEXT_SECONDARY, mt: 0.25 }}>
                            Team Code: {selectedItem.team.teamCode}
                          </Typography>
                        </Box>
                      </Stack>
                    </Card>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default ResearchManagement;
