"use client";
import { useSchools } from "@/hooks/common/useSchools";
import { useUpdateTicketStatus } from "@/hooks/school/useUpdateTicketStatus";
import { COLORS, TYPOGRAPHY } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import {
  Close,
  FilterList,
  MoreVert,
  Search,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const COLUMNS = [
  { label: "Board Name", minWidth: 260, align: "left" as const },
  { label: "Status", width: 120, align: "center" as const },
  { label: "Schools", width: 120, align: "center" as const },
  { label: "Teachers", width: 120, align: "center" as const },
  { label: "Students", width: 120, align: "center" as const },
  { label: "Actions", width: 80, align: "right" as const },
];

const SchoolsManagement = () => {
  const { boardAnalytics, loading, pagination, fetchBoardAnalytics } =
    useSchools();
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // 3-dot action menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeBoard, setActiveBoard] = useState<any>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    board: any,
  ) => {
    setAnchorEl(event.currentTarget);
    setActiveBoard(board);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveBoard(null);
  };

  const handleViewDetails = () => {
    if (activeBoard?.boardId) {
      router.push(`/dashboard/boards/${activeBoard.boardId}`);
    }
    handleMenuClose();
  };

  // Debounced fetch for API search/filter
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBoardAnalytics(page + 1, limit, searchTerm, statusFilter);
    }, 350);
    return () => clearTimeout(timer);
  }, [page, limit, searchTerm, statusFilter]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const { updateTicketStatus } = useUpdateTicketStatus();
  const handleUpdateTicketStatus = async (id: string, status: string) => {
    await updateTicketStatus(id, status);
    fetchBoardAnalytics(page + 1, limit, searchTerm, statusFilter);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isBoardActive = (board: any) => {
    if (board.isActive !== undefined) return Boolean(board.isActive);
    if (board.status !== undefined)
      return String(board.status).toUpperCase() === "ACTIVE";
    return true;
  };

  const filteredBoards = useMemo(() => {
    return (boardAnalytics || []).filter((board) => {
      const matchesSearch = searchTerm.trim()
        ? board.boardName?.toLowerCase().includes(searchTerm.trim().toLowerCase())
        : true;
      const active = isBoardActive(board);
      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "ACTIVE"
          ? active
          : !active;
      return matchesSearch && matchesStatus;
    });
  }, [boardAnalytics, searchTerm, statusFilter]);

  return (
    <Box>
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
            Board Management
          </Typography>
          {pagination?.total !== undefined && (
            <Chip
              label={`${pagination.total} Boards`}
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
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by board name..."
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
                  <Search sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => handleSearchChange("")}
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
              minWidth: { xs: "100%", sm: "180px" },
            }}
          >
            <Select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value as string)}
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
                sx={{ fontFamily: poppins.style.fontFamily, fontSize: "13px" }}
              >
                All Status
              </MenuItem>
              <MenuItem
                value="ACTIVE"
                sx={{ fontFamily: poppins.style.fontFamily, fontSize: "13px" }}
              >
                Active
              </MenuItem>
              <MenuItem
                value="INACTIVE"
                sx={{ fontFamily: poppins.style.fontFamily, fontSize: "13px" }}
              >
                Inactive
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ width: "100%" }}>
        <TableContainer
          component={Paper}
          sx={{
            bgcolor: COLORS.WHITE,
            borderRadius: "14px",
            border: `1px solid ${COLORS.BORDER_GRAY}`,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: COLORS.BG_LIGHT }}>
              <TableRow>
                {COLUMNS.map((col, i) => (
                  <TableCell
                    key={i}
                    align={col.align}
                    sx={{
                      py: 1.75,
                      px: 2.5,
                      borderBottom: `1px solid ${COLORS.BORDER_GRAY}`,
                      ...(col.width && { width: col.width }),
                      ...(col.minWidth && { minWidth: col.minWidth }),
                    }}
                  >
                    <Typography
                      sx={{
                        ...TYPOGRAPHY.TABLE_HEADER,
                      }}
                    >
                      {col.label}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ py: 1.75, px: 2.5 }}>
                      <Skeleton variant="text" width="65%" height={24} />
                    </TableCell>
                    <TableCell align="center" sx={{ py: 1.75, px: 2.5 }}>
                      <Skeleton
                        variant="rounded"
                        width={60}
                        height={24}
                        sx={{ mx: "auto", borderRadius: "12px" }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ py: 1.75, px: 2.5 }}>
                      <Skeleton
                        variant="text"
                        width={30}
                        height={24}
                        sx={{ mx: "auto" }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ py: 1.75, px: 2.5 }}>
                      <Skeleton
                        variant="text"
                        width={30}
                        height={24}
                        sx={{ mx: "auto" }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ py: 1.75, px: 2.5 }}>
                      <Skeleton
                        variant="text"
                        width={30}
                        height={24}
                        sx={{ mx: "auto" }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1.75, px: 2.5 }}>
                      <Skeleton
                        variant="circular"
                        width={28}
                        height={28}
                        sx={{ ml: "auto" }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredBoards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center", py: 6 }}>
                    <Typography
                      sx={{
                        color: COLORS.TEXT_SECONDARY,
                        fontFamily: poppins.style.fontFamily,
                        fontSize: 14,
                      }}
                    >
                      No board records found matching your filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBoards.map((board) => {
                  const active = isBoardActive(board);
                  return (
                    <TableRow
                      key={board.boardId}
                      onClick={() =>
                        router.push(`/dashboard/boards/${board.boardId}`)
                      }
                      sx={{
                        cursor: "pointer",
                        "&:hover": { bgcolor: COLORS.HOVER_BG_LIGHT },
                        transition: "background-color 0.15s ease",
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      <TableCell
                        sx={{
                          py: 1.75,
                          px: 2.5,
                          borderBottom: `1px solid ${COLORS.INPUT_BG}`,
                        }}
                      >
                        <Typography
                          sx={{
                            ...TYPOGRAPHY.TABLE_CELL_PRIMARY,
                          }}
                        >
                          {board.boardName}
                        </Typography>
                      </TableCell>

                      <TableCell
                        align="center"
                        sx={{
                          py: 1.75,
                          px: 2.5,
                          borderBottom: `1px solid ${COLORS.INPUT_BG}`,
                        }}
                      >
                        <Chip
                          label={active ? "Active" : "Inactive"}
                          size="small"
                          sx={{
                            ...TYPOGRAPHY.BADGE,
                            bgcolor: active
                              ? COLORS.STATUS_SUCCESS_BG
                              : COLORS.STATUS_ERROR_BG,
                            color: active
                              ? COLORS.STATUS_SUCCESS_TEXT
                              : COLORS.STATUS_ERROR_TEXT,
                            border: `1px solid ${
                              active
                                ? COLORS.STATUS_SUCCESS_BORDER
                                : COLORS.STATUS_ERROR_BORDER
                            }`,
                            borderRadius: "12px",
                            height: "24px",
                            px: 0.5,
                          }}
                        />
                      </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        py: 1.75,
                        px: 2.5,
                        borderBottom: `1px solid ${COLORS.INPUT_BG}`,
                      }}
                    >
                      <Typography
                        sx={{
                          ...TYPOGRAPHY.TABLE_CELL_SECONDARY,
                          fontWeight: 600,
                          color: COLORS.PRIMARY_NAVY,
                        }}
                      >
                        {board.totalSchools?.toLocaleString() ?? 0}
                      </Typography>
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        py: 1.75,
                        px: 2.5,
                        borderBottom: `1px solid ${COLORS.INPUT_BG}`,
                      }}
                    >
                      <Typography
                        sx={{
                          ...TYPOGRAPHY.TABLE_CELL_SECONDARY,
                          fontWeight: 600,
                          color: COLORS.PRIMARY_NAVY,
                        }}
                      >
                        {board.totalTeachers?.toLocaleString() ?? 0}
                      </Typography>
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        py: 1.75,
                        px: 2.5,
                        borderBottom: `1px solid ${COLORS.INPUT_BG}`,
                      }}
                    >
                      <Typography
                        sx={{
                          ...TYPOGRAPHY.TABLE_CELL_SECONDARY,
                          fontWeight: 600,
                          color: COLORS.PRIMARY_NAVY,
                        }}
                      >
                        {board.totalStudents?.toLocaleString() ?? 0}
                      </Typography>
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        py: 1.75,
                        px: 2.5,
                        borderBottom: `1px solid ${COLORS.INPUT_BG}`,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuOpen(e, board);
                        }}
                        sx={{
                          color: COLORS.TEXT_SECONDARY,
                          "&:hover": {
                            color: COLORS.PRIMARY_NAVY,
                            bgcolor: COLORS.HOVER_BG,
                          },
                        }}
                      >
                        <MoreVert sx={{ fontSize: 20 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              }))}
            </TableBody>
          </Table>

          {pagination && (
            <TablePagination
              component="div"
              count={pagination.total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={limit}
              onRowsPerPageChange={handleChangeRowsPerPage}
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
          )}
        </TableContainer>

        {/* 3-dot Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                minWidth: 170,
                borderRadius: "10px",
                border: `1px solid ${COLORS.BORDER_GRAY}`,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
                p: 0.75,
              },
            },
          }}
        >
          <MenuItem
            onClick={handleViewDetails}
            sx={{
              fontFamily: poppins.style.fontFamily,
              fontSize: "13px",
              fontWeight: 500,
              py: 1,
              px: 1.5,
              borderRadius: "6px",
              color: COLORS.TEXT_PRIMARY,
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              "&:hover": { bgcolor: COLORS.HOVER_BG },
            }}
          >
            <Visibility sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
            View Details
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default SchoolsManagement;

