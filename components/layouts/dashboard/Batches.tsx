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
  Pagination as MuiPagination,
  MenuItem,
} from "@mui/material";
import {
  Search,
  Add,
  Delete,
  Refresh,
  Edit,
  BatchPrediction,
  CalendarMonth,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { COLORS, FONT_SIZE, CATEGORY } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import { useBatches } from "@/hooks/common/useBatches";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const validationSchema = Yup.object({
  name: Yup.string().required("Batch name is required"),
  startDate: Yup.string().required("Start date is required"),
  endDate: Yup.string().required("End date is required"),
  category: Yup.string().oneOf(Object.values(CATEGORY)).required("Category is required"),
});

const FS = { fontFamily: poppins.style.fontFamily };

const BatchesManagement = () => {
  const { batches, loading, creating, updating, pagination, createBatch, updateBatch, deleteBatch, fetchBatches, goToPage } = useBatches();
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  const formik = useFormik({
    initialValues: { 
      name: "", 
      startDate: null, 
      endDate: null, 
      category: CATEGORY.RESEARCH 
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        ...values,
        startDate: values.startDate ? dayjs(values.startDate).toISOString() : "",
        endDate: values.endDate ? dayjs(values.endDate).toISOString() : "",
      };

      let success = false;
      if (selectedBatch) {
        success = await updateBatch(selectedBatch.id, payload as any);
      } else {
        success = await createBatch(payload as any);
      }

      if (success) {
        resetForm();
        setOpenDialog(false);
        setSelectedBatch(null);
      }
    },
  });

  const handleEdit = (batch: any) => {
    setSelectedBatch(batch);
    formik.setValues({
      name: batch.name,
      startDate: dayjs(batch.startDate) as any,
      endDate: dayjs(batch.endDate) as any,
      category: batch.category as CATEGORY,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBatch(null);
    formik.resetForm();
  };

  const filtered = batches.filter((b) =>
    b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Box>
          <Typography variant="h4" sx={{ ...FS, fontWeight: 700, color: COLORS.BLACK }}>
            Batch Management
          </Typography>
          <Typography variant="body1" sx={{ ...FS, color: COLORS.TEXT_SECONDARY, mt: 0.5 }}>
            Manage training batches, schedules and categories.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <IconButton
            onClick={() => fetchBatches(pagination.page, pagination.limit)}
            sx={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: "12px" }}
          >
            <Refresh />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setSelectedBatch(null);
              formik.resetForm();
              setOpenDialog(true);
            }}
            sx={{
              backgroundColor: COLORS.PRIMARY_NAVY,
              borderRadius: "10px",
              textTransform: "none",
              ...FS,
              px: 3,
              "&:hover": { backgroundColor: COLORS.SECONDARY_NAVY },
            }}
          >
            Create Batch
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "Total Batches", value: pagination.total, color: COLORS.PRIMARY_NAVY, icon: <BatchPrediction /> },
          { label: "Active Training", value: batches.filter(b => b.isActive).length, color: "#4CAF50", icon: <CalendarMonth /> },
          { label: "Categories", value: Object.keys(CATEGORY).length, color: COLORS.ACCENT_TAN, icon: <CategoryIcon /> },
        ].map((stat, i) => (
          <Grid key={i} size={{ xs: 12, sm: 4 }}>
            <Card
              sx={{
                p: 3,
                borderRadius: "20px",
                boxShadow: "0px 10px 20px rgba(0,0,0,0.03)",
                border: "1px solid rgba(0,0,0,0.03)",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: `${stat.color}18`,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </Box>
              <Box>
                <Typography sx={{ ...FS, fontSize: FONT_SIZE.FS12, color: COLORS.TEXT_SECONDARY, fontWeight: 500 }}>
                  {stat.label}
                </Typography>
                <Typography sx={{ ...FS, fontSize: FONT_SIZE.FS28, fontWeight: 700, color: COLORS.BLACK }}>
                  {loading ? <Skeleton width={40} /> : stat.value}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Table */}
      <Card sx={{ p: 0, borderRadius: "20px", boxShadow: "0px 10px 20px rgba(0,0,0,0.03)", overflow: "hidden" }}>
        <Box sx={{ p: 3, display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            placeholder="Search batches..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 300 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: COLORS.TEXT_SECONDARY }} />
                  </InputAdornment>
                ),
                style: { borderRadius: "10px", fontFamily: poppins.style.fontFamily },
              },
            }}
          />
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
              <TableRow>
                {["#", "Batch Name", "Category", "Start Date", "End Date", "Status", "Actions"].map((h, i) => (
                  <TableCell
                    key={h}
                    align={i === 6 ? "right" : "left"}
                    sx={{ fontWeight: 700, ...FS, fontSize: FONT_SIZE.FS14 }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <BatchPrediction sx={{ fontSize: 48, color: "rgba(0,0,0,0.1)", mb: 1 }} />
                    <Typography sx={{ ...FS, color: COLORS.TEXT_SECONDARY }}>
                      No batches found. Create your first batch.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row, idx) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ ...FS, color: COLORS.TEXT_SECONDARY, fontSize: FONT_SIZE.FS14 }}>
                      {(pagination.page - 1) * pagination.limit + idx + 1}
                    </TableCell>
                    <TableCell sx={{ ...FS, fontWeight: 600, fontSize: FONT_SIZE.FS14 }}>
                      {row.name}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.category}
                        size="small"
                        sx={{
                          ...FS,
                          fontWeight: 700,
                          backgroundColor: 
                            row.category === CATEGORY.RESEARCH ? "rgba(99, 102, 241, 0.1)" :
                            row.category === CATEGORY.INNOVATION ? "rgba(245, 158, 11, 0.1)" : "rgba(16, 185, 129, 0.1)",
                          color: 
                            row.category === CATEGORY.RESEARCH ? "#6366F1" :
                            row.category === CATEGORY.INNOVATION ? "#F59E0B" : "#10B981",
                          fontSize: FONT_SIZE.FS11,
                          borderRadius: "6px"
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ ...FS, color: COLORS.TEXT_SECONDARY, fontSize: FONT_SIZE.FS14 }}>
                      {dayjs(row.startDate).format("DD MMM, YYYY")}
                    </TableCell>
                    <TableCell sx={{ ...FS, color: COLORS.TEXT_SECONDARY, fontSize: FONT_SIZE.FS14 }}>
                      {dayjs(row.endDate).format("DD MMM, YYYY")}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.isActive ? "Active" : "Inactive"}
                        size="small"
                        sx={{
                          ...FS,
                          fontWeight: 600,
                          backgroundColor: row.isActive ? "rgba(76, 175, 80, 0.12)" : "rgba(0,0,0,0.06)",
                          color: row.isActive ? "#4CAF50" : COLORS.TEXT_SECONDARY,
                          fontSize: FONT_SIZE.FS11,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(row)}
                        sx={{ color: COLORS.PRIMARY_NAVY, mr: 1 }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => deleteBatch(row.id)}
                        sx={{ color: COLORS.ERROR }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <MuiPagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={(_, page) => goToPage(page)}
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  fontFamily: poppins.style.fontFamily,
                  fontWeight: 500,
                },
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: COLORS.PRIMARY_NAVY,
                  color: "white",
                  "&:hover": { backgroundColor: COLORS.SECONDARY_NAVY },
                },
              }}
            />
          </Box>
        )}
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: "20px", p: 1 } },
        }}
      >
        <DialogTitle sx={{ ...FS, fontWeight: 700, fontSize: 20, pb: 1 }}>
          {selectedBatch ? "Edit Batch" : "Create New Batch"}
        </DialogTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 2 }}>
            <TextField
              label="Batch Name"
              name="name"
              fullWidth
              placeholder="e.g. Summer Research 2024"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", fontFamily: poppins.style.fontFamily } }}
            />

            <TextField
              select
              label="Category"
              name="category"
              fullWidth
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.category && Boolean(formik.errors.category)}
              helperText={formik.touched.category && formik.errors.category}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", fontFamily: poppins.style.fontFamily } }}
            >
              {Object.values(CATEGORY).map((option) => (
                <MenuItem key={option} value={option} sx={FS}>
                  {option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()}
                </MenuItem>
              ))}
            </TextField>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <DatePicker
                  label="Start Date"
                  value={formik.values.startDate}
                  onChange={(val) => formik.setFieldValue("startDate", val)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.startDate && Boolean(formik.errors.startDate),
                      helperText: formik.touched.startDate && (formik.errors.startDate as string),
                      sx: { "& .MuiOutlinedInput-root": { borderRadius: "12px", fontFamily: poppins.style.fontFamily } }
                    }
                  }}
                />
                <DatePicker
                  label="End Date"
                  value={formik.values.endDate}
                  onChange={(val) => formik.setFieldValue("endDate", val)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.endDate && Boolean(formik.errors.endDate),
                      helperText: formik.touched.endDate && (formik.errors.endDate as string),
                      sx: { "& .MuiOutlinedInput-root": { borderRadius: "12px", fontFamily: poppins.style.fontFamily } }
                    }
                  }}
                />
              </Box>
            </LocalizationProvider>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button
              onClick={handleCloseDialog}
              sx={{ ...FS, textTransform: "none", color: COLORS.TEXT_SECONDARY, borderRadius: "10px" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={creating || updating}
              startIcon={(creating || updating) ? <CircularProgress size={16} color="inherit" /> : (selectedBatch ? <Edit /> : <Add />)}
              sx={{
                ...FS,
                textTransform: "none",
                backgroundColor: COLORS.PRIMARY_NAVY,
                borderRadius: "10px",
                px: 3,
                "&:hover": { backgroundColor: COLORS.SECONDARY_NAVY },
              }}
            >
              {creating || updating ? (selectedBatch ? "Updating..." : "Creating...") : (selectedBatch ? "Create Batch" : "Create Batch")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default BatchesManagement;
