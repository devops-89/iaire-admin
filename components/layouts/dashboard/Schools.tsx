"use client";
import { useSchools } from "@/hooks/common/useSchools";
import { useUpdateTicketStatus } from "@/hooks/school/useUpdateTicketStatus";
import { BOARD_LIST_HEADER } from "@/utils/constant";
import { COLORS } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import { ArrowRightAlt } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SchoolsManagement = () => {
  const { boardAnalytics, loading, pagination, fetchBoardAnalytics } =
    useSchools();
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchBoardAnalytics(page + 1, limit);
  }, [page, limit]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const { updateTicketStatus } = useUpdateTicketStatus();
  const handleUpdateTicketStatus = async (id: string, status: string) => {
    await updateTicketStatus(id, status);
    fetchBoardAnalytics(page + 1, limit);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

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
                        <Button
                          variant="text"
                          endIcon={<ArrowRightAlt />}
                          sx={{
                            fontFamily: poppins.style.fontFamily,
                            fontWeight: 600,
                            color: COLORS.PRIMARY_NAVY,
                            textTransform: "none",
                            fontSize: 12,
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                          onClick={() =>
                            router.push(`/dashboard/boards/${board.boardId}`)
                          }
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          {pagination && (
            <TablePagination
              component="div"
              count={pagination.total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={limit}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </TableContainer>
      </Box>
    </Box>
  );
};

export default SchoolsManagement;
