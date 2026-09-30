"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Search, Close, FilterList } from "@mui/icons-material";
import { COLORS, TRAINING_NOMINATION_STATUS, TYPOGRAPHY } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import { useInterviews } from "@/hooks/common/useInterviews";
import InterviewTable from "./training/InterviewTable";

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "ALL" },
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
  {
    label: "Rejected",
    value: TRAINING_NOMINATION_STATUS.REJECTED,
  },
  {
    label: "Training Completed",
    value: TRAINING_NOMINATION_STATUS.TRAINING_COMPLETED,
  },
];

const Interviews = () => {
  const { teachers, loading, fetchTeachers } = useInterviews();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeStatus, setActiveStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Initial load
  useEffect(() => {
    fetchTeachers(1, rowsPerPage, activeStatus, searchQuery.trim() || undefined);
  }, []);

  // Debounced search handling to avoid excessive API requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(0);
      fetchTeachers(
        1,
        rowsPerPage,
        activeStatus,
        searchQuery.trim() || undefined,
      );
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Status dropdown change handler
  const handleStatusChange = (newStatus: string) => {
    setActiveStatus(newStatus);
    setPage(0);
    fetchTeachers(
      1,
      rowsPerPage,
      newStatus,
      searchQuery.trim() || undefined,
    );
  };

  const pageChangeHandler = (newPage: number) => {
    setPage(newPage);
    fetchTeachers(
      newPage + 1,
      rowsPerPage,
      activeStatus,
      searchQuery.trim() || undefined,
    );
  };

  const rowsPerPageChangeHandler = (limit: number) => {
    setRowsPerPage(limit);
    setPage(0);
    fetchTeachers(
      1,
      limit,
      activeStatus,
      searchQuery.trim() || undefined,
    );
  };

  // Robust fallback client filter if backend doesn't implement partial text search on /teachers/all
  const displayTeachers = useMemo(() => {
    if (!teachers?.data) return teachers;
    if (!searchQuery.trim()) return teachers;

    const q = searchQuery.toLowerCase().trim();
    const filtered = teachers.data.filter((item) => {
      const teacherName = (
        item.teacher?.fullName ||
        `${item.teacher?.firstName || ""} ${item.teacher?.lastName || ""}`
      ).toLowerCase();
      const email = (item.teacher?.email || "").toLowerCase();
      const batchName = (item.training?.batch?.name || "").toLowerCase();
      const schoolName = (item.training?.school?.name || "").toLowerCase();
      const trainingTitle = (item.training?.title || "").toLowerCase();

      return (
        teacherName.includes(q) ||
        email.includes(q) ||
        batchName.includes(q) ||
        schoolName.includes(q) ||
        trainingTitle.includes(q)
      );
    });

    return {
      ...teachers,
      data: filtered,
      pagination: {
        ...teachers.pagination,
        total: filtered.length,
      },
    };
  }, [teachers, searchQuery]);

  return (
    <Box sx={{ pb: 4, width: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 1.5,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              ...TYPOGRAPHY.PAGE_TITLE,
            }}
          >
            Training Management
          </Typography>
        </Box>

        {teachers?.pagination?.total !== undefined && (
          <Chip
            label={`${teachers.pagination.total} Records`}
            size="small"
            sx={{
              bgcolor: COLORS.WHITE,
              border: "1px solid #E4E4E7",
              fontFamily: poppins.style.fontFamily,
              fontWeight: 600,
              color: COLORS.TEXT_PRIMARY,
              height: "32px",
              borderRadius: "8px",
              px: 0.5,
            }}
          />
        )}
      </Box>

      {/* Filter & Search Bar */}
      <Box
        sx={{
          mb: 3,
          p: 2,
          bgcolor: COLORS.WHITE,
          borderRadius: "14px",
          border: "1px solid #E4E4E7",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Search Field */}
        <TextField
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by teacher name, batch, or school..."
          size="small"
          fullWidth
          sx={{
            flex: { xs: "1 1 100%", md: "1 1 auto" },
            maxWidth: { md: "460px" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              fontFamily: poppins.style.fontFamily,
              fontSize: "13.5px",
              bgcolor: "#FAFAFA",
              "& fieldset": { borderColor: "#E4E4E7" },
              "&:hover fieldset": { borderColor: COLORS.PRIMARY_NAVY },
              "&.Mui-focused fieldset": { borderColor: COLORS.PRIMARY_NAVY },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery("")}
                    edge="end"
                  >
                    <Close sx={{ fontSize: 16 }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />

        {/* Status Dropdown Filter */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            width: { xs: "100%", md: "auto" },
          }}
        >
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "100%", md: "240px" },
            }}
          >
            <Select
              value={activeStatus}
              onChange={(e) => handleStatusChange(e.target.value as string)}
              displayEmpty
              startAdornment={
                <InputAdornment position="start">
                  <FilterList sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 18 }} />
                </InputAdornment>
              }
              sx={{
                borderRadius: "10px",
                fontFamily: poppins.style.fontFamily,
                fontSize: "13.5px",
                fontWeight: 500,
                color: COLORS.TEXT_PRIMARY,
                bgcolor: "#FAFAFA",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E4E4E7" },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: COLORS.PRIMARY_NAVY,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: COLORS.PRIMARY_NAVY,
                },
              }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                  sx={{
                    fontFamily: poppins.style.fontFamily,
                    fontSize: "13.5px",
                    fontWeight: opt.value === activeStatus ? 600 : 400,
                    bgcolor:
                      opt.value === activeStatus
                        ? "rgba(9, 9, 11, 0.05) !important"
                        : "transparent",
                  }}
                >
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Reset Filters shortcut if filtered */}
          {(activeStatus !== "ALL" || searchQuery) && (
            <Chip
              label="Reset"
              size="small"
              onClick={() => {
                setActiveStatus("ALL");
                setSearchQuery("");
                setPage(0);
                fetchTeachers(1, rowsPerPage, "ALL");
              }}
              sx={{
                cursor: "pointer",
                bgcolor: "#F4F4F5",
                color: COLORS.TEXT_PRIMARY,
                fontFamily: poppins.style.fontFamily,
                fontSize: "12px",
                fontWeight: 600,
                borderRadius: "8px",
                height: "36px",
                "&:hover": {
                  bgcolor: "#E4E4E7",
                },
              }}
            />
          )}
        </Box>
      </Box>

      {/* Table Component */}
      <InterviewTable
        data={displayTeachers}
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
