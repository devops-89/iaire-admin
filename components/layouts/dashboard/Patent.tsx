"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  Skeleton,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Search,
  Description,
  Gavel,
  CheckCircle,
  HourglassEmpty,
  Person,
  CalendarToday,
  Assignment,
  Refresh,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { poppins } from "@/utils/fonts";
import { COLORS, PATENT_STATUS } from "@/utils/enum";
import { usePatents } from "@/hooks/common/usePatents";
import { Patent, CREATE_PATENT_REQUEST } from "@/utils/type";

const FS = { fontFamily: poppins.style.fontFamily };

const formatLabel = (str: string) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const PatentManagement = () => {
  const {
    patents,
    loading,
    creating,
    updating,
    pagination,
    createPatent,
    updatePatent,
    deletePatent,
    fetchPatents,
    goToPage,
  } = usePatents();

  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatent, setSelectedPatent] = useState<Patent | null>(null);

  const filtered = patents.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.patentNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.inventors.toLowerCase().includes(search.toLowerCase())
  );

  // Stats calculation
  const stats = [
    { label: "Total Patents", value: pagination.total, icon: <Description />, color: COLORS.PRIMARY_NAVY },
    { label: "Granted", value: patents.filter(p => p.status === "GRANTED").length, icon: <CheckCircle />, color: COLORS.SUCCESS },
    { label: "Pending", value: patents.filter(p => p.status === "PENDING").length, icon: <HourglassEmpty />, color: COLORS.WARNING },
    { label: "Under Review", value: patents.filter(p => p.status === "UNDER_REVIEW").length, icon: <Gavel />, color: COLORS.INFO },
  ];

  const handleOpenDialog = (patent?: Patent) => {
    if (patent) {
      setSelectedPatent(patent);
      formik.setValues({
        title: patent.title,
        patentNumber: patent.patentNumber,
        inventors: patent.inventors,
        filingDate: patent.filingDate,
        status: patent.status,
        description: patent.description,
      });
    } else {
      setSelectedPatent(null);
      formik.resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatent(null);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      patentNumber: "",
      inventors: "",
      filingDate: "",
      status: PATENT_STATUS.PENDING,
      description: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      patentNumber: Yup.string().required("Patent number is required"),
      inventors: Yup.string().required("Inventors are required"),
      filingDate: Yup.string().required("Filing date is required"),
      status: Yup.string().required("Status is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values) => {
      let success;
      if (selectedPatent) {
        success = await updatePatent(selectedPatent.id, values);
      } else {
        success = await createPatent(values);
      }
      if (success) handleCloseDialog();
    },
  });

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 6, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Box>
          <Typography variant="h4" sx={{ ...FS, fontWeight: 800, color: COLORS.PRIMARY_NAVY, mb: 1 }}>
            Patent Management
          </Typography>
          <Typography variant="body1" sx={{ ...FS, color: COLORS.TEXT_SECONDARY, maxWidth: "600px" }}>
            Track and manage intellectual property, filing dates, and current statuses for institutional innovations.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton 
            onClick={() => fetchPatents(pagination.page)} 
            sx={{ 
              backgroundColor: "white", 
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              "&:hover": { backgroundColor: "#f0f0f0" }
            }}
          >
            <Refresh />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              ...FS,
              textTransform: "none",
              backgroundColor: COLORS.PRIMARY_NAVY,
              borderRadius: "14px",
              px: 4,
              py: 1.5,
              fontWeight: 700,
              boxShadow: "0 8px 20px rgba(11, 23, 39, 0.2)",
              "&:hover": { backgroundColor: COLORS.SECONDARY_NAVY },
            }}
          >
            New Patent Filing
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {stats.map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ 
              p: 3, 
              borderRadius: "24px", 
              boxShadow: "0px 10px 30px rgba(0,0,0,0.03)", 
              border: "1px solid rgba(0,0,0,0.05)",
              background: "white",
              display: "flex",
              alignItems: "center",
              gap: 2
            }}>
              <Box sx={{ 
                width: 56, 
                height: 56, 
                borderRadius: "16px", 
                backgroundColor: `${item.color}15`, 
                color: item.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {item.icon}
              </Box>
              <Box>
                <Typography sx={{ ...FS, fontSize: 24, fontWeight: 800, color: COLORS.PRIMARY_NAVY }}>{item.value}</Typography>
                <Typography sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY, fontWeight: 500 }}>{item.label}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search by title, number or inventors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: COLORS.TEXT_SECONDARY }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "18px",
              backgroundColor: "white",
              fontFamily: poppins.style.fontFamily,
              boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
            },
          }}
        />
      </Box>

      {/* Patents Grid */}
      <Box 
        sx={{ 
          display: "grid", 
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)"
          },
          gap: 4,
          alignItems: "stretch",
          width: "100%"
        }}
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton 
              key={i}
              variant="rectangular" 
              height={320} 
              sx={{ borderRadius: "24px", width: "100%" }} 
            />
          ))
        ) : filtered.length === 0 ? (
          <Box sx={{ gridColumn: "1 / -1", py: 10, textAlign: "center", backgroundColor: "rgba(255,255,255,0.5)", borderRadius: "24px" }}>
            <Assignment sx={{ fontSize: 64, color: "rgba(0,0,0,0.1)", mb: 2 }} />
            <Typography variant="h6" sx={{ ...FS, color: COLORS.TEXT_SECONDARY }}>
              No patents found matching your search.
            </Typography>
          </Box>
        ) : (
          filtered.map((patent) => (
            <Card
              key={patent.id}
              sx={{
                borderRadius: "24px",
                p: 0,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "all 0.3s ease",
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0px 10px 30px rgba(0,0,0,0.03)",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0px 20px 40px rgba(0,0,0,0.08)",
                },
              }}
            >
              {/* Card Header with Status */}
              <Box sx={{ p: 3, pb: 0, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Chip
                  label={formatLabel(patent.status)}
                  size="small"
                  sx={{
                    ...FS,
                    fontWeight: 700,
                    backgroundColor: 
                      patent.status === "GRANTED" ? "rgba(76,175,80,0.1)" :
                      patent.status === "PENDING" ? "rgba(255,152,0,0.1)" :
                      "rgba(33,150,243,0.1)",
                    color: 
                      patent.status === "GRANTED" ? COLORS.SUCCESS :
                      patent.status === "PENDING" ? COLORS.WARNING :
                      COLORS.INFO,
                    borderRadius: "8px",
                  }}
                />
                <Box>
                  <IconButton size="small" onClick={() => handleOpenDialog(patent)} sx={{ color: COLORS.PRIMARY_NAVY }}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => deletePatent(patent.id)} sx={{ color: COLORS.ERROR }}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* Patent Info */}
              <Box sx={{ p: 3, pt: 2, flexGrow: 1 }}>
                <Typography variant="h6" sx={{ ...FS, fontWeight: 800, mb: 0.5, color: COLORS.PRIMARY_NAVY, lineHeight: 1.3 }}>
                  {patent.title}
                </Typography>
                <Typography variant="caption" sx={{ ...FS, color: COLORS.TEXT_SECONDARY, mb: 3, display: "block", fontWeight: 600 }}>
                  ID: {patent.patentNumber}
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: "8px", backgroundColor: "rgba(11, 23, 39, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.PRIMARY_NAVY }}>
                      <Person sx={{ fontSize: 18 }} />
                    </Box>
                    <Typography variant="body2" sx={{ ...FS, fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>
                      {patent.inventors}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: "8px", backgroundColor: "rgba(11, 23, 39, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.PRIMARY_NAVY }}>
                      <CalendarToday sx={{ fontSize: 18 }} />
                    </Box>
                    <Typography variant="body2" sx={{ ...FS, fontWeight: 500 }}>
                      Filed: <span style={{ color: COLORS.PRIMARY_NAVY, fontWeight: 700 }}>{new Date(patent.filingDate).toLocaleDateString()}</span>
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Footer Decor */}
              <Box sx={{ height: 6, width: "100%", backgroundColor: COLORS.PRIMARY_NAVY, opacity: 0.1 }} />
            </Card>
          ))
        )}
      </Box>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
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
              },
            }}
          />
        </Box>
      )}

      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "24px", p: 1 } }}
      >
        <DialogTitle sx={{ ...FS, fontWeight: 800, fontSize: 24 }}>
          {selectedPatent ? "Edit Patent Filing" : "New Patent Filing"}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="title"
                  label="Patent Title"
                  placeholder="Enter patent title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="patentNumber"
                  label="Patent/Filing Number"
                  placeholder="Enter filing number"
                  value={formik.values.patentNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.patentNumber && Boolean(formik.errors.patentNumber)}
                  helperText={formik.touched.patentNumber && formik.errors.patentNumber}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="filingDate"
                  label="Filing Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formik.values.filingDate}
                  onChange={formik.handleChange}
                  error={formik.touched.filingDate && Boolean(formik.errors.filingDate)}
                  helperText={formik.touched.filingDate && formik.errors.filingDate}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="inventors"
                  label="Inventors (comma separated)"
                  placeholder="Enter inventors names"
                  value={formik.values.inventors}
                  onChange={formik.handleChange}
                  error={formik.touched.inventors && Boolean(formik.errors.inventors)}
                  helperText={formik.touched.inventors && formik.errors.inventors}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formik.values.status}
                    label="Status"
                    onChange={formik.handleChange}
                  >
                    {Object.values(PATENT_STATUS).map((s) => (
                      <MenuItem key={s} value={s}>{formatLabel(s)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="description"
                  label="Description"
                  multiline
                  rows={3}
                  placeholder="Briefly describe the innovation..."
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 4, gap: 1.5 }}>
            <Button onClick={handleCloseDialog} sx={{ ...FS, textTransform: "none", color: COLORS.TEXT_SECONDARY, fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={creating || updating}
              startIcon={(creating || updating) ? <CircularProgress size={18} color="inherit" /> : <CheckCircle />}
              sx={{
                ...FS,
                textTransform: "none",
                backgroundColor: COLORS.PRIMARY_NAVY,
                borderRadius: "12px",
                px: 4,
                fontWeight: 700,
                boxShadow: "0 8px 20px rgba(11, 23, 39, 0.2)",
                "&:hover": { backgroundColor: COLORS.SECONDARY_NAVY },
              }}
            >
              {creating || updating ? "Saving..." : (selectedPatent ? "Update Patent" : "Register Patent")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default PatentManagement;
