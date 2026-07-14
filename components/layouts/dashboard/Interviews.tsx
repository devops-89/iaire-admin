"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
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
  CircularProgress,
  Pagination as MuiPagination,
} from "@mui/material";
import {
  School,
  Work,
  CalendarMonth,
  AccessTime,
  Person,
  MoreVert,
  Visibility,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { COLORS, TRAINING_NOMINATION_STATUS } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import { useInterviews } from "@/hooks/common/useInterviews";
import { useModal } from "@/store/useModal";
import ViewInterviewDetails from "@/modals/ViewInterviewDetails";
import ScheduleInterview from "@/modals/ScheduleInterview";
import RejectNomination from "@/modals/RejectNomination";

const FS = { fontFamily: poppins.style.fontFamily };

const COLUMNS = [
  { label: "Teacher Info", align: "left" as const, sx: { pl: 4 } },
  { label: "Training & School", align: "left" as const, sx: {} },
  { label: "Status", align: "left" as const, sx: {} },
  { label: "Interview Schedule", align: "left" as const, sx: {} },
  { label: "Actions", align: "right" as const, sx: { pr: 4 } },
];

const Interviews = () => {
  const { showModal } = useModal();
  const {
    teachers,
    loading,
    approving,
    pagination,
    approveInterview,
    fetchTeachers,
    goToPage,
  } = useInterviews();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeRecord, setActiveRecord] = useState<any>(null);
  const [activeStatus, setActiveStatus] = useState(
    TRAINING_NOMINATION_STATUS.SCHOOL_APPROVED,
  );

  const STATUS_TABS = [
    {
      label: "Self Nominated",
      value: TRAINING_NOMINATION_STATUS.SELF_NOMINATED,
    },
    {
      label: "School Approved",
      value: TRAINING_NOMINATION_STATUS.SCHOOL_APPROVED,
    },
    {
      label: "Interview Scheduled",
      value: TRAINING_NOMINATION_STATUS.INTERVIEW_SCHEDULED,
    },
    {
      label: "Interview Completed",
      value: TRAINING_NOMINATION_STATUS.INTERVIEW_COMPLETED,
    },
    {
      label: "IAIRE Approved",
      value: TRAINING_NOMINATION_STATUS.IAIRE_APPROVED,
    },
    { label: "Rejected", value: TRAINING_NOMINATION_STATUS.REJECTED },
  ];

  const handleStatusChange = (
    event: React.SyntheticEvent,
    newValue: TRAINING_NOMINATION_STATUS,
  ) => {
    setActiveStatus(newValue);
    fetchTeachers(1, pagination?.limit || 10, newValue);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    record: any,
  ) => {
    setAnchorEl(event.currentTarget);
    setActiveRecord(record);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveRecord(null);
  };

  const handleOpenSchedule = () => {
    if (activeRecord) {
      showModal(
        <ScheduleInterview
          selectedTeacher={activeRecord}
          onSuccess={() =>
            fetchTeachers(
              pagination?.page || 1,
              pagination?.limit || 10,
              activeStatus,
            )
          }
        />,
        { size: "sm" },
      );
    }
    handleMenuClose();
  };

  const handleViewDetails = () => {
    if (activeRecord) {
      showModal(<ViewInterviewDetails teacherId={activeRecord.id} />, {
        size: "lg",
      });
    }
    handleMenuClose();
  };

  const handleApprove = async () => {
    if (!activeRecord) return;
    const id = activeRecord.id;
    handleMenuClose();
    await approveInterview(id, activeStatus);
  };

  const handleOpenReject = () => {
    if (activeRecord) {
      showModal(
        <RejectNomination
          selectedTeacher={activeRecord}
          activeStatus={activeStatus}
          onSuccess={() =>
            fetchTeachers(
              pagination?.page || 1,
              pagination?.limit || 10,
              activeStatus,
            )
          }
        />,
        { size: "sm" },
      );
    }
    handleMenuClose();
  };

  if (loading && teachers.length === 0) {
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

  return (
    <Box sx={{ pb: 4 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 24,
              fontWeight: 800,
              color: COLORS.PRIMARY_NAVY,
              fontFamily: poppins.style.fontFamily,
            }}
          >
            Training Management
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          px: 1,
        }}
      >
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
              },
            },
          }}
        >
          {STATUS_TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>

        <Typography
          sx={{
            ...FS,
            fontSize: 13,
            color: COLORS.TEXT_SECONDARY,
            fontWeight: 500,
          }}
        >
          Total:{" "}
          <strong style={{ color: COLORS.PRIMARY_NAVY }}>
            {pagination?.total ?? 0}
          </strong>{" "}
          Records
        </Typography>
      </Box>

      {/* Interviews Table View */}
      <TableContainer
        sx={{
          backgroundColor: "white",
          borderRadius: "28px",
          boxShadow: "0px 15px 50px rgba(0,0,0,0.04)",
          border: "1px solid rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <Table sx={{ minWidth: 1000 }}>
          <TableHead sx={{ backgroundColor: "rgba(11, 23, 39, 0.02)" }}>
            <TableRow>
              {COLUMNS.map((column) => (
                <TableCell
                  key={column.label}
                  align={column.align}
                  sx={{
                    ...FS,
                    fontWeight: 700,
                    color: COLORS.PRIMARY_NAVY,
                    ...column.sx,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((record) => (
              <TableRow
                key={record.id}
                sx={{
                  "&:hover": { bgcolor: "rgba(11, 23, 39, 0.01)" },
                  transition: "background-color 0.2s",
                }}
              >
                {/* Teacher Profile */}
                <TableCell sx={{ pl: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      src={record?.teacher?.profileImage}
                      sx={{
                        width: 48,
                        height: 48,
                        border: `2px solid ${COLORS.ACCENT_TAN}30`,
                      }}
                    >
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography
                        sx={{
                          ...FS,
                          fontWeight: 700,
                          color: COLORS.BLACK,
                          fontSize: 14,
                        }}
                      >
                        {record?.teacher?.fullName ||
                          `${record?.teacher?.firstName || ""} ${record?.teacher?.lastName || ""}`.trim() ||
                          "Unknown Teacher"}
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
                            border: "1px solid rgba(0,0,0,0.03)",
                          }}
                        >
                          <Typography
                            sx={{
                              ...FS,
                              fontSize: 10,
                              fontWeight: 700,
                              color: COLORS.PRIMARY_NAVY,
                            }}
                          >
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
                              record.training.type === "RESEARCH"
                                ? "rgba(99, 102, 241, 0.08)"
                                : record.training.type === "INNOVATION"
                                  ? "rgba(245, 158, 11, 0.08)"
                                  : "rgba(0,0,0,0.05)",
                            borderRadius: "6px",
                            border:
                              record.training.type === "RESEARCH"
                                ? "1px solid rgba(99, 102, 241, 0.2)"
                                : record.training.type === "INNOVATION"
                                  ? "1px solid rgba(245, 158, 11, 0.2)"
                                  : "1px solid rgba(0,0,0,0.1)",
                          }}
                        >
                          <Typography
                            sx={{
                              ...FS,
                              fontSize: 10,
                              fontWeight: 800,
                              color:
                                record.training.type === "RESEARCH"
                                  ? "#4F46E5"
                                  : record.training.type === "INNOVATION"
                                    ? "#D97706"
                                    : "#6B7280",
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
                    <Typography
                      sx={{
                        ...FS,
                        fontWeight: 600,
                        fontSize: 13,
                        color: COLORS.BLACK,
                      }}
                    >
                      {record.training.title ||
                        `${record.training.type} Training`}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mt: 0.5,
                      }}
                    >
                      <Work
                        sx={{ fontSize: 14, color: COLORS.TEXT_SECONDARY }}
                      />
                      <Typography
                        sx={{
                          ...FS,
                          fontSize: 12,
                          color: COLORS.TEXT_SECONDARY,
                        }}
                      >
                        {record.training.school.name}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        ...FS,
                        fontSize: 11,
                        color: COLORS.TEXT_SECONDARY,
                        mt: 0.5,
                      }}
                    >
                      Subjects:{" "}
                      <span
                        style={{
                          fontWeight: 600,
                          color: COLORS.BLACK,
                          textTransform: "capitalize",
                        }}
                      >
                        {record.teacher.primarySubjects
                          ?.map(
                            (s: string) =>
                              s.charAt(0).toUpperCase() + s.slice(1),
                          )
                          .join(", ") || "N/A"}
                      </span>
                    </Typography>
                  </Box>
                </TableCell>

                {/* Status Chip */}
                <TableCell>
                  <Chip
                    label={record.status
                      .split("_")
                      .map(
                        (word: string) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase(),
                      )
                      .join(" ")}
                    size="small"
                    sx={{
                      ...FS,
                      fontWeight: 700,
                      fontSize: 10,
                      height: 24,
                      textTransform: "none",
                      letterSpacing: 0.2,
                      bgcolor:
                        record.status ===
                        TRAINING_NOMINATION_STATUS.IAIRE_APPROVED
                          ? "rgba(16, 185, 129, 0.12)"
                          : record.status ===
                              TRAINING_NOMINATION_STATUS.REJECTED
                            ? "rgba(239, 68, 68, 0.12)"
                            : record.status ===
                                TRAINING_NOMINATION_STATUS.SELF_NOMINATED
                              ? "rgba(59, 130, 246, 0.12)"
                              : record.status ===
                                  TRAINING_NOMINATION_STATUS.SCHOOL_APPROVED
                                ? "rgba(245, 158, 11, 0.12)"
                                : record.status ===
                                    TRAINING_NOMINATION_STATUS.INTERVIEW_SCHEDULED
                                  ? "rgba(99, 102, 241, 0.12)"
                                  : record.status ===
                                      TRAINING_NOMINATION_STATUS.INTERVIEW_COMPLETED
                                    ? "rgba(16, 185, 129, 0.12)"
                                    : "rgba(0,0,0,0.05)",
                      color:
                        record.status ===
                        TRAINING_NOMINATION_STATUS.IAIRE_APPROVED
                          ? "#059669"
                          : record.status ===
                              TRAINING_NOMINATION_STATUS.REJECTED
                            ? "#DC2626"
                            : record.status ===
                                TRAINING_NOMINATION_STATUS.SELF_NOMINATED
                              ? "#2563EB"
                              : record.status ===
                                  TRAINING_NOMINATION_STATUS.SCHOOL_APPROVED
                                ? "#D97706"
                                : record.status ===
                                    TRAINING_NOMINATION_STATUS.INTERVIEW_SCHEDULED
                                  ? "#4F46E5"
                                  : record.status ===
                                      TRAINING_NOMINATION_STATUS.INTERVIEW_COMPLETED
                                    ? "#059669"
                                    : "#4B5563",
                      borderRadius: "6px",
                      border: "1px solid currentColor",
                      "& .MuiChip-label": { px: 1.5 },
                    }}
                  />
                  {record.status === TRAINING_NOMINATION_STATUS.REJECTED &&
                    record.reason && (
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
                          whiteSpace: "nowrap",
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
                      <Typography
                        sx={{
                          ...FS,
                          fontWeight: 700,
                          fontSize: 13,
                          color: COLORS.BLACK,
                        }}
                        suppressHydrationWarning
                      >
                        {new Date(record.interviewScheduledAt).toLocaleString(
                          [],
                          { dateStyle: "medium", timeStyle: "short" },
                        )}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography
                      sx={{
                        ...FS,
                        fontSize: 12,
                        color: COLORS.TEXT_SECONDARY,
                        fontStyle: "italic",
                      }}
                    >
                      Not Scheduled Yet
                    </Typography>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell align="right" sx={{ pr: 4 }}>
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, record)}
                    disabled={
                      record.status === TRAINING_NOMINATION_STATUS.REJECTED
                    }
                    sx={{
                      bgcolor: "rgba(0,0,0,0.03)",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.08)" },
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
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
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
            "&:hover": { bgcolor: "rgba(11, 23, 39, 0.04)" },
          }}
        >
          <Visibility sx={{ fontSize: 20, color: COLORS.TEXT_SECONDARY }} />
          View Profile Details
        </MenuItem>
        <Divider sx={{ my: 0.5, borderStyle: "dashed" }} />
        {activeStatus === TRAINING_NOMINATION_STATUS.SCHOOL_APPROVED && (
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
              "&:hover": { bgcolor: "rgba(11, 23, 39, 0.04)" },
            }}
          >
            <CalendarMonth sx={{ fontSize: 20 }} />
            Schedule Interview
          </MenuItem>
        )}
        {activeStatus === TRAINING_NOMINATION_STATUS.INTERVIEW_SCHEDULED && (
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
                "&:hover": { bgcolor: "rgba(5, 150, 105, 0.06)" },
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
                "&:hover": { bgcolor: "rgba(239, 68, 68, 0.06)" },
              }}
            >
              <Cancel sx={{ fontSize: 20 }} />
              Reject Teacher
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default Interviews;
