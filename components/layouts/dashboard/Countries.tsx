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
} from "@mui/material";
import {
  Search,
  Add,
  Delete,
  Public,
  Refresh,
  Edit,
} from "@mui/icons-material";
import { COLORS, FONT_SIZE } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import { useCountries } from "@/hooks/common/useCountries";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Country name is required"),
  code: Yup.string().min(2, "Code must be at least 2 characters").required("Country code is required"),
  phoneCode: Yup.string().required("Phone code is required"),
  currencyCode: Yup.string().required("Currency code is required"),
});

const FS = { fontFamily: poppins.style.fontFamily };

const CountriesManagement = () => {
  const { countries, loading, creating, updating, pagination, createCountry, updateCountry, deleteCountry, fetchCountries, goToPage } = useCountries();
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);


  const formik = useFormik({
    initialValues: { name: "", code: "", phoneCode: "", currencyCode: "" },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      let success = false;
      if (selectedCountry) {
        success = await updateCountry(selectedCountry.id, values);
      } else {
        success = await createCountry(values);
      }

      if (success) {
        resetForm();
        setOpenDialog(false);
        setSelectedCountry(null);
      }
    },
  });

  const handleEdit = (country: any) => {
    setSelectedCountry(country);
    formik.setValues({
      name: country.name,
      code: country.code,
      phoneCode: country.phoneCode,
      currencyCode: country.currencyCode,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCountry(null);
    formik.resetForm();
  };


  const filtered = countries.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Box>
          <Typography variant="h4" sx={{ ...FS, fontWeight: 700, color: COLORS.BLACK }}>
            Country Management
          </Typography>
          <Typography variant="body1" sx={{ ...FS, color: COLORS.TEXT_SECONDARY, mt: 0.5 }}>
            Manage all countries available on the platform.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <IconButton
            onClick={() => fetchCountries(pagination.page, pagination.limit)}
            sx={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: "12px" }}
          >
            <Refresh />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setSelectedCountry(null);
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
            Add Country
          </Button>

        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "Total Countries", value: pagination.total, color: COLORS.PRIMARY_NAVY },
          { label: "Total Pages", value: pagination.totalPages, color: "#4CAF50" },
          { label: "Currency Types", value: new Set(countries.map((c) => c.currencyCode)).size, color: COLORS.ACCENT_TAN },
        ].map((stat, i) => (
          <Grid item xs={12} sm={4} key={i}>
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
                <Public />
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
            placeholder="Search countries..."
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
          <Typography sx={{ ...FS, fontSize: FONT_SIZE.FS14, color: COLORS.TEXT_SECONDARY, ml: "auto" }}>
            {pagination.total} total countries
          </Typography>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
              <TableRow>
                {["#", "Name", "Code", "Phone Code", "Currency", "Actions"].map((h, i) => (
                  <TableCell
                    key={h}
                    align={i === 5 ? "right" : "left"}
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
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Public sx={{ fontSize: 48, color: "rgba(0,0,0,0.1)", mb: 1 }} />
                    <Typography sx={{ ...FS, color: COLORS.TEXT_SECONDARY }}>
                      No countries found. Add your first country.
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
                        label={row.code}
                        size="small"
                        sx={{
                          ...FS,
                          fontWeight: 700,
                          backgroundColor: "rgba(11,23,39,0.08)",
                          color: COLORS.PRIMARY_NAVY,
                          fontSize: FONT_SIZE.FS12,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ ...FS, color: COLORS.TEXT_SECONDARY, fontSize: FONT_SIZE.FS14 }}>
                      {row.phoneCode}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.currencyCode}
                        size="small"
                        sx={{
                          ...FS,
                          fontWeight: 600,
                          backgroundColor: "rgba(209,160,84,0.12)",
                          color: COLORS.ACCENT_TAN,
                          fontSize: FONT_SIZE.FS12,
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
                        onClick={() => deleteCountry(row.id)}
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
            <Pagination
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

      {/* Create Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "20px", p: 1 },
        }}
      >
        <DialogTitle sx={{ ...FS, fontWeight: 700, fontSize: 20, pb: 1 }}>
          {selectedCountry ? "Edit Country" : "Add New Country"}
        </DialogTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 2 }}>
            <TextField
              label="Country Name"
              name="name"
              fullWidth
              placeholder="e.g. South Korea"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", fontFamily: poppins.style.fontFamily } }}
            />
            <TextField
              label="Country Code"
              name="code"
              fullWidth
              placeholder="e.g. KR"
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.code && Boolean(formik.errors.code)}
              helperText={formik.touched.code && formik.errors.code}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", fontFamily: poppins.style.fontFamily } }}
            />
            <TextField
              label="Phone Code"
              name="phoneCode"
              fullWidth
              placeholder="e.g. +82"
              value={formik.values.phoneCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phoneCode && Boolean(formik.errors.phoneCode)}
              helperText={formik.touched.phoneCode && formik.errors.phoneCode}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", fontFamily: poppins.style.fontFamily } }}
            />
            <TextField
              label="Currency Code"
              name="currencyCode"
              fullWidth
              placeholder="e.g. KRW"
              value={formik.values.currencyCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.currencyCode && Boolean(formik.errors.currencyCode)}
              helperText={formik.touched.currencyCode && formik.errors.currencyCode}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", fontFamily: poppins.style.fontFamily } }}
            />
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
              startIcon={(creating || updating) ? <CircularProgress size={16} color="inherit" /> : (selectedCountry ? <Edit /> : <Add />)}
              sx={{
                ...FS,
                textTransform: "none",
                backgroundColor: COLORS.PRIMARY_NAVY,
                borderRadius: "10px",
                px: 3,
                "&:hover": { backgroundColor: COLORS.SECONDARY_NAVY },
              }}
            >
              {creating || updating ? (selectedCountry ? "Updating..." : "Creating...") : (selectedCountry ? "Update Country" : "Create Country")}
            </Button>
          </DialogActions>

        </form>
      </Dialog>
    </Box>
  );
};

export default CountriesManagement;
