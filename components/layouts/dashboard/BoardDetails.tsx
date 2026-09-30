"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  IconButton,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  TablePagination,
  TextField,
  InputAdornment,
  FormControl,
  Select,
} from "@mui/material";
import {
  ArrowBack,
  Visibility,
  MoreVert,
  Search,
  Close,
  FilterList,
} from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS, TYPOGRAPHY } from "@/utils/enum";
import { useSchoolByBoardId } from "@/hooks/common/useSchools";
import { useRouter } from "next/navigation";

interface BoardDetailsProps {
  boardId: string;
}

const COLUMNS = [
  { label: "School Name", minWidth: 240, align: "left" as const },
  { label: "Teachers", width: 110, align: "center" as const },
  { label: "Students", width: 110, align: "center" as const },
  { label: "Research", width: 110, align: "center" as const },
  { label: "Patents", width: 110, align: "center" as const },
  { label: "Startups", width: 110, align: "center" as const },
  { label: "Status", width: 110, align: "center" as const },
  { label: "Actions", width: 80, align: "right" as const },
];

const BoardDetails: React.FC<BoardDetailsProps> = ({ boardId }) => {
  const router = useRouter();
  const {
    data: schools,
    loading,
    pagination,
    fetchSchoolByBoardId,
  } = useSchoolByBoardId();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // 3-dot action menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeSchool, setActiveSchool] = useState<any>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    school: any,
  ) => {
    setAnchorEl(event.currentTarget);
    setActiveSchool(school);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveSchool(null);
  };

  const handleViewDetails = () => {
    if (activeSchool?.id) {
      router.push(`/dashboard/boards/${boardId}/schools/${activeSchool.id}`);
    }
    handleMenuClose();
  };

  // Debounced API fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      if (boardId) {
        fetchSchoolByBoardId(
          boardId,
          page + 1,
          rowsPerPage,
          searchTerm,
          statusFilter,
        );
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [boardId, page, rowsPerPage, searchTerm, statusFilter]);

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

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSchoolActive = (school: any) => {
    if (school.isActive !== undefined) return Boolean(school.isActive);
    if (school.status !== undefined)
      return String(school.status).toUpperCase() === "ACTIVE";
    return true;
  };

  const filteredSchools = useMemo(() => {
    return (schools || []).filter((school) => {
      const matchesSearch = searchTerm.trim()
        ? school.name?.toLowerCase().includes(searchTerm.trim().toLowerCase())
        : true;
      const active = isSchoolActive(school);
      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "ACTIVE"
          ? active
          : !active;
      return matchesSearch && matchesStatus;
    });
  }, [schools, searchTerm, statusFilter]);

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <IconButton
          onClick={() => router.back()}
          sx={{
            color: COLORS.PRIMARY_NAVY,
            bgcolor: COLORS.INPUT_BG,
            "&:hover": { bgcolor: COLORS.HOVER_BG },
          }}
        >
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h4"
          sx={{
            ...TYPOGRAPHY.PAGE_TITLE,
          }}
        >
          Board Details
        </Typography>
      </Box>

      <Box sx={{ width: "100%" }}>
        <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            variant="h6"
            sx={{
              ...TYPOGRAPHY.SECTION_TITLE,
            }}
          >
            Associated Schools
          </Typography>
          {pagination?.total !== undefined && (
            <Chip
              label={`${pagination.total} Schools`}
              size="small"
              sx={{
                ...TYPOGRAPHY.BADGE,
                bgcolor: COLORS.INPUT_BG,
                color: COLORS.TEXT_SECONDARY,
                border: `1px solid ${COLORS.BORDER_GRAY}`,
                borderRadius: "12px",
                height: "24px",
              }}
            />
          )}
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
            placeholder="Search by school name..."
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
                    <Search
                      sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 20 }}
                    />
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
                  "&.Mui-focused fieldset": {
                    borderColor: COLORS.PRIMARY_NAVY,
                  },
                }}
              >
                <MenuItem
                  value="ALL"
                  sx={{
                    fontFamily: poppins.style.fontFamily,
                    fontSize: "13px",
                  }}
                >
                  All Status
                </MenuItem>
                <MenuItem
                  value="ACTIVE"
                  sx={{
                    fontFamily: poppins.style.fontFamily,
                    fontSize: "13px",
                  }}
                >
                  Active
                </MenuItem>
                <MenuItem
                  value="INACTIVE"
                  sx={{
                    fontFamily: poppins.style.fontFamily,
                    fontSize: "13px",
                  }}
                >
                  Inactive
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Skeleton variant="circular" width={36} height={36} />
                        <Skeleton variant="text" width={120} height={24} />
                      </Box>
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
                        variant="rounded"
                        width={60}
                        height={24}
                        sx={{ mx: "auto", borderRadius: "12px" }}
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
              ) : filteredSchools && filteredSchools.length > 0 ? (
                filteredSchools.map((school) => {
                  const active = isSchoolActive(school);
                  return (
                    <TableRow
                      key={school.id}
                      onClick={() =>
                        router.push(
                          `/dashboard/boards/${boardId}/schools/${school.id}`,
                        )
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
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Avatar
                            src={school.logo}
                            alt={school.name}
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: COLORS.INPUT_BG,
                              color: COLORS.TEXT_SECONDARY,
                            }}
                          />
                          <Typography
                            sx={{
                              ...TYPOGRAPHY.TABLE_CELL_PRIMARY,
                              textTransform: "capitalize",
                            }}
                          >
                            {school.name}
                          </Typography>
                        </Box>
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
                          {school.teacherCount || 0}
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
                          {school.studentCount || 0}
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
                          {school.researchCount || 0}
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
                          {school.patentGrantedCount || 0}
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
                          {school.startupCount || 0}
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
                            handleMenuOpen(e, school);
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
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography
                      sx={{
                        fontFamily: poppins.style.fontFamily,
                        color: COLORS.TEXT_SECONDARY,
                        fontSize: 14,
                      }}
                    >
                      No school records found matching your filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {pagination && (
            <TablePagination
              component="div"
              count={pagination.total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
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

export default BoardDetails;

