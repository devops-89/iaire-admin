"use client";
import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Avatar,
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import {
  School,
  Business,
  People,
  ArrowForward,
  Visibility,
} from "@mui/icons-material";
import { poppins, roboto } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";
import { useSchools } from "@/hooks/common/useSchools";
import { BOARD_LIST_HEADER } from "@/utils/constant";
import { useRouter } from "next/navigation";

const BOARD_COLORS = [
  "#4CAF50",
  "#2196F3",
  "#FF9800",
  "#9C27B0",
  "#F44336",
  "#00BCD4",
  "#673AB7",
];

const SchoolsManagement = () => {
  const { boardAnalytics, loading } = useSchools();
  const router = useRouter();

  const totalStats = boardAnalytics.reduce(
    (acc, curr) => ({
      schools: acc.schools + curr.totalSchools,
      teachers: acc.teachers + curr.totalTeachers,
      students: acc.students + curr.totalStudents,
    }),
    { schools: 0, teachers: 0, students: 0 },
  );

  const statsCards = [
    {
      label: "Total Boards",
      value: boardAnalytics.length,
      icon: <Business />,
      color: COLORS.PRIMARY_NAVY,
    },
    {
      label: "Active Schools",
      value: totalStats.schools.toLocaleString(),
      icon: <School />,
      color: COLORS.PRIMARY_NAVY,
    },
    {
      label: "Total Teachers",
      value: totalStats.teachers.toLocaleString(),
      icon: <People />,
      color: COLORS.PRIMARY_NAVY,
    },
    {
      label: "Total Students",
      value: totalStats.students.toLocaleString(),
      icon: <People />,
      color: COLORS.PRIMARY_NAVY,
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: poppins.style.fontFamily,
            fontWeight: 700,
            color: COLORS.BLACK,
          }}
        >
          Board Management
        </Typography>
      </Box>

      <Box sx={{ width: "100%" }}>
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
                {BOARD_LIST_HEADER.map((val, i) => (
                  <TableCell
                    sx={{
                      fontFamily: poppins.style.fontFamily,
                      fontWeight: 600,
                      color: COLORS.TEXT_SECONDARY,
                      textAlign: "center",
                    }}
                    align="center"
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
                        <Skeleton variant="text" width="60%" />
                      </TableCell>
                      <TableCell align="center">
                        <Skeleton
                          variant="rounded"
                          width={60}
                          height={24}
                          sx={{ mx: "auto" }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Skeleton
                          variant="text"
                          width="40%"
                          sx={{ ml: "auto" }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Skeleton
                          variant="text"
                          width="40%"
                          sx={{ ml: "auto" }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Skeleton
                          variant="text"
                          width="40%"
                          sx={{ ml: "auto" }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                : boardAnalytics.map((board) => (
                    <TableRow
                      key={board.boardId}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": { bgcolor: "rgba(0,0,0,0.01)" },
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          fontFamily: poppins.style.fontFamily,
                          fontWeight: 500,
                          color: COLORS.PRIMARY_NAVY,
                          // textAlign: "center",
                        }}
                      >
                        {board.boardName}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label="Active"
                          size="small"
                          sx={{
                            bgcolor: "rgba(76, 175, 80, 0.1)",
                            color: "#4CAF50",
                            fontWeight: 600,
                            fontSize: 11,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: poppins.style.fontFamily,
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        {board.totalSchools.toLocaleString()}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: poppins.style.fontFamily,
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        {board.totalTeachers.toLocaleString()}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: poppins.style.fontFamily,
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        {board.totalStudents.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => router.push(`/dashboard/schools/${board.boardId}`)}>
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default SchoolsManagement;
