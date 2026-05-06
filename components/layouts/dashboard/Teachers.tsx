"use client";
import React from "react";
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
  IconButton,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search, Visibility, Edit, Delete, Add } from "@mui/icons-material";
import { COLORS, FONT_SIZE } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
const TEACHER_DATA = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "Premium", certified: "Yes" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Basic", certified: "No" },
  { id: 3, name: "Robert Wilson", email: "robert@example.com", status: "Enterprise", certified: "Yes" },
  { id: 4, name: "Sarah Brown", email: "sarah@example.com", status: "Premium", certified: "Yes" },
  { id: 5, name: "Michael Davis", email: "michael@example.com", status: "Basic", certified: "Yes" },
];

const TeachersManagement = () => {
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
            Teacher Management
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: poppins.style.fontFamily,
              color: COLORS.TEXT_SECONDARY,
            }}
          >
            Manage and monitor all registered teachers on the platform.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            backgroundColor: COLORS.PRIMARY_NAVY,
            borderRadius: "10px",
            textTransform: "none",
            fontFamily: poppins.style.fontFamily,
            px: 3,
            "&:hover": { backgroundColor: COLORS.SECONDARY_NAVY },
          }}
        >
          Add New Teacher
        </Button>
      </Box>

      <Card sx={{ p: 0, borderRadius: "20px", boxShadow: "0px 10px 20px rgba(0,0,0,0.03)", overflow: "hidden" }}>
        <Box sx={{ p: 3, display: "flex", gap: 2 }}>
          <TextField
            placeholder="Search teachers..."
            size="small"
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
                <TableCell sx={{ fontWeight: 700, fontFamily: poppins.style.fontFamily }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: poppins.style.fontFamily }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: poppins.style.fontFamily }}>Membership Status</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: poppins.style.fontFamily }}>Certification</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontFamily: poppins.style.fontFamily }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {TEACHER_DATA.map((row) => (
                <TableRow key={row.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell sx={{ fontFamily: poppins.style.fontFamily, fontWeight: 500 }}>{row.name}</TableCell>
                  <TableCell sx={{ fontFamily: poppins.style.fontFamily, color: COLORS.TEXT_SECONDARY }}>{row.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        fontFamily: poppins.style.fontFamily,
                        fontWeight: 600,
                        backgroundColor: row.status === "Premium" ? "rgba(209, 160, 84, 0.1)" : row.status === "Enterprise" ? "rgba(11, 23, 39, 0.1)" : "rgba(0,0,0,0.05)",
                        color: row.status === "Premium" ? COLORS.ACCENT_TAN : row.status === "Enterprise" ? COLORS.PRIMARY_NAVY : COLORS.TEXT_SECONDARY,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.certified === "Yes" ? "Certified" : "Pending"}
                      size="small"
                      sx={{
                        fontFamily: poppins.style.fontFamily,
                        fontWeight: 600,
                        backgroundColor: row.certified === "Yes" ? "rgba(76, 175, 80, 0.1)" : "rgba(255, 152, 0, 0.1)",
                        color: row.certified === "Yes" ? COLORS.SUCCESS : COLORS.WARNING,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" sx={{ mr: 1, color: COLORS.INFO }}><Visibility fontSize="small" /></IconButton>
                    <IconButton size="small" sx={{ mr: 1, color: COLORS.PRIMARY_NAVY }}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" sx={{ color: COLORS.ERROR }}><Delete fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default TeachersManagement;
