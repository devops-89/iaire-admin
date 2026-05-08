import React from "react";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Skeleton,
  Pagination as MuiPagination,
  Typography,
} from "@mui/material";
import { Search, Edit, Delete, BatchPrediction } from "@mui/icons-material";
import { COLORS, FONT_SIZE, CATEGORY } from "@/utils/enum";
import { Batch, Pagination } from "@/utils/type";
import dayjs from "dayjs";

interface BatchTableProps {
  loading: boolean;
  batches: Batch[];
  pagination: Pagination;
  search: string;
  setSearch: (val: string) => void;
  onEdit: (batch: Batch) => void;
  goToPage: (page: number) => void;
  fontStyle: any;
  poppinsFont: any;
}

const BatchTable: React.FC<BatchTableProps> = ({
  loading,
  batches,
  pagination,
  search,
  setSearch,
  onEdit,
  goToPage,
  fontStyle,
  poppinsFont,
}) => {
  const filtered = batches.filter((b) =>
    b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
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
              style: { borderRadius: "10px", fontFamily: poppinsFont.style.fontFamily },
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
                  sx={{ fontWeight: 700, ...fontStyle, fontSize: FONT_SIZE.FS14 }}
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
                  <Typography sx={{ ...fontStyle, color: COLORS.TEXT_SECONDARY }}>
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
                  <TableCell sx={{ ...fontStyle, color: COLORS.TEXT_SECONDARY, fontSize: FONT_SIZE.FS14 }}>
                    {(pagination.page - 1) * pagination.limit + idx + 1}
                  </TableCell>
                  <TableCell sx={{ ...fontStyle, fontWeight: 600, fontSize: FONT_SIZE.FS14 }}>
                    {row.name}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.category}
                      size="small"
                      sx={{
                        ...fontStyle,
                        fontWeight: 700,
                        backgroundColor: 
                          row.category === CATEGORY.RESEARCH ? "rgba(99, 102, 241, 0.1)" :
                          row.category === CATEGORY.INNOVATION ? "rgba(245, 158, 11, 0.1)" : "rgba(16, 185, 129, 0.1)",
                        color: 
                          row.category === CATEGORY.RESEARCH ? "#6366F1" :
                          row.category === CATEGORY.INNOVATION ? "#F59E0B" : "#10B981",
                        fontSize: FONT_SIZE.FS12,
                        borderRadius: "6px"
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ ...fontStyle, color: COLORS.TEXT_SECONDARY, fontSize: FONT_SIZE.FS14 }}>
                    {dayjs(row.startDate).format("DD MMM, YYYY")}
                  </TableCell>
                  <TableCell sx={{ ...fontStyle, color: COLORS.TEXT_SECONDARY, fontSize: FONT_SIZE.FS14 }}>
                    {dayjs(row.endDate).format("DD MMM, YYYY")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status || (row.isActive ? "Active" : "Inactive")}
                      size="small"
                      sx={{
                        ...fontStyle,
                        fontWeight: 600,
                        backgroundColor: row.status === "UPCOMING" ? "rgba(245, 158, 11, 0.1)" : row.isActive ? "rgba(76, 175, 80, 0.12)" : "rgba(0,0,0,0.06)",
                        color: row.status === "UPCOMING" ? "#F59E0B" : row.isActive ? "#4CAF50" : COLORS.TEXT_SECONDARY,
                        fontSize: FONT_SIZE.FS12,
                        textTransform: "capitalize"
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(row)}
                      sx={{ color: COLORS.PRIMARY_NAVY }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <MuiPagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={(_, page) => goToPage(page)}
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                fontFamily: poppinsFont.style.fontFamily,
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
  );
};

export default BatchTable;
