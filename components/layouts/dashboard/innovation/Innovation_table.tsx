import {
  INNOVATION_STATUS_DATA,
  INNOVATION_TABLE_HEADER,
} from "@/utils/constant";
import Link from "next/link";
import { poppins, roboto } from "@/utils/fonts";
import { COLORS, FONT_WEIGHT } from "@/utils/enum";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  CircularProgress,
  Stack,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import React, { useState } from "react";
import dayjs from "dayjs";
import { INNOVATION_RESPONSE_DATA_PROPS } from "@/utils/type";
import { useModal } from "@/store/useModal";

const RejectionForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (reason: string) => void;
  onCancel: () => void;
}) => {
  const [reason, setReason] = useState("");
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontFamily: poppins.style.fontFamily, fontWeight: 600 }}
      >
        Reason for Rejection
      </Typography>
      <TextField
        autoFocus
        fullWidth
        multiline
        rows={4}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Please provide a reason for rejecting this innovation..."
        sx={{
          "& .MuiOutlinedInput-root": {
            fontFamily: poppins.style.fontFamily,
            fontSize: "14px",
          },
        }}
      />
      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: 3, justifyContent: "flex-end" }}
      >
        <Button
          onClick={onCancel}
          sx={{
            color: COLORS.TEXT_SECONDARY,
            fontWeight: 600,
            fontFamily: poppins.style.fontFamily,
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!reason.trim()}
          onClick={() => onSubmit(reason)}
          sx={{
            backgroundColor: COLORS.PRIMARY_NAVY,
            color: "white",
            fontWeight: 600,
            fontFamily: poppins.style.fontFamily,
            textTransform: "none",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#27272A" },
          }}
        >
          Submit Rejection
        </Button>
      </Stack>
    </Box>
  );
};

interface InnovationTableProps {
  innovationData?: {
    data?: INNOVATION_RESPONSE_DATA_PROPS[];
  };
  onStatusChange?: (
    id: number | string,
    status: string,
    reason?: string,
  ) => void;
  statusLoading?: number | string | null;
}

const InnovationTable = ({
  innovationData,
  onStatusChange,
  statusLoading,
}: InnovationTableProps) => {
  const { showModal, hideModal } = useModal();
  const data = innovationData?.data || [];

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: COLORS.BG_LIGHT }}>
            {INNOVATION_TABLE_HEADER.map((val, i) => (
              <TableCell
                key={i}
                sx={{
                  fontSize: "13.5px",
                  fontWeight: FONT_WEIGHT.SEMI_BOLD,
                  fontFamily: poppins.style.fontFamily,
                  color: COLORS.PRIMARY_NAVY,
                  borderBottom: `1px solid ${COLORS.BORDER_GRAY}`,
                  whiteSpace: "nowrap",
                  py: 1.75,
                }}
              >
                {val}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <TableRow
                key={item.id || index}
                sx={{
                  "&:hover": {
                    bgcolor: COLORS.HOVER_BG_LIGHT,
                  },
                  transition: "background-color 0.15s ease",
                }}
              >
                <TableCell
                  sx={{
                    fontFamily: poppins.style.fontFamily,
                    fontSize: "13.5px",
                    color: COLORS.TEXT_SECONDARY,
                    py: 1.75,
                    borderBottom: `1px solid ${COLORS.BORDER_GRAY}`,
                  }}
                >
                  {item.id}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: poppins.style.fontFamily,
                    fontSize: "13.5px",
                    py: 1.75,
                    borderBottom: `1px solid ${COLORS.BORDER_GRAY}`,
                  }}
                >
                  <Link
                    href={`/dashboard/innovation-management/${item.id}`}
                    style={{
                      textDecoration: "none",
                      color: "#2563EB",
                      fontWeight: 600,
                      fontFamily: poppins.style.fontFamily,
                    }}
                  >
                    {item.title || "N/A"}
                  </Link>
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: poppins.style.fontFamily,
                    fontSize: "13.5px",
                    color: COLORS.TEXT_PRIMARY,
                    fontWeight: 500,
                    py: 1.75,
                    borderBottom: `1px solid ${COLORS.BORDER_GRAY}`,
                  }}
                >
                  {item.teamId
                    ? item?.team?.title
                    : item?.creator?.fullName ||
                      `${item?.creator?.firstName || ""} ${item?.creator?.lastName || ""}`.trim() ||
                      "N/A"}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: poppins.style.fontFamily,
                    fontSize: "13.5px",
                    color: COLORS.TEXT_SECONDARY,
                    textTransform: "capitalize",
                    py: 1.75,
                    borderBottom: `1px solid ${COLORS.BORDER_GRAY}`,
                  }}
                >
                  {item.school?.name || "N/A"}
                </TableCell>
                <TableCell
                  sx={{
                    py: 1.75,
                    borderBottom: `1px solid ${COLORS.BORDER_GRAY}`,
                  }}
                >
                  {statusLoading === item.id ? (
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        alignItems: "center",
                        minWidth: "160px",
                        px: 2,
                        py: 1,
                      }}
                    >
                      <CircularProgress size={18} sx={{ color: COLORS.TEXT_SECONDARY }} />
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontFamily: poppins.style.fontFamily,
                          color: COLORS.TEXT_SECONDARY,
                          fontWeight: 500,
                        }}
                      >
                        Updating...
                      </Typography>
                    </Stack>
                  ) : (
                    <Select
                      size="small"
                      value={item.status || ""}
                      fullWidth
                      displayEmpty
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        if (newStatus.toLowerCase().includes("rejected")) {
                          showModal(
                            <RejectionForm
                              onSubmit={(reason) => {
                                if (onStatusChange) {
                                  onStatusChange(item.id, newStatus, reason);
                                }
                                hideModal();
                              }}
                              onCancel={hideModal}
                            />,
                            { size: "sm" },
                          );
                        } else {
                          if (onStatusChange) {
                            onStatusChange(item.id, newStatus);
                          }
                        }
                      }}
                      sx={{
                        borderRadius: "16px",
                        backgroundColor: "#F9FAFB",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#E5E7EB",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#D1D5DB",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#9CA3AF",
                          borderWidth: "1px",
                        },
                        "& .MuiSelect-select": {
                          py: 0.75,
                          px: 2,
                        },
                        fontFamily: poppins.style.fontFamily,
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#374151",
                        minWidth: "160px",
                        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select Status
                      </MenuItem>
                      {INNOVATION_STATUS_DATA.map((status) => (
                        <MenuItem
                          key={status.value}
                          value={status.value}
                          sx={{
                            fontFamily: poppins.style.fontFamily,
                            fontSize: "13px",
                          }}
                        >
                          {status.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: poppins.style.fontFamily,
                    fontSize: "13px",
                    color: COLORS.TEXT_SECONDARY,
                    whiteSpace: "nowrap",
                    py: 1.75,
                    borderBottom: `1px solid ${COLORS.BORDER_GRAY}`,
                  }}
                >
                  {item.createdAt
                    ? dayjs(item.createdAt).format("DD MMM YYYY")
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                align="center"
                sx={{
                  py: 4,
                  fontFamily: poppins.style.fontFamily,
                  fontSize: "13.5px",
                  color: COLORS.TEXT_SECONDARY,
                }}
              >
                No Innovation Data Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InnovationTable;
