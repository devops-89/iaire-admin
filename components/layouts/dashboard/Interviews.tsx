"use client";

import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  Avatar,
  Chip,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Divider,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Pagination as MuiPagination,
} from "@mui/material";
import {
  EventAvailable,
  School,
  Work,
  CalendarMonth,
  AccessTime,
  Person,
  People,
  MoreVert,
  Visibility,
  Email,
  Phone,
  LocationOn,
  Info,
  Layers,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { COLORS, FONT_SIZE } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import { useInterviews } from "@/hooks/common/useInterviews";
import { PRIMARY_BUTTON_STYLE, TEXTFIELD_STYLE_VALIDATION } from "@/utils/style";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import dayjs, { Dayjs } from "dayjs";

const FS = { fontFamily: poppins.style.fontFamily };

const Interviews = () => {
  const { 
    teachers, 
    teacherDetails,
    setTeacherDetails,
    loading, 
    loadingDetails,
    scheduling, 
    approving,
    pagination, 
    scheduleInterview, 
    approveInterview,
    rejectInterview,
    fetchTeachers,
    fetchTeacherDetails,
    goToPage 
  } = useInterviews();
  const [openModal, setOpenModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [interviewDate, setInterviewDate] = useState<Dayjs | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeRecord, setActiveRecord] = useState<any>(null);
  const [activeStatus, setActiveStatus] = useState("SCHOOL_APPROVED");
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [pendingRecord, setPendingRecord] = useState<any>(null);

  const STATUS_TABS = [
    { label: "Self Nominated", value: "SELF_NOMINATED" },
    { label: "School Approved", value: "SCHOOL_APPROVED" },
    { label: "Interview Scheduled", value: "INTERVIEW_SCHEDULED" },
    { label: "Interview Completed", value: "INTERVIEW_COMPLETED" },
    { label: "IAIRE Approved", value: "IAIRE_APPROVED" },
    { label: "Rejected", value: "REJECTED" },
  ];

  const handleStatusChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveStatus(newValue);
    fetchTeachers(1, pagination.limit, newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, record: any) => {
    setAnchorEl(event.currentTarget);
    setActiveRecord(record);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveRecord(null);
  };

  const handleOpenSchedule = () => {
    if (activeRecord) {
      setSelectedTeacher(activeRecord);
      setInterviewDate(activeRecord.interviewScheduledAt ? dayjs(activeRecord.interviewScheduledAt) : null);
      setOpenModal(true);
    }
    handleMenuClose();
  };

  const handleViewDetails = async () => {
    if (activeRecord) {
      await fetchTeacherDetails(activeRecord.id);
      setOpenDetailsModal(true);
    }
    handleMenuClose();
  };

  const handleConfirmSchedule = async () => {
    if (!interviewDate || !selectedTeacher) return;
    const success = await scheduleInterview(selectedTeacher.id, interviewDate.toISOString());
    if (success) {
      setOpenModal(false);
      setInterviewDate(null);
    }
  };

  const handleApprove = async () => {
    if (!activeRecord) return;
    const id = activeRecord.id;
    handleMenuClose();
    await approveInterview(id, activeStatus);
  };

  const handleOpenReject = () => {
    setPendingRecord(activeRecord); // save before menu closes and clears activeRecord
    setOpenRejectDialog(true);
    handleMenuClose();
  };

  const handleConfirmReject = async () => {
    if (!pendingRecord) return;
    const success = await rejectInterview(pendingRecord.id, activeStatus, rejectReason || undefined);
    if (success) {
      setOpenRejectDialog(false);
      setRejectReason("");
      setPendingRecord(null);
    }
  };

  if (loading && teachers.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress sx={{ color: COLORS.PRIMARY_NAVY }} />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 800, color: COLORS.PRIMARY_NAVY, fontFamily: poppins.style.fontFamily }}>
            Training Management
          </Typography>
          <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 14 }}>
            Schedule and manage teacher training interviews
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.05)", px: 1 }}>
        <Tabs 
          value={activeStatus} 
          onChange={handleStatusChange}
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
              minWidth: 120,
              color: COLORS.TEXT_SECONDARY,
              py: 2,
              "&.Mui-selected": {
                color: COLORS.PRIMARY_NAVY,
              }
            }
          }}
        >
          {STATUS_TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
        
        <Typography sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY, fontWeight: 500 }}>
          Total: <strong style={{ color: COLORS.PRIMARY_NAVY }}>{pagination.total}</strong> Records
        </Typography>
      </Box>

      {/* Interviews Table View */}
      <TableContainer 
        sx={{ 
          backgroundColor: "white", 
          borderRadius: "28px", 
          boxShadow: "0px 15px 50px rgba(0,0,0,0.04)",
          border: "1px solid rgba(0,0,0,0.05)",
          overflow: "hidden"
        }}
      >
        <Table sx={{ minWidth: 1000 }}>
          <TableHead sx={{ backgroundColor: "rgba(11, 23, 39, 0.02)" }}>
            <TableRow>
              <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY, pl: 4 }}>Teacher Info</TableCell>
              <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Training & School</TableCell>
              <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Status</TableCell>
              <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Interview Schedule</TableCell>
              <TableCell align="right" sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY, pr: 4 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((record) => (
              <TableRow 
                key={record.id}
                sx={{ 
                  "&:hover": { bgcolor: "rgba(11, 23, 39, 0.01)" },
                  transition: "background-color 0.2s"
                }}
              >
                {/* Teacher Profile */}
                <TableCell sx={{ pl: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar 
                      src={record?.teacher?.profileImage} 
                      sx={{ width: 48, height: 48, border: `2px solid ${COLORS.ACCENT_TAN}30` }}
                    >
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography sx={{ ...FS, fontWeight: 700, color: COLORS.BLACK, fontSize: 14 }}>
                        {record?.teacher?.fullName || `${record?.teacher?.firstName || ""} ${record?.teacher?.lastName || ""}`.trim() || "Unknown Teacher"}
                      </Typography>
                      <Stack direction="row" spacing={0.8} sx={{ mt: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            px: 1,
                            py: 0.3,
                            bgcolor: "rgba(11, 23, 39, 0.04)",
                            borderRadius: "6px",
                            border: "1px solid rgba(0,0,0,0.03)"
                          }}
                        >
                          <Typography sx={{ ...FS, fontSize: 10, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>
                            {record.teacher.experienceYears}Y EXP
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            px: 1,
                            py: 0.3,
                            bgcolor: 
                              record.training.type === "RESEARCH" ? "rgba(99, 102, 241, 0.08)" : 
                              record.training.type === "INNOVATION" ? "rgba(245, 158, 11, 0.08)" : "rgba(0,0,0,0.05)",
                            borderRadius: "6px",
                            border: 
                              record.training.type === "RESEARCH" ? "1px solid rgba(99, 102, 241, 0.2)" : 
                              record.training.type === "INNOVATION" ? "1px solid rgba(245, 158, 11, 0.2)" : "1px solid rgba(0,0,0,0.1)",
                          }}
                        >
                          <Typography 
                            sx={{ 
                              ...FS, 
                              fontSize: 10, 
                              fontWeight: 800, 
                              color: 
                                record.training.type === "RESEARCH" ? "#4F46E5" : 
                                record.training.type === "INNOVATION" ? "#D97706" : "#6B7280" 
                            }}
                          >
                            {record.training.type}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Box>
                </TableCell>

                {/* Training Details */}
                <TableCell>
                  <Box>
                    <Typography sx={{ ...FS, fontWeight: 600, fontSize: 13, color: COLORS.BLACK }}>
                      {record.training.title || `${record.training.type} Training`}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                      <Work sx={{ fontSize: 14, color: COLORS.TEXT_SECONDARY }} />
                      <Typography sx={{ ...FS, fontSize: 12, color: COLORS.TEXT_SECONDARY }}>
                        {record.training.school.name}
                      </Typography>
                    </Box>
                    <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY, mt: 0.5 }}>
                      Subjects: <span style={{ fontWeight: 600, color: COLORS.BLACK, textTransform: "capitalize" }}>{record.teacher.primarySubjects?.map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(", ") || "N/A"}</span>
                    </Typography>
                  </Box>
                </TableCell>

                {/* Status Chip */}
                <TableCell>
                  <Chip
                    label={record.status.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                    size="small"
                    sx={{
                      ...FS,
                      fontWeight: 700,
                      fontSize: 10,
                      height: 24,
                      textTransform: "none",
                      letterSpacing: 0.2,
                      bgcolor: 
                        record.status === "IAIRE_APPROVED" ? "rgba(16, 185, 129, 0.12)" : 
                        record.status === "REJECTED" ? "rgba(239, 68, 68, 0.12)" : 
                        record.status === "SELF_NOMINATED" ? "rgba(59, 130, 246, 0.12)" : 
                        record.status === "SCHOOL_APPROVED" ? "rgba(245, 158, 11, 0.12)" : 
                        record.status === "INTERVIEW_SCHEDULED" ? "rgba(99, 102, 241, 0.12)" : "rgba(0,0,0,0.05)",
                      color: 
                        record.status === "IAIRE_APPROVED" ? "#059669" : 
                        record.status === "REJECTED" ? "#DC2626" : 
                        record.status === "SELF_NOMINATED" ? "#2563EB" : 
                        record.status === "SCHOOL_APPROVED" ? "#D97706" : 
                        record.status === "INTERVIEW_SCHEDULED" ? "#4F46E5" : "#4B5563",
                      borderRadius: "6px",
                      border: "1px solid currentColor",
                      "& .MuiChip-label": { px: 1.5 }
                    }}
                  />
                  {record.status === "REJECTED" && record.reason && (
                    <Typography 
                      sx={{ 
                        ...FS, 
                        fontSize: 10, 
                        color: "#DC2626", 
                        mt: 0.5, 
                        fontStyle: "italic",
                        maxWidth: 150,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                      title={record.reason}
                    >
                      Reason: {record.reason}
                    </Typography>
                  )}
                </TableCell>

                {/* Interview Info */}
                <TableCell>
                  {record.interviewScheduledAt ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTime sx={{ fontSize: 18, color: "#10B981" }} />
                      <Typography sx={{ ...FS, fontWeight: 700, fontSize: 13, color: COLORS.BLACK }} suppressHydrationWarning>
                        {new Date(record.interviewScheduledAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography sx={{ ...FS, fontSize: 12, color: COLORS.TEXT_SECONDARY, fontStyle: "italic" }}>
                      Not Scheduled Yet
                    </Typography>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell align="right" sx={{ pr: 4 }}>
                   <IconButton
                    onClick={(e) => handleMenuOpen(e, record)}
                    disabled={record.status === "REJECTED"}
                    sx={{
                      bgcolor: "rgba(0,0,0,0.03)",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.08)" }
                    }}
                  >
                    <MoreVert sx={{ color: COLORS.PRIMARY_NAVY }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
              minWidth: 200,
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
            "&:hover": { bgcolor: "rgba(11, 23, 39, 0.04)" }
          }}
        >
          <Visibility sx={{ fontSize: 20, color: COLORS.TEXT_SECONDARY }} />
          View Profile Details
        </MenuItem>
        <Divider sx={{ my: 0.5, borderStyle: "dashed" }} />
        {activeStatus === "SCHOOL_APPROVED" && (
          <MenuItem 
            onClick={handleOpenSchedule}
            sx={{ 
              ...FS, 
              fontSize: 14, 
              fontWeight: 600, 
              py: 1.5,
              color: COLORS.PRIMARY_NAVY,
              display: "flex",
              gap: 1.5,
              "&:hover": { bgcolor: "rgba(11, 23, 39, 0.04)" }
            }}
          >
            <CalendarMonth sx={{ fontSize: 20 }} />
            Schedule Interview
          </MenuItem>
        )}
        {activeStatus === "INTERVIEW_SCHEDULED" && (
          <>
            <Divider sx={{ my: 0.5, borderStyle: "dashed" }} />
            <MenuItem 
              onClick={handleApprove}
              disabled={approving}
              sx={{ 
                ...FS, 
                fontSize: 14, 
                fontWeight: 600, 
                py: 1.5,
                color: "#059669",
                display: "flex",
                gap: 1.5,
                "&:hover": { bgcolor: "rgba(5, 150, 105, 0.06)" }
              }}
            >
              <CheckCircle sx={{ fontSize: 20 }} />
              {approving ? "Processing..." : "Approve Teacher"}
            </MenuItem>
            <MenuItem 
              onClick={handleOpenReject}
              disabled={approving}
              sx={{ 
                ...FS, 
                fontSize: 14, 
                fontWeight: 600, 
                py: 1.5,
                color: COLORS.ERROR,
                display: "flex",
                gap: 1.5,
                "&:hover": { bgcolor: "rgba(239, 68, 68, 0.06)" }
              }}
            >
              <Cancel sx={{ fontSize: 20 }} />
              Reject Teacher
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Teacher/Training Details Modal */}
      <Dialog
        fullWidth
        maxWidth="md"
        open={openDetailsModal}
        onClose={() => setOpenDetailsModal(false)}
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
        {loadingDetails ? (
          <Box sx={{ p: 10, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress size={40} sx={{ color: COLORS.PRIMARY_NAVY }} />
          </Box>
        ) : teacherDetails && (
          <Box>
            {/* Header Section */}
            <Box sx={{ p: 4, bgcolor: COLORS.PRIMARY_NAVY, color: "white", position: "relative" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Avatar 
                  src={teacherDetails.teacher.profileImage} 
                  sx={{ width: 100, height: 100, border: "4px solid rgba(255,255,255,0.2)" }}
                />
                <Box>
                  <Typography sx={{ ...FS, fontSize: 24, fontWeight: 800 }}>
                    {teacherDetails?.teacher?.fullName || `${teacherDetails?.teacher?.firstName || ""} ${teacherDetails?.teacher?.lastName || ""}`.trim() || "Unknown Teacher"}
                  </Typography>
                  <Typography sx={{ ...FS, fontSize: 14, color: "rgba(255,255,255,0.8)", mt: 0.5 }}>
                    {teacherDetails.teacher.role} • {teacherDetails.teacher.experienceYears} Years Experience
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                    <Chip 
                      label={teacherDetails.status.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')} 
                      size="small" 
                      sx={{ 
                        bgcolor: "rgba(255,255,255,0.25)", 
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
            <Box sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {/* Left Column: Teacher Info */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <Typography sx={{ ...FS, fontSize: 16, fontWeight: 800, mb: 2, color: COLORS.PRIMARY_NAVY, display: "flex", alignItems: "center", gap: 1 }}>
                    <Info sx={{ fontSize: 20 }} /> Teacher Information
                  </Typography>
                  <Stack spacing={2.5}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Email sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
                      <Box>
                        <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>Email Address</Typography>
                        <Typography sx={{ ...FS, fontSize: 14, fontWeight: 600 }}>{teacherDetails.teacher.email}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Phone sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
                      <Box>
                        <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>Phone Number</Typography>
                        <Typography sx={{ ...FS, fontSize: 14, fontWeight: 600 }}>
                          {teacherDetails.teacher.phone.startsWith("+") ? teacherDetails.teacher.phone : `${teacherDetails.teacher.countryCode} ${teacherDetails.teacher.phone}`}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Layers sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
                      <Box>
                        <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>Primary Subjects</Typography>
                        <Typography sx={{ ...FS, fontSize: 14, fontWeight: 600, textTransform: "capitalize" }}>
                          {teacherDetails.teacher.primarySubjects.map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Person sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
                      <Box>
                        <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>Gender</Typography>
                        <Typography sx={{ ...FS, fontSize: 14, fontWeight: 600, textTransform: "capitalize" }}>{teacherDetails.teacher.gender.toLowerCase()}</Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Grid>

                {/* Right Column: Training & School Info */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <Typography sx={{ ...FS, fontSize: 16, fontWeight: 800, mb: 2, color: COLORS.PRIMARY_NAVY, display: "flex", alignItems: "center", gap: 1 }}>
                    <School sx={{ fontSize: 20 }} /> Training & Institution
                  </Typography>
                  <Stack spacing={2.5}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                      <Work sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY, mt: 0.5 }} />
                      <Box>
                        <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>Nominated School</Typography>
                        <Typography sx={{ ...FS, fontSize: 14, fontWeight: 700 }}>{teacherDetails.training.school.name}</Typography>
                        <Typography sx={{ ...FS, fontSize: 12, color: COLORS.TEXT_SECONDARY }}>
                          {teacherDetails.training.school.city}, {teacherDetails.training.school.state}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Info sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
                      <Box>
                        <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>Training Title</Typography>
                        <Typography sx={{ ...FS, fontSize: 14, fontWeight: 600 }}>{teacherDetails.training.title || `${teacherDetails.training.type} Training`}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <CalendarMonth sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
                      <Box>
                        <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>Availability Window</Typography>
                        <Typography sx={{ ...FS, fontSize: 13, fontWeight: 600 }}>
                          {new Date(teacherDetails.availableFrom).toLocaleDateString()} - {new Date(teacherDetails.availableTo).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <LocationOn sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
                      <Box>
                        <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>Training Mode</Typography>
                        <Chip label={teacherDetails.training.mode} size="small" sx={{ fontWeight: 800, fontSize: 9, height: 20, bgcolor: "rgba(11, 23, 39, 0.05)" }} />
                      </Box>
                    </Box>

                    {/* Status & Rejection Reason */}
                    <Box sx={{ pt: 1 }}>
                      <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>Nomination Status</Typography>
                      <Chip 
                        label={teacherDetails.status.replace('_', ' ')} 
                        size="small" 
                        sx={{ 
                          fontWeight: 800, 
                          fontSize: 10, 
                          bgcolor: 
                            teacherDetails.status === "IAIRE_APPROVED" ? "rgba(16, 185, 129, 0.1)" : 
                            teacherDetails.status === "REJECTED" ? "rgba(239, 68, 68, 0.1)" : 
                            "rgba(11, 23, 39, 0.05)",
                          color: 
                            teacherDetails.status === "IAIRE_APPROVED" ? "#059669" : 
                            teacherDetails.status === "REJECTED" ? "#DC2626" : 
                            COLORS.PRIMARY_NAVY,
                        }} 
                      />
                      {teacherDetails.status === "REJECTED" && teacherDetails.reason && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: "rgba(239, 68, 68, 0.05)", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, 0.1)" }}>
                          <Typography sx={{ ...FS, fontSize: 11, color: "#DC2626", fontWeight: 700, mb: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Cancel sx={{ fontSize: 14 }} /> Rejection Reason
                          </Typography>
                          <Typography sx={{ ...FS, fontSize: 13, color: COLORS.BLACK, fontStyle: "italic" }}>
                            "{teacherDetails.reason}"
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Stack>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4, borderStyle: "dashed" }} />

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button 
                  onClick={() => setOpenDetailsModal(false)}
                  variant="outlined"
                  sx={{ borderRadius: "12px", textTransform: "none", px: 4, color: COLORS.TEXT_SECONDARY, borderColor: "rgba(0,0,0,0.1)" }}
                >
                  Close Profile
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Dialog>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
          <MuiPagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={(_, page) => goToPage(page, activeStatus)}
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                fontFamily: poppins.style.fontFamily,
                fontWeight: 600,
                borderRadius: "12px",
                backgroundColor: "white",
                border: "1px solid rgba(0,0,0,0.05)",
                mx: 0.5,
                "&:hover": { bgcolor: "rgba(11, 23, 39, 0.05)" }
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: COLORS.PRIMARY_NAVY,
                color: "white",
                boxShadow: "0 4px 12px rgba(11, 23, 39, 0.2)",
                border: "none"
              }
            }}
          />
        </Box>
      )}

      {/* Schedule Modal */}
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)}
        slotProps={{
          paper: { sx: { borderRadius: "28px", p: 1, maxWidth: "480px" } },
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(8px)",
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontFamily: poppins.style.fontFamily, pb: 1, color: COLORS.PRIMARY_NAVY, fontSize: 20 }}>
          {selectedTeacher?.interviewScheduledAt ? "Reschedule Interview" : "Schedule Interview"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: COLORS.TEXT_SECONDARY, mb: 4, ...FS }}>
            {selectedTeacher?.interviewScheduledAt 
              ? `You are rescheduling the interview for ` 
              : `Select a date and time for the interview with `
            }
            <strong style={{ color: COLORS.BLACK }}>{selectedTeacher?.teacher.fullName || `${selectedTeacher?.teacher.firstName} ${selectedTeacher?.teacher.lastName}`}</strong>.
          </Typography>
          
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker
              label="Interview Date & Time"
              value={interviewDate}
              onChange={(newValue: any) => setInterviewDate(newValue)}
              disablePast // Prevent past dates
              closeOnSelect={false}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                  sx: {
                    ...TEXTFIELD_STYLE_VALIDATION,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      backgroundColor: "rgba(11, 23, 39, 0.02)",
                    }
                  }
                },
                toolbar: {
                  hidden: false,
                },
                actionBar: {
                  actions: ['cancel', 'accept'] // Very clear Cancel and OK buttons
                }
              }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
          <Button 
            onClick={() => setOpenModal(false)} 
            sx={{ 
              ...FS, 
              color: COLORS.TEXT_SECONDARY, 
              textTransform: "none", 
              fontWeight: 600,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmSchedule}
            disabled={scheduling || !interviewDate}
            sx={{ 
              ...PRIMARY_BUTTON_STYLE, 
              width: "auto", 
              px: 4,
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(11, 23, 39, 0.2)"
            }}
          >
            {scheduling ? <CircularProgress size={20} color="inherit" /> : (selectedTeacher?.interviewScheduledAt ? "Update Schedule" : "Confirm Schedule")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Reason Dialog */}
      <Dialog
        open={openRejectDialog}
        onClose={() => { setOpenRejectDialog(false); setRejectReason(""); }}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: "20px", p: 1 } },
          backdrop: { sx: { backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.35)" } }
        }}
      >
        <DialogTitle sx={{ ...FS, fontWeight: 700, fontSize: 18, pb: 0.5, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: "rgba(239, 68, 68, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Cancel sx={{ color: COLORS.ERROR, fontSize: 20 }} />
          </Box>
          Reject Teacher
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY, mb: 2.5 }}>
            You are about to reject this teacher's nomination. Optionally provide a reason for the rejection.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Reason for rejection (optional)..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                fontFamily: poppins.style.fontFamily,
                fontSize: 14,
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: COLORS.ERROR,
                }
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => { setOpenRejectDialog(false); setRejectReason(""); }}
            sx={{ ...FS, textTransform: "none", color: COLORS.TEXT_SECONDARY, borderRadius: "10px", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmReject}
            disabled={approving}
            sx={{
              ...FS,
              textTransform: "none",
              backgroundColor: COLORS.ERROR,
              borderRadius: "10px",
              px: 3,
              fontWeight: 600,
              "&:hover": { backgroundColor: "#DC2626" }
            }}
          >
            {approving ? <CircularProgress size={18} color="inherit" /> : "Confirm Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Interviews;
