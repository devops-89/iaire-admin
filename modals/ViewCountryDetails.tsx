"use client";
import React, { useState, useEffect } from "react";
import { Box, Button, CircularProgress, Typography, Grid, Avatar, Chip } from "@mui/material";
import { Public, Flag, Phone, Paid } from "@mui/icons-material";
import { useModal } from "@/store/useModal";
import { CountriesControllers } from "@/app/api/countriesControllers";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";

interface ViewCountryDetailsProps {
  countryId: number;
}

const ViewCountryDetails: React.FC<ViewCountryDetailsProps> = ({ countryId }) => {
  const { hideModal } = useModal();
  const [country, setCountry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response: any = await CountriesControllers.getCountryDetails(countryId);
        if (response.data.success) {
          setCountry(response.data.data?.data || response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch country details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [countryId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 6 }}>
        <CircularProgress size={32} sx={{ color: COLORS.PRIMARY_NAVY }} />
      </Box>
    );
  }

  if (!country) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography sx={{ fontFamily: poppins.style.fontFamily, color: COLORS.TEXT_SECONDARY }}>
          Country details not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0.5 }}>
      {/* Top Banner / Title */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 4 }}>
        <Avatar
          sx={{
            width: 54,
            height: 54,
            bgcolor: "rgba(9, 9, 11, 0.05)",
            color: COLORS.PRIMARY_NAVY,
            border: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <Public sx={{ fontSize: 28 }} />
        </Avatar>
        <Box>
          <Typography
            sx={{
              fontFamily: poppins.style.fontFamily,
              fontWeight: 800,
              fontSize: "20px",
              color: COLORS.PRIMARY_NAVY,
              lineHeight: 1.2,
            }}
          >
            {country.name}
          </Typography>
          <Typography
            sx={{
              fontFamily: poppins.style.fontFamily,
              fontSize: "12px",
              color: "rgba(9, 9, 11, 0.4)",
              fontWeight: 500,
              mt: 0.2,
            }}
          >
            Geopolitical & Regional Specifications
          </Typography>
        </Box>
      </Box>

      {/* Specifications Grid */}
      <Grid container spacing={3}>
        <Grid size={6}>
          <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "rgba(9, 9, 11, 0.02)", border: "1px solid rgba(0, 0, 0, 0.04)" }}>
            <Typography sx={{ fontSize: "11px", fontWeight: 600, color: "rgba(9, 9, 11, 0.4)", textTransform: "uppercase", letterSpacing: 0.5, mb: 0.5 }}>
              ISO Country Code
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Flag sx={{ fontSize: 18, color: COLORS.PRIMARY_NAVY, opacity: 0.7 }} />
              <Typography sx={{ fontSize: "14px", fontWeight: 700, color: COLORS.PRIMARY_NAVY, fontFamily: poppins.style.fontFamily }}>
                {country.code}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid size={6}>
          <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "rgba(9, 9, 11, 0.02)", border: "1px solid rgba(0, 0, 0, 0.04)" }}>
            <Typography sx={{ fontSize: "11px", fontWeight: 600, color: "rgba(9, 9, 11, 0.4)", textTransform: "uppercase", letterSpacing: 0.5, mb: 0.5 }}>
              Phone Dial Code
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Phone sx={{ fontSize: 18, color: COLORS.PRIMARY_NAVY, opacity: 0.7 }} />
              <Typography sx={{ fontSize: "14px", fontWeight: 700, color: COLORS.PRIMARY_NAVY, fontFamily: poppins.style.fontFamily }}>
                {country.phoneCode}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid size={6}>
          <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "rgba(9, 9, 11, 0.02)", border: "1px solid rgba(0, 0, 0, 0.04)" }}>
            <Typography sx={{ fontSize: "11px", fontWeight: 600, color: "rgba(9, 9, 11, 0.4)", textTransform: "uppercase", letterSpacing: 0.5, mb: 0.5 }}>
              Currency Code
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Paid sx={{ fontSize: 18, color: COLORS.PRIMARY_NAVY, opacity: 0.7 }} />
              <Typography sx={{ fontSize: "14px", fontWeight: 700, color: COLORS.PRIMARY_NAVY, fontFamily: poppins.style.fontFamily }}>
                {country.currencyCode}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid size={6}>
          <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "rgba(9, 9, 11, 0.02)", border: "1px solid rgba(0, 0, 0, 0.04)" }}>
            <Typography sx={{ fontSize: "11px", fontWeight: 600, color: "rgba(9, 9, 11, 0.4)", textTransform: "uppercase", letterSpacing: 0.5, mb: 0.5 }}>
              Support Status
            </Typography>
            <Chip
              label={country.isActive ? "Active Support" : "Inactive"}
              size="small"
              sx={{
                bgcolor: country.isActive ? "rgba(16, 185, 129, 0.1)" : "rgba(113, 113, 122, 0.1)",
                color: country.isActive ? COLORS.SUCCESS : COLORS.TEXT_SECONDARY,
                fontWeight: 700,
                fontSize: 10,
                borderRadius: "6px",
                fontFamily: poppins.style.fontFamily
              }}
            />
          </Box>
        </Grid>

        {/* Footer Actions */}
        <Grid size={12} sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={hideModal}
            variant="contained"
            sx={{
              bgcolor: COLORS.PRIMARY_NAVY,
              borderRadius: "10px",
              textTransform: "none",
              px: 4,
              py: 1.2,
              fontFamily: poppins.style.fontFamily,
              fontWeight: 600,
              fontSize: "13px",
              boxShadow: "0 4px 12px rgba(9, 9, 11, 0.15)",
              "&:hover": { bgcolor: COLORS.SECONDARY_NAVY },
              transition: "all 0.2s ease"
            }}
          >
            Close Details
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewCountryDetails;
