import {
  Box,
  Card,
  Chip,
  IconButton,
  Skeleton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Typography,
  alpha,
} from "@mui/material";
import { CalendarMonth, MoreVert } from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";
import { BATCH_TABLE_TABS } from "@/utils/constant";
import { Batch } from "@/utils/type";
import moment from "moment";
import BatchStatusChip from "./BatchStatusChip";

const FS = { fontFamily: poppins.style.fontFamily };

const TABLE_HEADERS = [
  "Id",
  "Batch Name",
  "Start Date",
  "End Date",
  "Category",
  "Status",
  "Actions",
];

interface BatchesTableProps {
  loading: boolean;
  batches: Batch[];
  totalCount: number;
  tabValue: string;
  page: number;
  rowsPerPage: number;
  onTabChange: (event: React.SyntheticEvent, value: string) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLButtonElement>, row: Batch) => void;
}

const SkeletonRows = () => (
  <>
    {Array.from({ length: 5 }).map((_, idx) => (
      <TableRow key={idx}>
        <TableCell sx={{ pl: 4 }}>
          <Skeleton width="30px" height="24px" />
        </TableCell>
        <TableCell>
          <Skeleton width="180px" height="24px" />
        </TableCell>
        <TableCell>
          <Skeleton width="120px" height="20px" />
        </TableCell>
        <TableCell>
          <Skeleton width="120px" height="20px" />
        </TableCell>
        <TableCell>
          <Skeleton width="100px" height="24px" />
        </TableCell>
        <TableCell>
          <Skeleton width="80px" height="24px" />
        </TableCell>
        <TableCell align="right" sx={{ pr: 4 }}>
          <Skeleton
            variant="circular"
            width={30}
            height={30}
            sx={{ ml: "auto" }}
          />
        </TableCell>
      </TableRow>
    ))}
  </>
);

const EmptyState = () => (
  <TableRow>
    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
      <Stack
        spacing={1}
        sx={{ alignItems: "center", justifyContent: "center" }}
      >
        <CalendarMonth
          sx={{ fontSize: 48, color: alpha(COLORS.PRIMARY_NAVY, 0.2), mb: 1 }}
        />
        <Typography sx={{ ...FS, fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>
          No Batches Found
        </Typography>
        <Typography sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY }}>
          No records match the selected category or search filters.
        </Typography>
      </Stack>
    </TableCell>
  </TableRow>
);

const BatchesTable = ({
  loading,
  batches,
  totalCount,
  tabValue,
  page,
  rowsPerPage,
  onTabChange,
  onPageChange,
  onRowsPerPageChange,
  onMenuOpen,
}: BatchesTableProps) => (
  <Card
    sx={{
      borderRadius: "28px",
      boxShadow: "0px 15px 50px rgba(0,0,0,0.02)",
      border: "1px solid rgba(0,0,0,0.04)",
      bgcolor: COLORS.WHITE,
      overflow: "hidden",
    }}
  >
    {/* Tabs + count */}
    <Box
      sx={{
        borderBottom: "1px solid rgba(0,0,0,0.05)",
        px: 3,
        pt: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Tabs
        value={tabValue}
        onChange={onTabChange}
        sx={{
          "& .MuiTabs-indicator": {
            height: 3,
            borderRadius: "3px 3px 0 0",
            bgcolor: COLORS.PRIMARY_NAVY,
          },
          "& .MuiTab-root": {
            ...FS,
            textTransform: "none",
            fontSize: 14,
            fontWeight: 600,
            minWidth: 100,
            color: COLORS.TEXT_SECONDARY,
            py: 2,
            "&.Mui-selected": { color: COLORS.PRIMARY_NAVY },
          },
        }}
      >
        {BATCH_TABLE_TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>

      <Typography
        sx={{
          ...FS,
          fontSize: 13,
          color: COLORS.TEXT_SECONDARY,
          fontWeight: 500,
          display: { xs: "none", md: "block" },
        }}
      >
        Total Batches:{" "}
        <strong style={{ color: COLORS.PRIMARY_NAVY }}>{totalCount}</strong>
      </Typography>
    </Box>

    {/* Table */}
    <TableContainer sx={{ minWidth: 900 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "rgba(11, 23, 39, 0.02)" }}>
          <TableRow>
            {TABLE_HEADERS.map((label) => (
              <TableCell
                key={label}
                sx={{
                  ...FS,
                  fontWeight: 700,
                  color: COLORS.PRIMARY_NAVY,
                  pl: 4,
                }}
              >
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            <SkeletonRows />
          ) : batches.length === 0 ? (
            <EmptyState />
          ) : (
            batches.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell sx={{ ...FS, pl: 4, fontWeight: 600 }}>
                  {row.id}
                </TableCell>
                <TableCell
                  sx={{ ...FS, fontWeight: 700, color: COLORS.TEXT_PRIMARY }}
                >
                  {row.name || "Unnamed Batch"}
                </TableCell>
                <TableCell
                  sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY }}
                >
                  {moment(row.startDate).format("MMM DD, YYYY")}
                </TableCell>
                <TableCell
                  sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY }}
                >
                  {moment(row.endDate).format("MMM DD, YYYY")}
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.category}
                    size="small"
                    sx={{
                      ...FS,
                      fontWeight: 700,
                      fontSize: 10,
                      height: 24,
                      bgcolor: alpha(COLORS.PRIMARY_NAVY, 0.08),
                      color: COLORS.PRIMARY_NAVY,
                      borderRadius: "6px",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <BatchStatusChip status={row.status} />
                </TableCell>
                <TableCell align="right" sx={{ pr: 4 }}>
                  <IconButton
                    onClick={(e) => onMenuOpen(e, row)}
                    sx={{
                      bgcolor: "rgba(0,0,0,0.03)",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.08)" },
                    }}
                  >
                    <MoreVert sx={{ color: COLORS.PRIMARY_NAVY }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>

    <TablePagination
      component="div"
      count={totalCount}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={(_, newPage) => onPageChange(newPage)}
      onRowsPerPageChange={(e) =>
        onRowsPerPageChange(parseInt(e.target.value, 10))
      }
      rowsPerPageOptions={[5, 10, 25]}
      sx={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
    />
  </Card>
);

export default BatchesTable;
