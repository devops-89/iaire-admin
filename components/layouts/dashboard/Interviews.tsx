"use client";

import React, { useEffect, useState } from "react";
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
  TablePagination,
  alpha,
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
  Close,
} from "@mui/icons-material";
import { COLORS, TRAINING_NOMINATION_STATUS } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import { useInterviews } from "@/hooks/common/useInterviews";
import { useModal } from "@/store/useModal";
import ViewInterviewDetails from "@/modals/ViewInterviewDetails";
import ScheduleInterview from "@/modals/ScheduleInterview";
import RejectNomination from "@/modals/RejectNomination";
import InterviewTable from "./training/InterviewTable";

const FS = { fontFamily: poppins.style.fontFamily };

const Interviews = () => {
  const { showModal } = useModal();
  const {
    teachers,
    loading,
    approving,
    // pagination,
    approveInterview,
    fetchTeachers,
  } = useInterviews();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeRecord, setActiveRecord] = useState<any>(null);
  const [activeStatus, setActiveStatus] = useState<any>("ALL");

  const STATUS_TABS = [
    {
      label: "All",
      value: "ALL" as any,
    },
    {
      label: "Self Nominated",
      value: TRAINING_NOMINATION_STATUS.SELF_NOMINATED,
    },
    {
      label: "School Approved",
      value: TRAINING_NOMINATION_STATUS.SCHOOL_APPROVED,
    },
    {
      label: "School Assigned",
      value: TRAINING_NOMINATION_STATUS.SCHOOL_ASSIGNED,
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
    {
      label: "Training Completed",
      value: TRAINING_NOMINATION_STATUS.TRAINING_COMPLETED,
    },
  ];

  const handleStatusChange = (event: React.SyntheticEvent, newValue: any) => {
    setActiveStatus(newValue);
    setPage(0);
    fetchTeachers(page + 1, rowsPerPage, newValue);
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    fetchTeachers(page + 1, rowsPerPage, activeStatus);
  };

  const rowsPerPageChangeHandler = (limit: number) => {
    setRowsPerPage(limit);
    fetchTeachers(page === 0 ? 1 : page, limit, activeStatus);
  };
  useEffect(() => {
    fetchTeachers(page === 0 ? 1 : page, rowsPerPage, activeStatus);
  }, []);

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
      </Box>
      <InterviewTable
        data={teachers}
        activeStatus={activeStatus}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={pageChangeHandler}
        onRowsPerPageChange={rowsPerPageChangeHandler}
      />
    </Box>
  );
};

export default Interviews;
