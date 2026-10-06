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
  TablePagination,
} from "@mui/material";
import { Search, Close, FilterList } from "@mui/icons-material";
import { COLORS, HONORARIUM_STATUS, TYPOGRAPHY } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import { useHonorariums } from "@/hooks/common/useHonorariums";
import { HonorariumItem } from "@/utils/type";
import HonorariumTable from "./HonorariumTable";

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "ALL" },
  { label: "Pending", value: HONORARIUM_STATUS.PENDING },
  { label: "Approved", value: HONORARIUM_STATUS.APPROVED },
  { label: "Transaction Pending", value: HONORARIUM_STATUS.TRANSACTION_PENDING },
  { label: "Paid", value: HONORARIUM_STATUS.PAID },
  { label: "Rejected", value: HONORARIUM_STATUS.REJECTED },
];

const FS = { fontFamily: poppins.style.fontFamily };

const HonorariumManagement: React.FC = () => {
  const { honorariums, loading, fetchHonorariums } = useHonorariums();

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [activeStatus, setActiveStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Initial fetch
  useEffect(() => {
    fetchHonorariums(1, rowsPerPage, activeStatus, searchQuery.trim() || undefined);
  }, []);

  // Debounced search handling to avoid excessive backend requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(0);
      fetchHonorariums(
        1,
        rowsPerPage,
        activeStatus,
        searchQuery.trim() || undefined
      );
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Status dropdown filter handler
  const handleStatusChange = (newStatus: string) => {
    setActiveStatus(newStatus);
    setPage(0);
    fetchHonorariums(
      1,
      rowsPerPage,
      newStatus,
      searchQuery.trim() || undefined
    );
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
    fetchHonorariums(
      newPage + 1,
      rowsPerPage,
      activeStatus,
      searchQuery.trim() || undefined
    );
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    setRowsPerPage(newLimit);
    setPage(0);
    fetchHonorariums(
      1,
      newLimit,
      activeStatus,
      searchQuery.trim() || undefined
    );
  };

  const handleRefresh = () => {
    fetchHonorariums(
      page + 1,
      rowsPerPage,
      activeStatus,
      searchQuery.trim() || undefined
    );
  };

  // Helper to extract list safely from response
  const rawList: HonorariumItem[] = useMemo(() => {
    if (!honorariums) return [];
    const d: any = honorariums;
    if (Array.isArray(d.data)) return d.data as HonorariumItem[];
    if (Array.isArray(d.data?.data)) return d.data.data as HonorariumItem[];
    if (Array.isArray(d)) return d as HonorariumItem[];
    return [];
  }, [honorariums]);

  // Robust client-side filter fallback if user types in search
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return rawList;

    const q = searchQuery.toLowerCase().trim();
    return rawList.filter((item) => {
      const mentorName = (
        item.creator?.fullName ||
        `${item.creator?.firstName || ""} ${item.creator?.lastName || ""}`
      ).toLowerCase();
      const email = (item.creator?.email || "").toLowerCase();
      const teamTitle = (item.team?.title || "").toLowerCase();
      const teamCode = (item.team?.teamCode || "").toLowerCase();
      const schoolName = (item.school?.name || "").toLowerCase();
      const bankName = (item.bankName || "").toLowerCase();
      const holderName = (item.accountHolderName || "").toLowerCase();
      const status = (item.status || "").toLowerCase();

      return (
        mentorName.includes(q) ||
        email.includes(q) ||
        teamTitle.includes(q) ||
        teamCode.includes(q) ||
        schoolName.includes(q) ||
        bankName.includes(q) ||
        holderName.includes(q) ||
        status.includes(q)
      );
    });
  }, [rawList, searchQuery]);

  const totalCount =
    (searchQuery.trim() ? filteredList.length : undefined) ??
    honorariums?.pagination?.total ??
    (honorariums?.data as any)?.pagination?.total ??
    rawList.length;

  const displayHonorariums = useMemo(() => {
    return {
      success: true,
      statusCode: 200,
      message: "Honorariums fetched successfully",
      data: filteredList,
      pagination: {
        page: page + 1,
        limit: rowsPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / rowsPerPage) || 1,
      },
    };
  }, [filteredList, page, rowsPerPage, totalCount]);

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      {/* Top Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="h4"
            sx={{
              ...TYPOGRAPHY.PAGE_TITLE,
            }}
          >
            Honorarium Management
          </Typography>
        </Box>

        <Chip
          label={`${totalCount} Records`}
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
          placeholder="Search by mentor name, team, school, or bank..."
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
                fetchHonorariums(1, rowsPerPage, "ALL");
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

      {/* Main Table Content */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "40vh",
          }}
        >
          <CircularProgress sx={{ color: COLORS.PRIMARY_NAVY }} />
        </Box>
      ) : (
        <>
          <HonorariumTable
            data={displayHonorariums}
            onRefresh={handleRefresh}
          />

          {/* Pagination */}
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              mt: 2,
              ...FS,
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                ...FS,
                fontSize: "13px",
              },
            }}
          />
        </>
      )}
    </Box>
  );
};

export default HonorariumManagement;
