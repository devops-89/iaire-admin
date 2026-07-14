"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  InputBase,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  CircularProgress,
  Grid,
  Avatar,
  Divider,
  Paper,
  Chip,
  Skeleton,
  TablePagination,
  alpha,
} from "@mui/material";
import {
  Add,
  MoreVert,
  Search,
  Visibility,
  Info,
  CalendarMonth,
  People,
  Laptop,
  QuestionAnswer,
  School,
} from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";
import { useBatches } from "@/hooks/common/useBatches";
import { BATCH_TABLE_TABS } from "@/utils/constant";
import moment from "moment";
import { useModal } from "@/store/useModal";
import AddBatches from "@/modals/AddBatches";
import { Batch } from "@/utils/type";

const FS = { fontFamily: poppins.style.fontFamily };

const BatchesManagement = () => {
  const { fetchBatches, batches, loading, pagination } = useBatches();
  const [tabValue, setTabValue] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeRecord, setActiveRecord] = useState<Batch | null>(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    setPage(0);
  };

  const { showModal } = useModal();
  const addBatches = () => {
    showModal(<AddBatches />);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, record: Batch) => {
    setAnchorEl(event.currentTarget);
    setActiveRecord(record);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveRecord(null);
  };

  const handleViewDetails = () => {
    if (activeRecord) {
      setOpenDetailsModal(true);
      setAnchorEl(null);
    }
  };

  // Client-side filtering on category and search text
  const filteredBatches = (batches || []).filter((item: Batch) => {
    // 1. Tab/Category Filter
    if (tabValue !== "ALL" && item.category !== tabValue) return false;

    // 2. Search text filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const nameMatch = item.name?.toLowerCase().includes(search);
      const categoryMatch = item.category?.toLowerCase().includes(search);
      const roleMatch = item.userRole?.toLowerCase().includes(search);
      if (!nameMatch && !categoryMatch && !roleMatch) return false;
    }

    return true;
  });

  const paginatedBatches = filteredBatches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Header section */}
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
            Batch Management
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={addBatches}
          sx={{
            background: `linear-gradient(135deg, ${COLORS.PRIMARY_NAVY} 0%, #1A293D 100%)`,
            borderRadius: "14px",
            textTransform: "none",
            ...FS,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            boxShadow: "0 8px 20px 0 rgba(11, 23, 39, 0.15)",
            transition: "all 0.3s",
            "&:hover": {
              boxShadow: "0 10px 24px 0 rgba(11, 23, 39, 0.25)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Create Batch
        </Button>
      </Box>

      {/* Filter and search inputs */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: COLORS.INPUT_BG,
          borderRadius: "14px",
          px: 2,
          py: 0.8,
          width: "100%",
          border: "1px solid rgba(0,0,0,0.03)",
        }}
      >
        <Search sx={{ color: COLORS.TEXT_SECONDARY, mr: 1, fontSize: 20 }} />
        <InputBase
          placeholder="Search by batch title, attendees, or categories..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          sx={{
            fontFamily: poppins.style.fontFamily,
            fontSize: "0.9rem",
            width: "100%",
          }}
        />
      </Box>

      {/* Batches Table Card */}
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
            value={tabValue}
            onChange={handleTabChange}
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
            {BATCH_TABLE_TABS.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>

          <Typography sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY, fontWeight: 500, display: { xs: "none", md: "block" } }}>
            Total Batches: <strong style={{ color: COLORS.PRIMARY_NAVY }}>{filteredBatches.length}</strong>
          </Typography>
        </Box>

        <TableContainer sx={{ minWidth: 900 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "rgba(11, 23, 39, 0.02)" }}>
              <TableRow>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY, pl: 4 }}>ID</TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Batch Name</TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Start Date</TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>End Date</TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Category</TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Status</TableCell>
                <TableCell align="right" sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY, pr: 4 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ pl: 4 }}><Skeleton width="30px" height="24px" /></TableCell>
                    <TableCell><Skeleton width="180px" height="24px" /></TableCell>
                    <TableCell><Skeleton width="120px" height="20px" /></TableCell>
                    <TableCell><Skeleton width="120px" height="20px" /></TableCell>
                    <TableCell><Skeleton width="100px" height="24px" /></TableCell>
                    <TableCell><Skeleton width="80px" height="24px" /></TableCell>
                    <TableCell align="right" sx={{ pr: 4 }}><Skeleton variant="circular" width={30} height={30} sx={{ ml: "auto" }} /></TableCell>
                  </TableRow>
                ))
              ) : filteredBatches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Stack spacing={1} sx={{ alignItems: "center", justifyContent: "center" }}>
                      <CalendarMonth sx={{ fontSize: 48, color: alpha(COLORS.PRIMARY_NAVY, 0.2), mb: 1 }} />
                      <Typography sx={{ ...FS, fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>
                        No Batches Found
                      </Typography>
                      <Typography sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY }}>
                        No records match the selected category or search filters.
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBatches.map((row) => (
                  <TableRow key={row.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell sx={{ ...FS, pl: 4, fontWeight: 600 }}>{row.id}</TableCell>
                    <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>
                      {row.name || "Unnamed Batch"}
                    </TableCell>
                    <TableCell sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY }}>
                      {moment(row.startDate).format("MMM DD, YYYY")}
                    </TableCell>
                    <TableCell sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY }}>
                      {moment(row.endDate).format("MMM DD, YYYY")}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.category}
                        size="small"
                        sx={{
                          ...FS,
                          fontWeight: 700,
                          fontSize: 10,
                          height: 24,
                          bgcolor: alpha(COLORS.PRIMARY_NAVY, 0.08),
                          color: COLORS.PRIMARY_NAVY,
                          borderRadius: "6px",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status || (row.isActive ? "ACTIVE" : "INACTIVE")}
                        size="small"
                        sx={{
                          ...FS,
                          fontWeight: 700,
                          fontSize: 10,
                          height: 24,
                          bgcolor: row.isActive || row.status === "ACTIVE"
                            ? alpha(COLORS.SUCCESS, 0.1)
                            : alpha(COLORS.ERROR, 0.1),
                          color: row.isActive || row.status === "ACTIVE"
                            ? COLORS.SUCCESS
                            : COLORS.ERROR,
                          border: `1px solid ${row.isActive || row.status === "ACTIVE" ? COLORS.SUCCESS : COLORS.ERROR}`,
                          borderRadius: "6px",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 4 }}>
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, row)}
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

        <TablePagination
          component="div"
          count={filteredBatches.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => {
            setPage(newPage);
          }}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
        />
      </Card>

      {/* Actions dropdown menu */}
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
            "&:hover": { bgcolor: "rgba(11, 23, 39, 0.04)" }
          }}
        >
          <Visibility sx={{ fontSize: 20, color: COLORS.TEXT_SECONDARY }} />
          View Details
        </MenuItem>
      </Menu>

      {/* Batch Details Dialog */}
      <Dialog
        fullWidth
        maxWidth="md"
        open={openDetailsModal}
        onClose={() => { setOpenDetailsModal(false); setActiveRecord(null); }}
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
        {activeRecord && (
          <Box>
            {/* Header Banner */}
            <Box sx={{ p: 4, bgcolor: COLORS.PRIMARY_NAVY, color: "white" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    bgcolor: "rgba(255,255,255,0.2)", 
                    color: "white",
                    borderRadius: "16px",
                  }}
                >
                  <People sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography sx={{ ...FS, fontSize: 22, fontWeight: 800 }}>
                    {activeRecord.name || "Unnamed Batch"}
                  </Typography>
                  <Typography sx={{ ...FS, fontSize: 13, color: "rgba(255,255,255,0.8)", mt: 0.5 }}>
                    Category: {activeRecord.category} • Attendees: {activeRecord.userRole === "TEACHER" ? "Mentor / Teacher" : activeRecord.userRole}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Details Content */}
            <Box sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {/* Left side info */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={{ ...FS, fontSize: 15, fontWeight: 800, mb: 2, color: COLORS.PRIMARY_NAVY, display: "flex", alignItems: "center", gap: 1 }}>
                    <Info sx={{ fontSize: 18 }} /> Core Configuration
                  </Typography>
                  
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "16px", bgcolor: "rgba(0,0,0,0.01)" }}>
                    <Stack spacing={2}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <CalendarMonth sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
                        <Box>
                          <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY }}>Timeline Dates</Typography>
                          <Typography sx={{ ...FS, fontSize: 13, fontWeight: 600 }}>
                            {moment(activeRecord.startDate).format("MMM DD, YYYY")} - {moment(activeRecord.endDate).format("MMM DD, YYYY")}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Laptop sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
                        <Box>
                          <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY }}>Training Mode</Typography>
                          <Typography sx={{ ...FS, fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>
                            {(activeRecord as any).mode || "Standard Online / Classroom"}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <School sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
                        <Box>
                          <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY }}>Attendees / User Role</Typography>
                          <Typography sx={{ ...FS, fontSize: 13, fontWeight: 600 }}>
                            {activeRecord.userRole}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Paper>

                  {(activeRecord as any).description && (
                    <Box sx={{ mt: 3 }}>
                      <Typography sx={{ ...FS, fontSize: 14, fontWeight: 800, color: COLORS.PRIMARY_NAVY, mb: 1.5 }}>
                        Batch Description
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "16px", bgcolor: "rgba(0,0,0,0.01)" }}>
                        <Typography sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_PRIMARY, lineHeight: 1.6 }}>
                          {(activeRecord as any).description}
                        </Typography>
                      </Paper>
                    </Box>
                  )}
                </Grid>

                {/* Right side: Questions checklist */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={{ ...FS, fontSize: 15, fontWeight: 800, mb: 2, color: COLORS.PRIMARY_NAVY, display: "flex", alignItems: "center", gap: 1 }}>
                    <QuestionAnswer sx={{ fontSize: 18 }} /> Evaluation Questions
                  </Typography>

                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "16px", bgcolor: "rgba(0,0,0,0.01)", maxHeight: 320, overflowY: "auto" }}>
                    {((activeRecord as any).questions && (activeRecord as any).questions.length > 0) ? (
                      <Stack spacing={2}>
                        {(activeRecord as any).questions.map((q: any, idx: number) => (
                          <Box key={q.id || idx} sx={{ p: 1.5, bgcolor: COLORS.WHITE, borderRadius: "8px", border: "1px solid rgba(0,0,0,0.04)" }}>
                            <Typography sx={{ ...FS, fontSize: 13, fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>
                              Q{idx + 1}: {q.question}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                              <Chip 
                                label={q.type || "Text Input"} 
                                size="small" 
                                sx={{ bgcolor: "rgba(0,0,0,0.04)", fontSize: 9, height: 18, fontWeight: 600 }} 
                              />
                              {q.required && (
                                <Chip 
                                  label="Required" 
                                  size="small" 
                                  sx={{ bgcolor: alpha(COLORS.ERROR, 0.05), color: COLORS.ERROR, border: `1px solid ${alpha(COLORS.ERROR, 0.2)}`, fontSize: 9, height: 18, fontWeight: 600 }} 
                                />
                              )}
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Stack sx={{ py: 4, alignItems: "center", justifyContent: "center" }} spacing={1}>
                        <QuestionAnswer sx={{ fontSize: 32, color: alpha(COLORS.PRIMARY_NAVY, 0.15) }} />
                        <Typography sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY, textAlign: "center" }}>
                          No admission or evaluation questions configured.
                        </Typography>
                      </Stack>
                    )}
                  </Paper>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4, borderStyle: "dashed" }} />

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button 
                  onClick={() => { setOpenDetailsModal(false); setActiveRecord(null); }}
                  variant="outlined"
                  sx={{ borderRadius: "12px", textTransform: "none", px: 4, color: COLORS.TEXT_SECONDARY, borderColor: "rgba(0,0,0,0.1)" }}
                >
                  Close details
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default BatchesManagement;
