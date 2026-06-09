"use client";

import { useInnovations } from "@/hooks/common/useInnovations";
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Tab,
  Tabs,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Skeleton,
  InputBase,
  Avatar,
  Stack,
  alpha,
  IconButton,
  Menu,
  MenuItem,
  Select,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  CircularProgress,
  Grid,
} from "@mui/material";
import {
  Close,
  Search,
  RocketLaunch,
  Person,
  People,
  MoreVert,
  Visibility,
  Email,
  Phone,
  Info,
  School as SchoolIcon,
  Work,
  Attachment,
  LocationOn,
  Description,
} from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";
import dayjs from "dayjs";

// Types
import { INNOVATION_RESPONSE_DATA_PROPS } from "@/utils/type";

const FS = { fontFamily: poppins.style.fontFamily };

const STATUS_TABS = [
  { label: "All Proposals", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Patent Pending", value: "PATENT_PENDING" },
  { label: "Patent Granted", value: "PATENT_GRANTED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Archived", value: "ARCHIVED" },
];

const InnovationList = () => {
  const {
    innovationData,
    innovationDetails,
    loading,
    loadingDetails,
    updatingStatus,
    fetchData,
    fetchDetails,
    updateStatus,
    setInnovationDetails,
  } = useInnovations();

  const [activeTab, setActiveTab] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeRecord, setActiveRecord] = useState<INNOVATION_RESPONSE_DATA_PROPS | null>(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [commentTargetId, setCommentTargetId] = useState<number | null>(null);
  const [rejectionComment, setRejectionComment] = useState("");
  const [updatingRowId, setUpdatingRowId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchData(value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, record: INNOVATION_RESPONSE_DATA_PROPS) => {
    setAnchorEl(event.currentTarget);
    setActiveRecord(record);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveRecord(null);
  };

  const handleViewDetails = async () => {
    if (activeRecord) {
      const recordId = activeRecord.id;
      handleMenuClose();
      setOpenDetailsModal(true);
      await fetchDetails(recordId);
    }
  };

  // Filter local records by status (if tab is not ALL)
  const filteredData = (innovationData || []).filter((item: INNOVATION_RESPONSE_DATA_PROPS) => {
    if (activeTab === "ALL") return true;
    return item.status === activeTab;
  });

  const getStatusChip = (status: string) => {
    const s = status || "DRAFT";
    switch (s) {
      case "PATENT_GRANTED":
        return (
          <Chip
            label="Patent Granted"
            size="small"
            sx={{
              ...FS,
              fontWeight: 700,
              fontSize: 10,
              height: 24,
              bgcolor: alpha(COLORS.SUCCESS, 0.1),
              color: COLORS.SUCCESS,
              border: `1px solid ${COLORS.SUCCESS}`,
              borderRadius: "6px",
            }}
          />
        );
      case "PENDING":
        return (
          <Chip
            label="Pending Review"
            size="small"
            sx={{
              ...FS,
              fontWeight: 700,
              fontSize: 10,
              height: 24,
              bgcolor: alpha(COLORS.WARNING, 0.1),
              color: COLORS.WARNING,
              border: `1px solid ${COLORS.WARNING}`,
              borderRadius: "6px",
            }}
          />
        );
      case "PATENT_PENDING":
        return (
          <Chip
            label="Patent Pending"
            size="small"
            sx={{
              ...FS,
              fontWeight: 700,
              fontSize: 10,
              height: 24,
              bgcolor: alpha(COLORS.INFO, 0.1),
              color: COLORS.INFO,
              border: `1px solid ${COLORS.INFO}`,
              borderRadius: "6px",
            }}
          />
        );
      case "REJECTED":
        return (
          <Chip
            label="Rejected"
            size="small"
            sx={{
              ...FS,
              fontWeight: 700,
              fontSize: 10,
              height: 24,
              bgcolor: alpha(COLORS.ERROR, 0.1),
              color: COLORS.ERROR,
              border: `1px solid ${COLORS.ERROR}`,
              borderRadius: "6px",
            }}
          />
        );
      case "ARCHIVED":
        return (
          <Chip
            label="Archived"
            size="small"
            sx={{
              ...FS,
              fontWeight: 700,
              fontSize: 10,
              height: 24,
              bgcolor: "rgba(0,0,0,0.05)",
              color: COLORS.TEXT_SECONDARY,
              borderRadius: "6px",
            }}
          />
        );
      default:
        const label = s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        return (
          <Chip
            label={label}
            size="small"
            sx={{
              ...FS,
              fontWeight: 700,
              fontSize: 10,
              height: 24,
              bgcolor: "rgba(0,0,0,0.05)",
              color: COLORS.TEXT_SECONDARY,
              borderRadius: "6px",
            }}
          />
        );
    }
  };

  const getStatusTextColor = (status: string) => {
    const s = status || "DRAFT";
    switch (s) {
      case "PATENT_GRANTED": return COLORS.SUCCESS;
      case "PENDING": return COLORS.WARNING;
      case "PATENT_PENDING": return COLORS.INFO;
      case "REJECTED": return COLORS.ERROR;
      default: return COLORS.TEXT_SECONDARY;
    }
  };

  const getStatusBgColor = (status: string) => {
    return alpha(getStatusTextColor(status), 0.1);
  };

  const getStatusBorderColor = (status: string) => {
    return alpha(getStatusTextColor(status), 0.4);
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Welcome & Overview Header */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2 }}>
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
            Innovation Management
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: poppins.style.fontFamily,
              color: COLORS.TEXT_SECONDARY,
              mt: 0.5,
            }}
          >
            Review and evaluate student startup proposals and intellectual property.
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: COLORS.INPUT_BG,
            borderRadius: "14px",
            px: 2,
            py: 0.8,
            width: { xs: "100%", sm: "320px" },
            border: "1px solid rgba(0,0,0,0.03)",
          }}
        >
          <Search sx={{ color: COLORS.TEXT_SECONDARY, mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="Search by country or term..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              fontFamily: poppins.style.fontFamily,
              fontSize: "0.9rem",
              width: "100%",
            }}
          />
        </Box>
      </Box>

      {/* Tabs & Table Card */}
      <Card
        sx={{
          borderRadius: "28px",
          boxShadow: "0px 15px 50px rgba(0,0,0,0.02)",
          border: "1px solid rgba(0,0,0,0.04)",
          bgcolor: COLORS.WHITE,
          overflow: "hidden",
        }}
      >
        <Box sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)", px: 3, pt: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "3px 3px 0 0",
                bgcolor: COLORS.PRIMARY_NAVY,
              },
              "& .MuiTab-root": {
                ...FS,
                textTransform: "none",
                fontSize: 14,
                fontWeight: 600,
                minWidth: 100,
                color: COLORS.TEXT_SECONDARY,
                py: 2,
                "&.Mui-selected": {
                  color: COLORS.PRIMARY_NAVY,
                },
              },
            }}
          >
            {STATUS_TABS.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
          
          <Typography sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY, fontWeight: 500, display: { xs: "none", md: "block" } }}>
            Total: <strong style={{ color: COLORS.PRIMARY_NAVY }}>{filteredData.length}</strong> Submissions
          </Typography>
        </Box>

        <TableContainer sx={{ minWidth: 900 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "rgba(1, 90, 80, 0.02)" }}>
              <TableRow>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY, pl: 4 }}>Proposal Details</TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Creator / Student</TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Team & School</TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Date Submitted</TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Status</TableCell>
                <TableCell align="right" sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY, pr: 4 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ pl: 4 }}><Skeleton width="200px" height="24px" /><Skeleton width="140px" height="16px" sx={{ mt: 0.5 }} /></TableCell>
                    <TableCell><Skeleton variant="circular" width={32} height={32} sx={{ display: "inline-block", mr: 1, verticalAlign: "middle" }} /><Skeleton width="100px" height="20px" sx={{ display: "inline-block", verticalAlign: "middle" }} /></TableCell>
                    <TableCell><Skeleton width="120px" height="20px" /></TableCell>
                    <TableCell><Skeleton width="100px" height="20px" /></TableCell>
                    <TableCell><Skeleton width="80px" height="24px" /></TableCell>
                    <TableCell align="right" sx={{ pr: 4 }}><Skeleton variant="circular" width={30} height={30} sx={{ ml: "auto" }} /></TableCell>
                  </TableRow>
                ))
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Stack spacing={1} sx={{ alignItems: "center", justifyContent: "center" }}>
                      <RocketLaunch sx={{ fontSize: 48, color: alpha(COLORS.PRIMARY_NAVY, 0.2), mb: 1 }} />
                      <Typography sx={{ ...FS, fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>
                        No Innovations Found
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
                    onClick={async () => {
                      setOpenDetailsModal(true);
                      await fetchDetails(row.id);
                    }}
                    sx={{
                      cursor: "pointer",
                      "&:last-child td, &:last-child th": { border: 0 }
                    }}
                  >
                    {/* Proposal Details */}
                    <TableCell sx={{ pl: 4 }}>
                      <Typography sx={{ ...FS, fontWeight: 700, color: COLORS.TEXT_PRIMARY, fontSize: 14 }}>
                        {row.title}
                      </Typography>
                    </TableCell>

                    {/* Student Creator */}
                    <TableCell>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(COLORS.PRIMARY_NAVY, 0.1), color: COLORS.PRIMARY_NAVY }}>
                          <Person sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Box>
                          <Typography sx={{ ...FS, fontWeight: 600, fontSize: 13, color: COLORS.TEXT_PRIMARY }}>
                            {row.creator?.fullName || row.creator?.username || "N/A"}
                          </Typography>
                          <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                            {row.creator?.email || "No email"}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* Team & School */}
                    <TableCell>
                      <Typography sx={{ ...FS, fontWeight: 600, fontSize: 13, color: COLORS.TEXT_PRIMARY }}>
                        {row.team?.title || "N/A"}
                      </Typography>
                      <Typography sx={{ ...FS, fontSize: 12, color: COLORS.TEXT_SECONDARY }}>
                        {row.school?.name || "Independent"}
                      </Typography>
                    </TableCell>

                    {/* Date Submitted */}
                    <TableCell sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY }}>
                      {dayjs(row.createdAt).format("MMM DD, YYYY")}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Select
                        onClick={(e) => e.stopPropagation()}
                        value={row.status || "DRAFT"}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          if (newStatus === "REJECTED") {
                            setCommentTargetId(row.id);
                            setCommentDialogOpen(true);
                          } else {
                            setUpdatingRowId(row.id);
                            await updateStatus(row.id, newStatus);
                            setUpdatingRowId(null);
                          }
                        }}
                        disabled={updatingRowId === row.id || updatingStatus}
                        sx={{
                          height: 32,
                          borderRadius: "8px",
                          ...FS,
                          fontSize: 12,
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
                        {row.status === "DRAFT" && (
                          <MenuItem value="DRAFT" disabled sx={{ ...FS, fontSize: 13 }}>Draft</MenuItem>
                        )}
                        <MenuItem value="PENDING" sx={{ ...FS, fontSize: 13, color: COLORS.WARNING, fontWeight: 600 }}>Pending Review</MenuItem>
                        <MenuItem value="PATENT_PENDING" sx={{ ...FS, fontSize: 13, color: COLORS.INFO, fontWeight: 600 }}>Patent Pending</MenuItem>
                        <MenuItem value="PATENT_GRANTED" sx={{ ...FS, fontSize: 13, color: COLORS.SUCCESS, fontWeight: 600 }}>Patent Granted</MenuItem>
                        <MenuItem value="REJECTED" sx={{ ...FS, fontSize: 13, color: COLORS.ERROR, fontWeight: 600 }}>Rejected</MenuItem>
                        <MenuItem value="ARCHIVED" sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY, fontWeight: 600 }}>Archived</MenuItem>
                      </Select>
                    </TableCell>

                    {/* Action button */}
                    <TableCell align="right" sx={{ pr: 4 }}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuOpen(e, row);
                        }}
                        sx={{
                          bgcolor: "rgba(0,0,0,0.03)",
                          "&:hover": { bgcolor: "rgba(0,0,0,0.08)" }
                        }}
                      >
                        <MoreVert sx={{ color: COLORS.PRIMARY_NAVY }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
              border: "1px solid rgba(0,0,0,0.05)",
              mt: 1,
              minWidth: 180,
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem 
          onClick={handleViewDetails}
          sx={{ 
            ...FS, 
            fontSize: 14, 
            fontWeight: 600, 
            py: 1.5,
            color: COLORS.BLACK,
            display: "flex",
            gap: 1.5,
            "&:hover": { bgcolor: "rgba(1, 90, 80, 0.04)" }
          }}
        >
          <Visibility sx={{ fontSize: 20, color: COLORS.TEXT_SECONDARY }} />
          View Details
        </MenuItem>
      </Menu>

      {/* Innovation Details Dialog */}
      <Dialog
        fullWidth
        maxWidth="md"
        open={openDetailsModal}
        onClose={() => { setOpenDetailsModal(false); setInnovationDetails(null); }}
        slotProps={{
          paper: { sx: { borderRadius: "28px", p: 0, maxHeight: "90vh", overflowY: "auto" } },
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(8px)",
            },
          },
        }}
      >
        {loadingDetails ? (
          <Box sx={{ p: 10, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress size={40} sx={{ color: COLORS.PRIMARY_NAVY }} />
          </Box>
        ) : innovationDetails && (
          <Box>
            {/* Header Section */}
            <Box sx={{ p: 4, bgcolor: COLORS.PRIMARY_NAVY, color: "white", position: "relative" }}>
              <IconButton
                onClick={() => { setOpenDetailsModal(false); setInnovationDetails(null); }}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: 16,
                  color: "rgba(255,255,255,0.7)",
                  "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.1)" }
                }}
              >
                <Close />
              </IconButton>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 72, 
                    height: 72, 
                    bgcolor: "rgba(255,255,255,0.2)", 
                    color: "white",
                    borderRadius: "18px",
                  }}
                >
                  <RocketLaunch sx={{ fontSize: 36 }} />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ ...FS, fontSize: 22, fontWeight: 800 }}>
                    {innovationDetails.title}
                  </Typography>
                  <Typography sx={{ ...FS, fontSize: 13, color: "rgba(255,255,255,0.8)", mt: 0.5 }}>
                    Submitted by {innovationDetails.creator?.fullName || innovationDetails.creator?.username || "Student"} • {dayjs(innovationDetails.createdAt).format("MMM DD, YYYY")}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                    {getStatusChip(innovationDetails.status)}
                    {innovationDetails.team?.type && (
                      <Chip 
                        label={innovationDetails.team.type} 
                        size="small" 
                        sx={{ bgcolor: "rgba(255,255,255,0.25)", color: "white", fontWeight: 700, fontSize: 10, height: 24 }} 
                      />
                    )}
                  </Stack>
                </Box>
              </Box>
            </Box>

            {/* Content Section */}
            <Box sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {/* Left Column: Concept details */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <Stack spacing={3}>
                    {/* Problem Description */}
                    <Box>
                      <Typography sx={{ ...FS, fontSize: 15, fontWeight: 800, mb: 1, color: COLORS.PRIMARY_NAVY, display: "flex", alignItems: "center", gap: 1 }}>
                        <Info sx={{ fontSize: 18 }} /> Problem Description
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "16px", bgcolor: "rgba(0,0,0,0.01)" }}>
                        <Typography sx={{ ...FS, fontSize: 14, color: COLORS.TEXT_PRIMARY, lineHeight: 1.6 }}>
                          {innovationDetails.problemDescription || "No description provided."}
                        </Typography>
                      </Paper>
                    </Box>

                    {/* Proposed Solution */}
                    <Box>
                      <Typography sx={{ ...FS, fontSize: 15, fontWeight: 800, mb: 1, color: COLORS.PRIMARY_NAVY, display: "flex", alignItems: "center", gap: 1 }}>
                        <RocketLaunch sx={{ fontSize: 18 }} /> Proposed Solution
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "16px", bgcolor: "rgba(0,0,0,0.01)" }}>
                        <Typography sx={{ ...FS, fontSize: 14, color: COLORS.TEXT_PRIMARY, lineHeight: 1.6 }}>
                          {innovationDetails.solution || "No solution provided."}
                        </Typography>
                      </Paper>
                    </Box>

                    {/* Team & School Info */}
                    <Box>
                      <Typography sx={{ ...FS, fontSize: 15, fontWeight: 800, mb: 2, color: COLORS.PRIMARY_NAVY, display: "flex", alignItems: "center", gap: 1 }}>
                        <SchoolIcon sx={{ fontSize: 18 }} /> School & Team
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "16px", bgcolor: "rgba(0,0,0,0.01)" }}>
                        <Stack spacing={2.5}>
                          {/* School details & Board */}
                          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                            <Work sx={{ fontSize: 16, color: COLORS.TEXT_SECONDARY, mt: 0.5 }} />
                            <Box>
                              <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY }}>Nominated School</Typography>
                              <Typography sx={{ ...FS, fontSize: 13, fontWeight: 700 }}>
                                {innovationDetails.school?.name || "Independent"}
                                {innovationDetails.school?.board?.name && ` (${innovationDetails.school.board.name})`}
                              </Typography>
                              {innovationDetails.school?.city && (
                                <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                                  {innovationDetails.school.city}, {innovationDetails.school.state}
                                </Typography>
                              )}
                            </Box>
                          </Box>

                          {/* Team Code */}
                          {innovationDetails.team && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <People sx={{ fontSize: 16, color: COLORS.TEXT_SECONDARY }} />
                              <Box>
                                <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY }}>Team Title (Code)</Typography>
                                <Typography sx={{ ...FS, fontSize: 13, fontWeight: 600 }}>
                                  {innovationDetails.team.title} ({innovationDetails.team.teamCode})
                                </Typography>
                              </Box>
                            </Box>
                          )}

                          {/* Mentor details */}
                          {innovationDetails.team?.mentor && (
                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                              <Person sx={{ fontSize: 16, color: COLORS.TEXT_SECONDARY, mt: 0.5 }} />
                              <Box>
                                <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY }}>Project Mentor</Typography>
                                <Typography sx={{ ...FS, fontSize: 13, fontWeight: 700 }}>
                                  {`${innovationDetails.team.mentor.firstName || ""} ${innovationDetails.team.mentor.lastName || ""}`.trim() || "N/A"}
                                </Typography>
                                <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                                  {innovationDetails.team.mentor.email}
                                </Typography>
                              </Box>
                            </Box>
                          )}

                          {/* Assistant Mentor details */}
                          {innovationDetails.team?.assistantMentor && (
                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                              <Person sx={{ fontSize: 16, color: COLORS.TEXT_SECONDARY, mt: 0.5 }} />
                              <Box>
                                <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY }}>Assistant Mentor</Typography>
                                <Typography sx={{ ...FS, fontSize: 13, fontWeight: 700 }}>
                                  {`${innovationDetails.team.assistantMentor.firstName || ""} ${innovationDetails.team.assistantMentor.lastName || ""}`.trim() || "N/A"}
                                </Typography>
                                <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                                  {innovationDetails.team.assistantMentor.email}
                                </Typography>
                              </Box>
                            </Box>
                          )}

                          {/* Team members */}
                          {innovationDetails.team?.members && innovationDetails.team.members.length > 0 && (
                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                              <People sx={{ fontSize: 16, color: COLORS.TEXT_SECONDARY, mt: 0.5 }} />
                              <Box sx={{ width: "100%" }}>
                                <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY, mb: 1 }}>Team Members / Students</Typography>
                                <Stack spacing={1}>
                                  {innovationDetails.team.members.map((member: any) => (
                                    <Box key={member.id} sx={{ display: "flex", flexDirection: "column", p: 1, bgcolor: "rgba(0,0,0,0.02)", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.03)" }}>
                                      <Typography sx={{ ...FS, fontSize: 12, fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>
                                        {`${member.student?.firstName || ""} ${member.student?.lastName || ""}`.trim() || member.student?.email || "Student"}
                                      </Typography>
                                      <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY }}>
                                        {member.student?.email}
                                      </Typography>
                                    </Box>
                                  ))}
                                </Stack>
                              </Box>
                            </Box>
                          )}
                        </Stack>
                      </Paper>
                    </Box>
                  </Stack>
                </Grid>

                {/* Right Column: Metadata */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <Stack spacing={3.5}>
                    {/* Creator Info */}
                    <Box>
                      <Typography sx={{ ...FS, fontSize: 15, fontWeight: 800, mb: 2, color: COLORS.PRIMARY_NAVY, display: "flex", alignItems: "center", gap: 1 }}>
                        <Person sx={{ fontSize: 18 }} /> Creator Profile
                      </Typography>
                      <Stack spacing={2}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Email sx={{ fontSize: 16, color: COLORS.TEXT_SECONDARY }} />
                          <Box>
                            <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY }}>Email Address</Typography>
                            <Typography sx={{ ...FS, fontSize: 13, fontWeight: 600 }}>{innovationDetails.creator?.email || "N/A"}</Typography>
                          </Box>
                        </Box>
                        {innovationDetails.creator?.phone && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Phone sx={{ fontSize: 16, color: COLORS.TEXT_SECONDARY }} />
                            <Box>
                              <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY }}>Phone Number</Typography>
                              <Typography sx={{ ...FS, fontSize: 13, fontWeight: 600 }}>{innovationDetails.creator.phone}</Typography>
                            </Box>
                          </Box>
                        )}
                        {innovationDetails.creator?.bio && (
                          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                            <Info sx={{ fontSize: 16, color: COLORS.TEXT_SECONDARY, mt: 0.5 }} />
                            <Box>
                              <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY }}>Bio</Typography>
                              <Typography sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_PRIMARY }}>{innovationDetails.creator.bio}</Typography>
                            </Box>
                          </Box>
                        )}
                      </Stack>
                    </Box>

                    {/* Attachments */}
                    {((innovationDetails.attachmentsDownloadUrls && innovationDetails.attachmentsDownloadUrls.length > 0) || innovationDetails.attorneyTemplateDownloadUrl) && (
                      <Box>
                        <Typography sx={{ ...FS, fontSize: 15, fontWeight: 800, mb: 2, color: COLORS.PRIMARY_NAVY, display: "flex", alignItems: "center", gap: 1 }}>
                          <Attachment sx={{ fontSize: 18 }} /> Documentation & Attachments
                        </Typography>
                        <Stack spacing={1}>
                          {innovationDetails.attorneyTemplateDownloadUrl && (
                            <Button
                              variant="text"
                              size="small"
                              startIcon={<Description />}
                              href={innovationDetails.attorneyTemplateDownloadUrl}
                              target="_blank"
                              sx={{ justifyContent: "flex-start", textTransform: "none", ...FS, fontSize: 12, color: COLORS.PRIMARY_NAVY }}
                            >
                              Attorney Final Template
                            </Button>
                          )}
                          {innovationDetails.attachmentsDownloadUrls?.map((url, index) => (
                            <Button
                              key={index}
                              variant="text"
                              size="small"
                              startIcon={<Attachment />}
                              href={url}
                              target="_blank"
                              sx={{ justifyContent: "flex-start", textTransform: "none", ...FS, fontSize: 12, color: COLORS.PRIMARY_NAVY }}
                            >
                              Attachment #{index + 1}
                            </Button>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </Grid>
              </Grid>



              <Divider sx={{ my: 4, borderStyle: "dashed" }} />

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button 
                  onClick={() => { setOpenDetailsModal(false); setInnovationDetails(null); }}
                  variant="outlined"
                  sx={{ borderRadius: "12px", textTransform: "none", px: 4, color: COLORS.TEXT_SECONDARY, borderColor: "rgba(0,0,0,0.1)" }}
                >
                  Close Details
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Dialog>

      {/* Rejection Comment Dialog */}
      <Dialog
        open={commentDialogOpen}
        onClose={() => { setCommentDialogOpen(false); setCommentTargetId(null); setRejectionComment(""); }}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: { sx: { borderRadius: "20px", p: 3 } }
        }}
      >
        <DialogTitle sx={{ ...FS, fontWeight: 800, color: COLORS.PRIMARY_NAVY, px: 0, pt: 0 }}>
          Reason for Rejection
        </DialogTitle>
        <DialogContent sx={{ px: 0, py: 1 }}>
          <Typography sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY, mb: 2 }}>
            Please provide comments explaining the reason for rejecting this proposal.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Type comments here..."
            value={rejectionComment}
            onChange={(e) => setRejectionComment(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 0, pb: 0, pt: 2 }}>
          <Button
            onClick={() => { setCommentDialogOpen(false); setCommentTargetId(null); setRejectionComment(""); }}
            variant="text"
            sx={{ ...FS, textTransform: "none", color: COLORS.TEXT_SECONDARY }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (commentTargetId && rejectionComment.trim()) {
                setUpdatingRowId(commentTargetId);
                const success = await updateStatus(commentTargetId, "REJECTED", rejectionComment);
                setUpdatingRowId(null);
                if (success) {
                  setCommentDialogOpen(false);
                  setCommentTargetId(null);
                  setRejectionComment("");
                }
              }
            }}
            variant="contained"
            disabled={!rejectionComment.trim()}
            sx={{
              background: COLORS.PRIMARY_NAVY,
              borderRadius: "10px",
              textTransform: "none",
              ...FS,
              px: 3,
              fontWeight: 600,
            }}
          >
            Submit Rejection
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InnovationList;
