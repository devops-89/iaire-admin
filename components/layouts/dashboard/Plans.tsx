"use client";

import { useCountries } from "@/hooks/country/getCountries";
import AddPlan from "@/modals/AddPlan";
import { useModal } from "@/store/useModal";
import { CURRENCIES, PLAN_TABLE_HEADER } from "@/utils/constant";
import { COLORS } from "@/utils/enum";
import { poppins, roboto } from "@/utils/fonts";
import {
  Add,
  MoreVert,
  Search,
  Visibility,
  Info,
  CalendarMonth,
  Public,
  Group,
  CardMembership,
  CheckCircle,
  Cancel,
  Close,
} from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputBase,
  Typography,
  Select,
  MenuItem,
  TablePagination,
  Tabs,
  Tab,
  alpha,
  Menu,
  Dialog,
  DialogContent,
  Divider,
  Paper,
  Stack,
  Chip,
  Skeleton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { usePlansList } from "@/hooks/common/usePlans";
import { PlanListItem } from "@/utils/type";
import dayjs from "dayjs";

const FS = { fontFamily: poppins.style.fontFamily };
const STATUS_TABS = [
  { label: "All Plans", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];
const PlansManagement = () => {
  const { planList, planLoading, updatePlan, fetchPlans } = usePlansList();
  const { showModal } = useModal();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("All");
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeRecord, setActiveRecord] = useState<PlanListItem | null>(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const { countryData } = useCountries({
    page: 1,
    limit: 100,
    search: "",
    status: true,
  });

  const handleCreate = () => {
    showModal(<AddPlan onSuccess={() => fetchPlans()} />);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, record: PlanListItem) => {
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

  const getBenefitLabel = (key: string) => {
    switch (key) {
      case "MAX_TEACHERS": return "Max Mentors/Teachers Limit";
      case "MAX_STUDENTS": return "Max Students Limit";
      case "APPROVE_NOMINEE_TEACHERS": return "Approve Self Nominated Teachers";
      case "MAX_SELF_NOMINATION_TEACHER": return "Self Nomination Limit";
      case "MAX_INNOVATION_SUBMISSIONS": return "Innovation Submissions Limit";
      case "MAX_RESEARCH_SUBMISSIONS": return "Research Submissions Limit";
      default: return key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()).replace(/Techer/g, 'Teacher');
    }
  };

  // Client-side filtering
  const filteredPlans = (planList?.data || []).filter((item: PlanListItem) => {
    if (activeTab === "Active" && !item.isActive) return false;
    if (activeTab === "Inactive" && item.isActive) return false;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const nameMatch = item.name?.toLowerCase().includes(search);
      const targetMatch = item.target?.toLowerCase().includes(search);
      const priceMatch = String(item.price).includes(search);
      if (!nameMatch && !targetMatch && !priceMatch) return false;
    }

    if (selectedCountry && item.country?.id !== selectedCountry.id) {
      return false;
    }

    return true;
  });

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
            Membership Plans
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: poppins.style.fontFamily,
              color: COLORS.TEXT_SECONDARY,
              mt: 0.5,
            }}
          >
            Create, configure, and monitor subscription pricing and limits for students, mentors, and schools.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
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
          Create Plan
        </Button>
      </Box>

      {/* Filter controls row */}
      <Grid container spacing={2} sx={{ alignItems: "center" }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Autocomplete
            options={countryData || []}
            getOptionLabel={(option: any) => option.name || ""}
            value={selectedCountry}
            onChange={(event, newValue) => setSelectedCountry(newValue)}
            renderInput={(params) => {
              const inputProps = (params as any).InputProps || {};
              return (
                <TextField 
                  {...params} 
                  label="Filter by Country" 
                  slotProps={{
                    input: {
                      ...inputProps,
                      startAdornment: (
                        <>
                          <Public sx={{ color: COLORS.TEXT_SECONDARY, mr: 1, fontSize: 20 }} />
                          {inputProps.startAdornment}
                        </>
                      )
                    }
                  }}
                />
              );
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
              }
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: COLORS.INPUT_BG,
              borderRadius: "14px",
              px: 2,
              py: 0.8,
              border: "1px solid rgba(0,0,0,0.03)",
            }}
          >
            <Search sx={{ color: COLORS.TEXT_SECONDARY, mr: 1, fontSize: 20 }} />
            <InputBase
              placeholder="Search by plan name or target group..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                fontFamily: poppins.style.fontFamily,
                fontSize: "0.9rem",
                width: "100%",
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Plans list card */}
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
            Total Plans: <strong style={{ color: COLORS.PRIMARY_NAVY }}>{filteredPlans.length}</strong>
          </Typography>
        </Box>

        <TableContainer sx={{ minWidth: 900 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "rgba(11, 23, 39, 0.02)" }}>
              <TableRow>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY, pl: 4 }}>ID</TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Plan Name</TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Price & Country</TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Billing Cycle</TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Target Group</TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Status</TableCell>
                <TableCell align="right" sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY, pr: 4 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {planLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ pl: 4 }}><Skeleton width="40px" height="24px" /></TableCell>
                    <TableCell><Skeleton width="150px" height="24px" /></TableCell>
                    <TableCell><Skeleton width="120px" height="20px" /></TableCell>
                    <TableCell><Skeleton width="100px" height="20px" /></TableCell>
                    <TableCell><Skeleton width="100px" height="20px" /></TableCell>
                    <TableCell><Skeleton width="80px" height="32px" /></TableCell>
                    <TableCell align="right" sx={{ pr: 4 }}><Skeleton variant="circular" width={30} height={30} sx={{ ml: "auto" }} /></TableCell>
                  </TableRow>
                ))
              ) : filteredPlans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Stack spacing={1} sx={{ alignItems: "center", justifyContent: "center" }}>
                      <CardMembership sx={{ fontSize: 48, color: alpha(COLORS.PRIMARY_NAVY, 0.2), mb: 1 }} />
                      <Typography sx={{ ...FS, fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>
                        No Membership Plans Found
                      </Typography>
                      <Typography sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY }}>
                        Try refining your search or add a new plan using the button above.
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlans.map((row) => (
                  <TableRow key={row.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell sx={{ ...FS, pl: 4, fontWeight: 600 }}>{row.id}</TableCell>
                    <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>{row.name}</TableCell>
                    <TableCell>
                      <Typography sx={{ ...FS, fontWeight: 600, fontSize: 14 }}>
                        {CURRENCIES.find((item) => item?.code === row.currency)?.symbol || row.currency}
                        {row.price}
                      </Typography>
                      <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                        {row.country?.name || "Global"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ ...FS, textTransform: "capitalize", fontWeight: 500 }}>{row.billingCycle.toLowerCase()}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.target === "SCHOOL_ADMIN" ? "Institution" : row.target === "TEACHER" ? "Mentor" : row.target}
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
                      <Select
                        size="small"
                        value={row.isActive ? "ACTIVE" : "INACTIVE"}
                        disabled={updatingId === row.id}
                        onChange={async (e) => {
                          const newStatus = e.target.value === "ACTIVE";
                          setUpdatingId(row.id);
                          const success = await updatePlan(row.id, {
                            isActive: newStatus,
                          });
                          if (success) {
                            await fetchPlans(
                              planList?.pagination?.page,
                              planList?.pagination?.limit,
                            );
                          }
                          setUpdatingId(null);
                        }}
                        sx={{
                          height: 32,
                          fontSize: 12,
                          fontFamily: poppins.style.fontFamily,
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          bgcolor: row.isActive
                            ? alpha(COLORS.SUCCESS, 0.1)
                            : alpha(COLORS.ERROR, 0.1),
                          color: row.isActive ? COLORS.SUCCESS : COLORS.ERROR,
                          fontWeight: 700,
                          borderRadius: "8px",
                          px: 1,
                        }}
                      >
                        <MenuItem value="ACTIVE" sx={{ ...FS, fontSize: 13, fontWeight: 600, color: COLORS.SUCCESS }}>
                          Active
                        </MenuItem>
                        <MenuItem value="INACTIVE" sx={{ ...FS, fontSize: 13, fontWeight: 600, color: COLORS.ERROR }}>
                          Inactive
                        </MenuItem>
                      </Select>
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
          count={planList?.pagination?.total ?? 0}
          page={(planList?.pagination?.page ?? 1) - 1}
          rowsPerPage={planList?.pagination?.limit ?? 10}
          onPageChange={(_, newPage) => {
            fetchPlans(newPage + 1, planList?.pagination?.limit);
          }}
          onRowsPerPageChange={(event) => {
            fetchPlans(1, parseInt(event.target.value, 10));
          }}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
        />
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
            "&:hover": { bgcolor: "rgba(11, 23, 39, 0.04)" }
          }}
        >
          <Visibility sx={{ fontSize: 20, color: COLORS.TEXT_SECONDARY }} />
          View Details
        </MenuItem>
      </Menu>

      {/* Plan Details Dialog */}
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openDetailsModal}
        onClose={() => { setOpenDetailsModal(false); setActiveRecord(null); }}
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
        {activeRecord && (
          <Box>
            {/* Header Banner */}
            <Box sx={{ p: 4, bgcolor: COLORS.PRIMARY_NAVY, color: "white", position: "relative" }}>
              <IconButton
                onClick={() => { setOpenDetailsModal(false); setActiveRecord(null); }}
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,     
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                  },
                }}
              >
                <Close sx={{ fontSize: 20 }} />
              </IconButton>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3, pr: 4 }}>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    bgcolor: "rgba(255,255,255,0.2)", 
                    color: "white",
                    borderRadius: "16px",
                  }}
                >
                  <CardMembership sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography sx={{ ...FS, fontSize: 20, fontWeight: 800 }}>
                    {activeRecord.name}
                  </Typography>
                  <Typography sx={{ ...FS, fontSize: 13, color: "rgba(255,255,255,0.8)", mt: 0.5 }}>
                    Plan Target: {activeRecord.target === "SCHOOL_ADMIN" ? "School / Institution" : activeRecord.target === "TEACHER" ? "Mentor / Teacher" : activeRecord.target}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Details Content */}
            <Box sx={{ p: 4 }}>
              <Grid container spacing={3}>
                {/* Details grid items */}
                <Grid size={{ xs: 6 }}>
                  <Box>
                    <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY, fontWeight: 500 }}>Pricing Rate</Typography>
                    <Typography sx={{ ...FS, fontSize: 16, fontWeight: 800, color: COLORS.PRIMARY_NAVY, mt: 0.5 }}>
                      {CURRENCIES.find((item) => item?.code === activeRecord.currency)?.symbol || activeRecord.currency}
                      {activeRecord.price}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box>
                    <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY, fontWeight: 500 }}>Billing Frequency</Typography>
                    <Typography sx={{ ...FS, fontSize: 15, fontWeight: 700, textTransform: "capitalize", mt: 0.5 }}>
                      {activeRecord.billingCycle.toLowerCase()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box>
                    <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY, fontWeight: 500 }}>Country Code</Typography>
                    <Typography sx={{ ...FS, fontSize: 15, fontWeight: 700, mt: 0.5 }}>
                      {activeRecord.country?.name || "Global"} ({activeRecord.country?.code || "N/A"})
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box>
                    <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY, fontWeight: 500 }}>Status Mode</Typography>
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", mt: 0.5 }}>
                      {activeRecord.isActive ? (
                        <>
                          <CheckCircle sx={{ color: COLORS.SUCCESS, fontSize: 16 }} />
                          <Typography sx={{ ...FS, fontSize: 13, fontWeight: 700, color: COLORS.SUCCESS }}>Active Plan</Typography>
                        </>
                      ) : (
                        <>
                          <Cancel sx={{ color: COLORS.ERROR, fontSize: 16 }} />
                          <Typography sx={{ ...FS, fontSize: 13, fontWeight: 700, color: COLORS.ERROR }}>Inactive Plan</Typography>
                        </>
                      )}
                    </Stack>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Plan Limits/Benefits */}
              <Box>
                <Typography sx={{ ...FS, fontSize: 14, fontWeight: 800, color: COLORS.PRIMARY_NAVY, mb: 2 }}>
                  Membership Allocations & Limits
                </Typography>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "16px", bgcolor: "rgba(0,0,0,0.01)" }}>
                  <Stack spacing={1.5}>
                    {/* Render specific custom limits from record if available, or fall back to general schema representation */}
                    {(activeRecord as any).limits && (activeRecord as any).limits.length > 0 ? (
                      (activeRecord as any).limits.map((limit: any, index: number) => {
                        const isCustomPoint = limit.value === "yes" || limit.value === "true" || limit.value === "0" || !limit.value;
                        return (
                          <Box key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.5, borderBottom: "1px dashed rgba(0,0,0,0.05)" }}>
                            <Typography sx={{ ...FS, fontSize: 13, fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>
                              {getBenefitLabel(limit.key)}
                            </Typography>
                            {!isCustomPoint ? (
                              <Typography sx={{ ...FS, fontSize: 13, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>
                                {limit.value}
                              </Typography>
                            ) : (
                              <CheckCircle sx={{ color: COLORS.SUCCESS, fontSize: 16 }} />
                            )}
                          </Box>
                        );
                      })
                    ) : (
                      <Typography sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY, textAlign: "center", py: 2 }}>
                        No specific limits configured for this plan.
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              </Box>

              <Divider sx={{ my: 3, borderStyle: "dashed" }} />

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button 
                  onClick={() => { setOpenDetailsModal(false); setActiveRecord(null); }}
                  variant="outlined"
                  sx={{ borderRadius: "12px", textTransform: "none", px: 4, color: COLORS.TEXT_SECONDARY, borderColor: "rgba(0,0,0,0.1)" }}
                >
                  Close
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default PlansManagement;
