import {
  INNOVATION_STATUS_DATA,
  INNOVATION_TABLE_HEADER,
} from "@/utils/constant";
import { roboto } from "@/utils/fonts";
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
      <Typography variant="h6" sx={{ mb: 2, fontFamily: roboto.style.fontFamily, fontWeight: 600 }}>
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
      />
      <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: "flex-end" }}>
        <Button onClick={onCancel} sx={{ color: "#6B7280", fontWeight: 600, fontFamily: roboto.style.fontFamily }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!reason.trim()}
          onClick={() => onSubmit(reason)}
          sx={{
            backgroundColor: "#111827",
            color: "white",
            fontWeight: 600,
            fontFamily: roboto.style.fontFamily,
            textTransform: "none",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#374151" },
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
  onStatusChange?: (id: number | string, status: string, reason?: string) => void;
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
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {INNOVATION_TABLE_HEADER.map((val, i) => (
                <TableCell
                  key={i}
                  sx={{
                    fontSize: 16,
                    fontFamily: roboto.style.fontFamily,
                    fontWeight: 600,
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
                <TableRow key={item.id || index}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.title || "N/A"}</TableCell>
                  <TableCell>{item.school?.board?.name || "N/A"}</TableCell>
                  <TableCell>{item.school?.name || "N/A"}</TableCell>
                  <TableCell>
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
                        <CircularProgress size={20} sx={{ color: "#6B7280" }} />
                        <Typography
                          sx={{
                            fontSize: 14,
                            fontFamily: roboto.style.fontFamily,
                            color: "#6B7280",
                            fontWeight: 600,
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
                              { size: "sm" }
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
                            py: 1,
                            px: 2,
                          },
                          fontFamily: roboto.style.fontFamily,
                          fontSize: "14px",
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
                              fontFamily: roboto.style.fontFamily,
                              fontSize: "14px",
                            }}
                          >
                            {status.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.createdAt
                      ? dayjs(item.createdAt).format("DD MMM YYYY")
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No Innovation Data Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default InnovationTable;
