"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  CircularProgress,
  Skeleton,
  Pagination,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Search,
  Add,
  Delete,
  Refresh,
  Edit,
  Assignment,
  Schedule,
  Groups,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { COLORS, FONT_SIZE, PLAN_TARGET, BILLING_CYCLE } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import { usePlans } from "@/hooks/common/usePlans";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Plan name is required"),
  code: Yup.string().required("Plan code is required"),
  target: Yup.string().oneOf(Object.values(PLAN_TARGET)).required("Target is required"),
  price: Yup.number().min(0, "Price cannot be negative").required("Price is required"),
  currency: Yup.string().min(3, "Currency must be at least 3 characters").required("Currency is required"),
  billingCycle: Yup.string().oneOf(Object.values(BILLING_CYCLE)).required("Billing cycle is required"),
  trialDays: Yup.number().min(0).required("Trial days is required"),
  isActive: Yup.boolean(),
});

const FS = { fontFamily: poppins.style.fontFamily };

const formatLabel = (str: string) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const PlansManagement = () => {
  const { plans, loading, creating, updating, pagination, createPlan, updatePlan, deletePlan, fetchPlans, goToPage } = usePlans();
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      code: "",
      target: PLAN_TARGET.STUDENT,
      price: 0,
      currency: "INR",
      billingCycle: BILLING_CYCLE.MONTHLY,
      trialDays: 0,
      isActive: true,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      let success = false;
      if (selectedPlan) {
        success = await updatePlan(selectedPlan.id, values);
      } else {
        success = await createPlan(values);
      }

      if (success) {
        resetForm();
        setOpenDialog(false);
        setSelectedPlan(null);
      }
    },
  });

  const handleEdit = (plan: any) => {
    setSelectedPlan(plan);
    formik.setValues({
      name: plan.name,
      code: plan.code,
      target: plan.target,
      price: plan.price,
      currency: plan.currency,
      billingCycle: plan.billingCycle,
      trialDays: plan.trialDays,
      isActive: plan.isActive,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPlan(null);
    formik.resetForm();
  };

  const filtered = plans.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" sx={{ ...FS, fontWeight: 700, color: COLORS.BLACK }}>
            Membership Plans
          </Typography>
          <Typography variant="body1" sx={{ ...FS, color: COLORS.TEXT_SECONDARY, mt: 0.5 }}>
            Design and manage subscription plans for your community.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <TextField
            placeholder="Search plans..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 250 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: COLORS.TEXT_SECONDARY }} />
                  </InputAdornment>
                ),
                style: { borderRadius: "12px", backgroundColor: "white" },
              },
            }}
          />
          <IconButton
            onClick={() => fetchPlans(pagination.page, pagination.limit)}
            sx={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: "12px", backgroundColor: "white" }}
          >
            <Refresh />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setSelectedPlan(null);
              formik.resetForm();
              setOpenDialog(true);
            }}
            sx={{
              backgroundColor: COLORS.PRIMARY_NAVY,
              borderRadius: "12px",
              textTransform: "none",
              ...FS,
              px: 3,
              boxShadow: "0 4px 14px 0 rgba(11, 23, 39, 0.39)",
              "&:hover": { backgroundColor: COLORS.SECONDARY_NAVY },
            }}
          >
            Create Plan
          </Button>
        </Box>
      </Box>

      {/* Plans Management Table */}
      <TableContainer 
        sx={{ 
          backgroundColor: "white", 
          borderRadius: "24px", 
          boxShadow: "0px 10px 40px rgba(0,0,0,0.03)",
          border: "1px solid rgba(0,0,0,0.05)",
          overflow: "hidden"
        }}
      >
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ backgroundColor: "rgba(11, 23, 39, 0.02)" }}>
            <TableRow>
              <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Plan Details</TableCell>
              <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Target Group</TableCell>
              <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Pricing</TableCell>
              <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Trial Period</TableCell>
              <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Status</TableCell>
              <TableCell align="right" sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}><Skeleton height={60} /></TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center", py: 8 }}>
                  <Assignment sx={{ fontSize: 48, color: "rgba(0,0,0,0.1)", mb: 1 }} />
                  <Typography sx={{ ...FS, color: COLORS.TEXT_SECONDARY }}>No plans found matching your criteria.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((plan) => (
                <TableRow 
                  key={plan.id}
                  sx={{ 
                    "&:hover": { bgcolor: "rgba(11, 23, 39, 0.01)" },
                    transition: "background-color 0.2s"
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography sx={{ ...FS, fontWeight: 700, color: COLORS.BLACK }}>{plan.name}</Typography>
                      <Typography sx={{ ...FS, fontSize: 12, color: COLORS.TEXT_SECONDARY }}>{formatLabel(plan.code)}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={formatLabel(plan.target)}
                      size="small"
                      sx={{ 
                        ...FS, 
                        fontWeight: 600, 
                        bgcolor: "rgba(11, 23, 39, 0.05)", 
                        color: COLORS.PRIMARY_NAVY,
                        borderRadius: "8px"
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ ...FS, fontWeight: 800, color: COLORS.BLACK }}>
                      {plan.currency === "INR" ? "₹" : plan.currency} {plan.price}
                    </Typography>
                    <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                      per {formatLabel(plan.billingCycle)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Schedule sx={{ fontSize: 16, color: COLORS.PRIMARY_NAVY, opacity: 0.7 }} />
                      <Typography sx={{ ...FS, fontWeight: 600 }}>{plan.trialDays} Days</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: plan.isActive ? COLORS.SUCCESS : COLORS.ERROR }} />
                      <Typography sx={{ ...FS, fontWeight: 600, color: plan.isActive ? COLORS.SUCCESS : COLORS.ERROR, fontSize: 13 }}>
                        {plan.isActive ? "Active" : "Disabled"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                      <IconButton size="small" onClick={() => handleEdit(plan)} sx={{ bgcolor: "rgba(11, 23, 39, 0.03)", color: COLORS.PRIMARY_NAVY }}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => deletePlan(plan.id)} sx={{ bgcolor: "rgba(244, 67, 54, 0.03)", color: COLORS.ERROR }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>


      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6, mb: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={(_, page) => goToPage(page)}
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
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: "rgba(11, 23, 39, 0.05)",
                },
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: COLORS.PRIMARY_NAVY,
                color: "white",
                boxShadow: "0 4px 12px rgba(11, 23, 39, 0.25)",
                border: "none",
                "&:hover": { backgroundColor: COLORS.SECONDARY_NAVY },
              },
            }}
          />
        </Box>
      )}


      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: "24px", p: 1 } }
        }}
      >
        <DialogTitle sx={{ ...FS, fontWeight: 800, fontSize: 24, pb: 1 }}>
          {selectedPlan ? "Customize Plan" : "Create Subscription Plan"}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={3} sx={{ pt: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Plan Name"
                  name="name"
                  fullWidth
                  placeholder="Enter plan name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", fontFamily: poppins.style.fontFamily } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Plan Unique Code"
                  name="code"
                  fullWidth
                  placeholder="Enter plan unique code"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.code && Boolean(formik.errors.code)}
                  helperText={formik.touched.code && formik.errors.code}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", fontFamily: poppins.style.fontFamily } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}>
                  <InputLabel sx={{ ...FS }}>Target Group</InputLabel>
                  <Select
                    name="target"
                    value={formik.values.target}
                    label="Target Group"
                    onChange={formik.handleChange}
                    sx={{ ...FS }}
                  >
                    {Object.values(PLAN_TARGET).map((t) => (
                      <MenuItem key={t} value={t} sx={{ ...FS }}>{t}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}>
                  <InputLabel sx={{ ...FS }}>Billing Interval</InputLabel>
                  <Select
                    name="billingCycle"
                    value={formik.values.billingCycle}
                    label="Billing Interval"
                    onChange={formik.handleChange}
                    sx={{ ...FS }}
                  >
                    {Object.values(BILLING_CYCLE).map((c) => (
                      <MenuItem key={c} value={c} sx={{ ...FS }}>{c}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  fullWidth
                  placeholder="Enter plan price"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", fontFamily: poppins.style.fontFamily } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Currency (ISO Code)"
                  name="currency"
                  fullWidth
                  placeholder="Enter currency (e.g. INR)"
                  value={formik.values.currency}
                  onChange={formik.handleChange}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", fontFamily: poppins.style.fontFamily } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Trial Duration (Days)"
                  name="trialDays"
                  type="number"
                  fullWidth
                  placeholder="Enter trial duration"
                  value={formik.values.trialDays}
                  onChange={formik.handleChange}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", fontFamily: poppins.style.fontFamily } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2, backgroundColor: "rgba(11, 23, 39, 0.03)", borderRadius: "14px" }}>
                  <Box>
                    <Typography sx={{ ...FS, fontWeight: 600 }}>Active Status</Typography>
                    <Typography variant="caption" sx={{ ...FS, color: COLORS.TEXT_SECONDARY }}>Toggle whether this plan is currently available for subscription.</Typography>
                  </Box>
                  <Switch
                    checked={formik.values.isActive}
                    onChange={(e) => formik.setFieldValue("isActive", e.target.checked)}
                    color="primary"
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 4, gap: 1.5 }}>
            <Button
              onClick={handleCloseDialog}
              sx={{ ...FS, textTransform: "none", color: COLORS.TEXT_SECONDARY, borderRadius: "12px", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={creating || updating}
              startIcon={(creating || updating) ? <CircularProgress size={18} color="inherit" /> : (selectedPlan ? <Edit /> : <Add />)}
              sx={{
                ...FS,
                textTransform: "none",
                backgroundColor: COLORS.PRIMARY_NAVY,
                borderRadius: "12px",
                px: 4,
                fontWeight: 600,
                boxShadow: "0 4px 14px 0 rgba(11, 23, 39, 0.3)",
                "&:hover": { backgroundColor: COLORS.SECONDARY_NAVY },
              }}
            >
              {creating || updating ? "Processing..." : (selectedPlan ? "Update Plan" : "Create Plan")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default PlansManagement;
