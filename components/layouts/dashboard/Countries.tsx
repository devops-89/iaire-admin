"use client";
import React, { useState, useEffect } from "react";
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
  Chip,
  TextField,
  InputAdornment,
  Pagination as MuiPagination,
  Skeleton,
  Button,
  IconButton,
} from "@mui/material";
import { Search, Edit, Delete } from "@mui/icons-material";
import { COLORS, FONT_SIZE } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import { CountriesControllers } from "@/app/api/countriesControllers";
import useSnackbar from "@/store/useSnackbar";
import { useModal } from "@/store/useModal";
import AddCountry from "@/modals/AddCountry";
import EditCountry from "@/modals/EditCountry";
import ViewCountryDetails from "@/modals/ViewCountryDetails";
import ConfirmDeleteCountry from "@/modals/ConfirmDeleteCountry";

interface Country {
  id: number;
  name: string;
  code: string;
  phoneCode: string;
  currencyCode: string;
  isActive?: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const CountriesManagement = () => {
  const { showModal } = useModal();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const { setSnackbar } = useSnackbar();

  const fetchCountries = async (currentPage = 1, currentSearch = "") => {
    setLoading(true);
    try {
      const response: any = await CountriesControllers.getAllCountries(
        currentPage,
        10,
        currentSearch
      );
      if (response.data.success) {
        setCountries(response.data.data || []);
        setPagination(
          response.data.pagination || {
            page: currentPage,
            limit: 10,
            total: response.data.data?.length || 0,
            totalPages: Math.ceil((response.data.data?.length || 0) / 10) || 1,
          }
        );
      }
    } catch (error: any) {
      setSnackbar(
        error.response?.data?.message || "Failed to fetch countries",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCountries(page, search);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [page, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on new search
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: poppins.style.fontFamily,
              fontWeight: 700,
              color: COLORS.BLACK,
            }}
          >
            Country Management
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => showModal(<AddCountry onSuccess={() => fetchCountries(page, search)} />, { size: "sm" })}
          sx={{
            backgroundColor: COLORS.PRIMARY_NAVY,
            borderRadius: "12px",
            textTransform: "none",
            px: 3,
            py: 1.2,
            fontFamily: poppins.style.fontFamily,
            fontWeight: 600,
            "&:hover": { backgroundColor: COLORS.SECONDARY_NAVY },
          }}
        >
          Add New Country
        </Button>
      </Box>

      <Card sx={{ p: 0, borderRadius: "20px", boxShadow: "0px 10px 20px rgba(0,0,0,0.02)", overflow: "hidden", border: "1px solid rgba(0,0,0,0.03)", bgcolor: COLORS.WHITE }}>
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <TextField
            placeholder="Search countries..."
            size="small"
            value={search}
            onChange={handleSearchChange}
            sx={{ width: 320 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: COLORS.TEXT_SECONDARY }} />
                  </InputAdornment>
                ),
                style: { borderRadius: "12px", fontFamily: poppins.style.fontFamily },
              },
            }}
          />
          <Typography sx={{ fontSize: 13, color: COLORS.TEXT_SECONDARY, fontWeight: 500, fontFamily: poppins.style.fontFamily }}>
            Total: <strong style={{ color: COLORS.PRIMARY_NAVY }}>{pagination?.total ?? 0}</strong> Countries
          </Typography>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: "rgba(0,0,0,0.015)", borderBottom: "1px solid rgba(0,0,0,0.03)" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontFamily: poppins.style.fontFamily, pl: 4 }}>Country Name</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: poppins.style.fontFamily }}>ISO Code</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: poppins.style.fontFamily }}>Phone Dial Code</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: poppins.style.fontFamily }}>Currency Code</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: poppins.style.fontFamily }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontFamily: poppins.style.fontFamily, pr: 4 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ pl: 4 }}><Skeleton width={120} height={20} /></TableCell>
                    <TableCell><Skeleton width={50} height={20} /></TableCell>
                    <TableCell><Skeleton width={60} height={20} /></TableCell>
                    <TableCell><Skeleton width={60} height={20} /></TableCell>
                    <TableCell><Skeleton width={70} height={20} /></TableCell>
                    <TableCell sx={{ pr: 4 }}><Skeleton width={70} height={20} /></TableCell>
                  </TableRow>
                ))
              ) : countries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ fontFamily: poppins.style.fontFamily, color: COLORS.TEXT_SECONDARY }}>
                      No countries found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                countries.map((country) => (
                  <TableRow 
                    key={country.id}
                    onClick={() => showModal(<ViewCountryDetails countryId={country.id} />, { size: "sm" })}
                    sx={{ 
                      "&:hover": { bgcolor: "rgba(0,0,0,0.005)" },
                      transition: "background-color 0.2s",
                      cursor: "pointer"
                    }}
                  >
                    <TableCell sx={{ fontFamily: poppins.style.fontFamily, fontWeight: 600, pl: 4 }}>
                      {country.name}
                    </TableCell>
                    <TableCell sx={{ fontFamily: poppins.style.fontFamily, color: COLORS.TEXT_SECONDARY }}>
                      {country.code}
                    </TableCell>
                    <TableCell sx={{ fontFamily: poppins.style.fontFamily, color: COLORS.TEXT_SECONDARY }}>
                      {country.phoneCode}
                    </TableCell>
                    <TableCell sx={{ fontFamily: poppins.style.fontFamily, color: COLORS.TEXT_SECONDARY }}>
                      {country.currencyCode}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={country.isActive ? "Active" : "Inactive"}
                        size="small"
                        sx={{
                          bgcolor: country.isActive
                            ? "rgba(16, 185, 129, 0.1)"
                            : "rgba(113, 113, 122, 0.1)",
                          color: country.isActive ? COLORS.SUCCESS : COLORS.TEXT_SECONDARY,
                          fontWeight: 600,
                          fontSize: 11,
                          borderRadius: "6px"
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 4 }}>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          showModal(<EditCountry countryId={country.id} onSuccess={() => fetchCountries(page, search)} />, { size: "sm" });
                        }}
                        sx={{ color: COLORS.PRIMARY_NAVY, "&:hover": { bgcolor: "rgba(0,0,0,0.04)" } }}
                      >
                        <Edit sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          showModal(<ConfirmDeleteCountry countryId={country.id} countryName={country.name} onSuccess={() => fetchCountries(page, search)} />, { size: "sm" });
                        }}
                        sx={{ color: COLORS.ERROR, "&:hover": { bgcolor: "rgba(244,67,54,0.04)" } }}
                      >
                        <Delete sx={{ fontSize: 16 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Pagination component */}
      {(pagination?.totalPages ?? 0) > 1 && (
        <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
          <MuiPagination
            count={pagination?.totalPages || 1}
            page={page}
            onChange={(_, value) => setPage(value)}
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
                "&:hover": { bgcolor: "rgba(9, 9, 11, 0.05)" }
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: COLORS.PRIMARY_NAVY,
                color: "white",
                boxShadow: "0 4px 12px rgba(9, 9, 11, 0.15)",
                border: "none",
                "&:hover": { backgroundColor: COLORS.PRIMARY_NAVY }
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default CountriesManagement;
