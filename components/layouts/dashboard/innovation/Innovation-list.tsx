"use client";
import React, { useEffect, useState } from "react";
import { useInnovationList } from "@/hooks/common/useInnovations";
import { INNOVATION_STATUS_DATA } from "@/utils/constant";
import { poppins } from "@/utils/fonts";
import { COLORS, TYPOGRAPHY } from "@/utils/enum";
import {
  Box,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Close,
  FilterList,
} from "@mui/icons-material";
import InnovationTable from "./Innovation_table";

const InnovationList = () => {
  const { innovationData, getInnovationList, updateInnovationStatus, loading } =
    useInnovationList();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [statusLoading, setStatusLoading] = useState<number | string | null>(
    null,
  );

  const fetchList = () => {
    getInnovationList({
      page: page + 1,
      limit,
      status: status && status !== "ALL" ? status : undefined,
      search: search.trim() ? search.trim() : undefined,
    });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchList();
    }, 350);

    return () => clearTimeout(delayDebounceFn);
  }, [page, limit, status, search]);

  const handleStatusChange = async (
    id: number | string,
    newStatus: string,
    reason?: string,
  ) => {
    setStatusLoading(id);
    const success = await updateInnovationStatus(id, newStatus, reason);
    if (success) {
      await fetchList();
    }
    setStatusLoading(null);
  };

  return (
    <Box>
      {/* Top Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            variant="h4"
            sx={{
              ...TYPOGRAPHY.PAGE_TITLE,
            }}
          >
            Innovation Management
          </Typography>
          {innovationData?.pagination?.total !== undefined && (
            <Chip
              label={`${innovationData.pagination.total} Records`}
              size="small"
              sx={{
                ...TYPOGRAPHY.BADGE,
                bgcolor: COLORS.INPUT_BG,
                color: COLORS.TEXT_SECONDARY,
                border: `1px solid ${COLORS.BORDER_GRAY}`,
                borderRadius: "12px",
                height: "26px",
              }}
            />
          )}
        </Box>
        <Tooltip title="Refresh List">
          <IconButton
            onClick={fetchList}
            disabled={loading}
            sx={{
              color: COLORS.TEXT_SECONDARY,
              "&:hover": { color: COLORS.PRIMARY_NAVY },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Search & Filter Bar */}
      <Box
        sx={{
          p: 2,
          bgcolor: COLORS.WHITE,
          borderRadius: "14px",
          border: `1px solid ${COLORS.BORDER_GRAY}`,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
        }}
      >
        {/* Search Field */}
        <TextField
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          placeholder="Search by innovation title or submitted by..."
          size="small"
          fullWidth
          sx={{
            flex: { xs: "1 1 100%", sm: "1 1 auto" },
            maxWidth: { sm: "420px" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              fontFamily: poppins.style.fontFamily,
              fontSize: "13.5px",
              bgcolor: COLORS.BG_LIGHT,
              "& fieldset": { borderColor: COLORS.BORDER_GRAY },
              "&:hover fieldset": { borderColor: COLORS.PRIMARY_NAVY },
              "&.Mui-focused fieldset": { borderColor: COLORS.PRIMARY_NAVY },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 20 }}
                  />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearch("");
                      setPage(0);
                    }}
                    edge="end"
                  >
                    <Close sx={{ fontSize: 16 }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />

        {/* Status Filter Dropdown */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: "240px" },
            }}
          >
            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as string);
                setPage(0);
              }}
              displayEmpty
              startAdornment={
                <InputAdornment position="start">
                  <FilterList
                    sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 18 }}
                  />
                </InputAdornment>
              }
              sx={{
                borderRadius: "10px",
                fontFamily: poppins.style.fontFamily,
                fontSize: "13.5px",
                bgcolor: COLORS.BG_LIGHT,
                "& fieldset": { borderColor: COLORS.BORDER_GRAY },
                "&:hover fieldset": { borderColor: COLORS.PRIMARY_NAVY },
                "&.Mui-focused fieldset": { borderColor: COLORS.PRIMARY_NAVY },
              }}
            >
              <MenuItem
                value="ALL"
                sx={{
                  fontFamily: poppins.style.fontFamily,
                  fontSize: "13px",
                }}
              >
                All Statuses
              </MenuItem>
              {INNOVATION_STATUS_DATA.map((item) => (
                <MenuItem
                  key={item.value}
                  value={item.value}
                  sx={{
                    fontFamily: poppins.style.fontFamily,
                    fontSize: "13px",
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Table & Pagination Container */}
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            bgcolor: COLORS.WHITE,
            borderRadius: "14px",
            border: `1px solid ${COLORS.BORDER_GRAY}`,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
            overflow: "hidden",
          }}
        >
          <InnovationTable
            innovationData={innovationData}
            onStatusChange={handleStatusChange}
            statusLoading={statusLoading}
          />
          <TablePagination
            component="div"
            count={innovationData?.pagination?.total || 0}
            page={page}
            rowsPerPage={limit}
            onPageChange={(e, newPage) => {
              setPage(newPage);
            }}
            onRowsPerPageChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(0);
            }}
            sx={{
              borderTop: `1px solid ${COLORS.BORDER_GRAY}`,
              fontFamily: poppins.style.fontFamily,
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  fontFamily: poppins.style.fontFamily,
                  fontSize: "13px",
                  color: COLORS.TEXT_SECONDARY,
                },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InnovationList;
