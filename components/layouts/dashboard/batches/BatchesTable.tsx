import {
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { COLORS, TYPOGRAPHY } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import { Batch } from "@/utils/type";
import moment from "moment";
import BatchStatusChip from "./BatchStatusChip";

const FS = { fontFamily: poppins.style.fontFamily };

const COLUMNS = [
  { label: "Id", width: 70 },
  { label: "Batch Name", minWidth: 200 },
  { label: "Start Date", width: 140 },
  { label: "End Date", width: 140 },
  { label: "Category", width: 140 },
  { label: "Status", width: 130 },
  { label: "Actions", width: 80, align: "right" as const },
];

interface BatchesTableProps {
  loading: boolean;
  batches: Batch[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLButtonElement>, row: Batch) => void;
  onRowClick?: (row: Batch) => void;
}

const SkeletonRows = () => (
  <>
    {Array.from({ length: 5 }).map((_, idx) => (
      <TableRow key={idx}>
        <TableCell sx={{ py: 1.75, px: 2.5 }}>
          <Skeleton width="30px" height="24px" />
        </TableCell>
        <TableCell sx={{ py: 1.75, px: 2.5 }}>
          <Skeleton width="180px" height="24px" />
        </TableCell>
        <TableCell sx={{ py: 1.75, px: 2.5 }}>
          <Skeleton width="100px" height="20px" />
        </TableCell>
        <TableCell sx={{ py: 1.75, px: 2.5 }}>
          <Skeleton width="100px" height="20px" />
        </TableCell>
        <TableCell sx={{ py: 1.75, px: 2.5 }}>
          <Skeleton width="90px" height="24px" />
        </TableCell>
        <TableCell sx={{ py: 1.75, px: 2.5 }}>
          <Skeleton width="80px" height="24px" />
        </TableCell>
        <TableCell align="right" sx={{ py: 1.75, px: 2.5 }}>
          <Skeleton
            variant="circular"
            width={28}
            height={28}
            sx={{ ml: "auto" }}
          />
        </TableCell>
      </TableRow>
    ))}
  </>
);

const EmptyState = () => (
  <TableRow>
    <TableCell colSpan={7} sx={{ textAlign: "center", py: 6 }}>
      <Typography
        sx={{
          color: COLORS.TEXT_SECONDARY,
          fontFamily: poppins.style.fontFamily,
          fontSize: 14,
        }}
      >
        No batch records found matching your filters.
      </Typography>
    </TableCell>
  </TableRow>
);

const BatchesTable = ({
  loading,
  batches,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onMenuOpen,
  onRowClick,
}: BatchesTableProps) => (
  <TableContainer
    sx={{
      bgcolor: COLORS.WHITE,
      borderRadius: "14px",
      border: `1px solid ${COLORS.BORDER_GRAY}`,
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
      overflow: "hidden",
    }}
  >
    <Table>
      <TableHead sx={{ bgcolor: COLORS.BG_LIGHT }}>
        <TableRow>
          {COLUMNS.map((col, i) => (
            <TableCell
              key={i}
              align={col.align || "left"}
              sx={{
                py: 1.75,
                px: 2.5,
                borderBottom: `1px solid ${COLORS.BORDER_GRAY}`,
                ...(col.width && { width: col.width }),
                ...(col.minWidth && { minWidth: col.minWidth }),
              }}
            >
              <Typography
                sx={{
                  ...TYPOGRAPHY.TABLE_HEADER,
                }}
              >
                {col.label}
              </Typography>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {loading ? (
          <SkeletonRows />
        ) : !batches || batches.length === 0 ? (
          <EmptyState />
        ) : (
          batches.map((row) => (
            <TableRow
              key={row.id}
              onClick={() => onRowClick && onRowClick(row)}
              sx={{
                cursor: "pointer",
                "&:hover": { bgcolor: COLORS.HOVER_BG_LIGHT },
                transition: "background-color 0.15s ease",
                "&:last-child td": { borderBottom: 0 },
              }}
            >
              <TableCell
                sx={{
                  py: 1.75,
                  px: 2.5,
                  borderBottom: `1px solid ${COLORS.INPUT_BG}`,
                }}
              >
                <Typography
                  sx={{
                    ...TYPOGRAPHY.TABLE_CELL_PRIMARY,
                  }}
                >
                  {row.id}
                </Typography>
              </TableCell>

              <TableCell
                sx={{
                  py: 1.75,
                  px: 2.5,
                  borderBottom: `1px solid ${COLORS.INPUT_BG}`,
                }}
              >
                <Typography
                  sx={{
                    ...TYPOGRAPHY.TABLE_CELL_PRIMARY,
                  }}
                >
                  {row.name || "Unnamed Batch"}
                </Typography>
              </TableCell>

              <TableCell
                sx={{
                  py: 1.75,
                  px: 2.5,
                  borderBottom: `1px solid ${COLORS.INPUT_BG}`,
                }}
              >
                <Typography
                  sx={{
                    ...TYPOGRAPHY.TABLE_CELL_SECONDARY,
                  }}
                >
                  {row.startDate
                    ? moment(row.startDate).format("MMM DD, YYYY")
                    : "--"}
                </Typography>
              </TableCell>

              <TableCell
                sx={{
                  py: 1.75,
                  px: 2.5,
                  borderBottom: `1px solid ${COLORS.INPUT_BG}`,
                }}
              >
                <Typography
                  sx={{
                    ...TYPOGRAPHY.TABLE_CELL_SECONDARY,
                  }}
                >
                  {row.endDate
                    ? moment(row.endDate).format("MMM DD, YYYY")
                    : "--"}
                </Typography>
              </TableCell>

              <TableCell
                sx={{
                  py: 1.75,
                  px: 2.5,
                  borderBottom: `1px solid ${COLORS.INPUT_BG}`,
                }}
              >
                <Typography
                  sx={{
                    ...TYPOGRAPHY.TABLE_CELL_SECONDARY,
                    color: COLORS.TEXT_PRIMARY,
                    textTransform: "capitalize",
                  }}
                >
                  {row.category
                    ? row.category.toLowerCase().replace(/_/g, " ")
                    : "--"}
                </Typography>
              </TableCell>

              <TableCell
                sx={{
                  py: 1.75,
                  px: 2.5,
                  borderBottom: `1px solid ${COLORS.INPUT_BG}`,
                }}
              >
                <BatchStatusChip status={row.status} />
              </TableCell>

              <TableCell
                align="right"
                sx={{
                  py: 1.75,
                  px: 2.5,
                  borderBottom: `1px solid ${COLORS.INPUT_BG}`,
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMenuOpen(e, row);
                  }}
                  sx={{
                    color: COLORS.TEXT_SECONDARY,
                    "&:hover": {
                      color: COLORS.PRIMARY_NAVY,
                      bgcolor: COLORS.HOVER_BG,
                    },
                  }}
                >
                  <MoreVert sx={{ fontSize: 20 }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>

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
      sx={{
        borderTop: `1px solid ${COLORS.BORDER_GRAY}`,
        fontFamily: poppins.style.fontFamily,
        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select":
          {
            fontFamily: poppins.style.fontFamily,
            fontSize: "13px",
          },
      }}
    />
  </TableContainer>
);

export default BatchesTable;
