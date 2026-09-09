"use client";
import React, { useEffect } from "react";
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
  Paper,
  Skeleton,
  IconButton,
  Chip,
  Avatar,
  Button
} from "@mui/material";
import { ArrowBack, Visibility, LocationOn } from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";
import { getSchoolByBoardId } from "@/hooks/common/useSchools";
import { useRouter } from "next/navigation";

interface BoardDetailsProps {
  boardId: string;
}

const SCHOOLS_LIST_HEADER = ["School Name", "Code", "Location", "Status", "Actions"];

const BoardDetails: React.FC<BoardDetailsProps> = ({ boardId }) => {
  const { data: schools, loading, fetchSchoolByBoardId } = getSchoolByBoardId();
  const router = useRouter();

  useEffect(() => {
    if (boardId) {
      fetchSchoolByBoardId(boardId);
    }
  }, [boardId]);

  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton onClick={() => router.back()} sx={{ bgcolor: "rgba(0,0,0,0.04)" }}>
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h4"
          sx={{
            fontFamily: poppins.style.fontFamily,
            fontWeight: 700,
            color: COLORS.BLACK,
          }}
        >
          Board Details
        </Typography>
      </Box>

      <Box sx={{ width: "100%" }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: poppins.style.fontFamily,
            fontWeight: 600,
            color: COLORS.PRIMARY_NAVY,
            mb: 2,
          }}
        >
          Associated Schools
        </Typography>
        
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "16px",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
            border: "1px solid #d7d7d7",
          }}
        >
          <Table>
            <TableHead sx={{ border: "1px solid #d7d7d7" }}>
              <TableRow
                sx={{
                  bgcolor: "rgba(0,0,0,0.02)",
                  border: "1px solid #d7d7d7",
                }}
              >
                {SCHOOLS_LIST_HEADER.map((val, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      fontFamily: poppins.style.fontFamily,
                      fontWeight: 600,
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    {val}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Skeleton variant="circular" width={40} height={40} />
                          <Skeleton variant="text" width={120} />
                        </Box>
                      </TableCell>
                      <TableCell><Skeleton variant="text" width={80} /></TableCell>
                      <TableCell><Skeleton variant="text" width={100} /></TableCell>
                      <TableCell><Skeleton variant="rounded" width={60} height={24} /></TableCell>
                      <TableCell><Skeleton variant="circular" width={32} height={32} /></TableCell>
                    </TableRow>
                  ))
                : schools && schools.length > 0 ? (
                  schools.map((school) => (
                    <TableRow
                      key={school.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": { bgcolor: "rgba(0,0,0,0.01)" },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar src={school.logo} alt={school.name} sx={{ width: 40, height: 40 }} />
                          <Typography
                            sx={{
                              fontFamily: poppins.style.fontFamily,
                              fontWeight: 500,
                              color: COLORS.PRIMARY_NAVY,
                            }}
                          >
                            {school.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: poppins.style.fontFamily,
                          fontWeight: 500,
                        }}
                      >
                        {school.code || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: COLORS.TEXT_SECONDARY }}>
                          <LocationOn sx={{ fontSize: 16 }} />
                          <Typography sx={{ fontSize: 14, fontFamily: poppins.style.fontFamily }}>
                            {school.city}, {school.state}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={school.isActive !== false ? "Active" : "Inactive"}
                          size="small"
                          sx={{
                            bgcolor: school.isActive !== false ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)",
                            color: school.isActive !== false ? "#4CAF50" : "#F44336",
                            fontWeight: 600,
                            fontSize: 11,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton>
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography sx={{ fontFamily: poppins.style.fontFamily, color: COLORS.TEXT_SECONDARY }}>
                        No schools found for this board.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default BoardDetails;
