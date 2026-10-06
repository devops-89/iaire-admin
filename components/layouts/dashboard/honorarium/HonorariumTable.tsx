"use client";

import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Stack,
  Select,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import {
  MoreVert,
  Visibility,
  Edit,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useModal } from "@/store/useModal";
import useSnackbar from "@/store/useSnackbar";
import { HonorariumControllers } from "@/app/api/honorariumControllers";
import { COLORS, HONORARIUM_STATUS, TYPOGRAPHY } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import { HonorariumItem, HONORARIUMS_RESPONSE } from "@/utils/type";
import UpdateHonorariumStatus from "@/modals/UpdateHonorariumStatus";
import moment from "moment";

interface HonorariumTableProps {
  data?: HONORARIUMS_RESPONSE;
  onRefresh?: () => void;
}

const FS = { fontFamily: poppins.style.fontFamily };

const HONORARIUM_STATUS_OPTIONS = [
  { label: "Pending", value: HONORARIUM_STATUS.PENDING },
  { label: "Approved", value: HONORARIUM_STATUS.APPROVED },
  { label: "Transaction Pending", value: HONORARIUM_STATUS.TRANSACTION_PENDING },
  { label: "Paid", value: HONORARIUM_STATUS.PAID },
  { label: "Rejected", value: HONORARIUM_STATUS.REJECTED },
];

const formatTitleCase = (str?: string) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getMatchedStatusValue = (currentStatus?: string) => {
  if (!currentStatus) return "";
  const upper = currentStatus.toUpperCase().replace(/\s+/g, "_");
  const matched = HONORARIUM_STATUS_OPTIONS.find(
    (opt) =>
      opt.value.toUpperCase() === upper ||
      opt.value.toUpperCase() === currentStatus.toUpperCase()
  );
  return matched ? matched.value : currentStatus;
};

/**
 * Rejection Form Modal Component (matching Innovation Management pattern)
 */
const RejectionForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (reason: string) => void;
  onCancel: () => void;
}) => {
  const [reason, setReason] = useState("");
  return (
    <Box sx={{ p: 1 }}>
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
        placeholder="Please provide a reason for rejecting this honorarium..."
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

const HonorariumTable: React.FC<HonorariumTableProps> = ({ data, onRefresh }) => {
  const router = useRouter();
  const { showModal, hideModal } = useModal();
  const { setSnackbar } = useSnackbar();

  // Action Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeRecord, setActiveRecord] = useState<HonorariumItem | null>(null);

  // Status loading indicator per record (matching Innovation Management)
  const [statusLoading, setStatusLoading] = useState<number | string | null>(null);

  const handleStatusChange = async (
    id: number | string,
    newStatus: string,
    reason?: string
  ) => {
    setStatusLoading(id);
    try {
      const payload: any = {
        status: newStatus,
        ...(reason?.trim() && { remarks: reason.trim() }),
      };

      const response: any = await HonorariumControllers.updateHonorariumStatus(
        id,
        payload
      );

      if (response?.data?.success) {
        setSnackbar(
          response.data.message ||
            `Status updated to ${newStatus.replace("_", " ")} successfully`,
          "success"
        );
        if (onRefresh) onRefresh();
      } else {
        setSnackbar(
          response?.data?.message || "Failed to update honorarium status",
          "error"
        );
      }
    } catch (error: any) {
      setSnackbar(
        error?.response?.data?.message || "Failed to update honorarium status",
        "error"
      );
    } finally {
      setStatusLoading(null);
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    record: HonorariumItem
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setActiveRecord(record);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveRecord(null);
  };

  const handleViewDetails = () => {
    if (activeRecord?.id) {
      router.push(`/dashboard/honorarium/${activeRecord.id}`);
    }
    handleMenuClose();
  };

  const handleOpenUpdateModal = () => {
    if (activeRecord) {
      showModal(
        <UpdateHonorariumStatus
          honorarium={activeRecord}
          onSuccess={onRefresh}
        />,
        { size: "sm" }
      );
    }
    handleMenuClose();
  };

  const COLUMNS = [
    { label: "Mentor / Requester" },
    { label: "Team & Achievement" },
    { label: "School" },
    { label: "Status" },
    { label: "Submitted Date" },
    { label: "Actions" },
  ];

  const honorariumList: HonorariumItem[] = Array.isArray(data?.data)
    ? (data.data as HonorariumItem[])
    : Array.isArray((data?.data as any)?.data)
      ? ((data?.data as any).data as HonorariumItem[])
      : Array.isArray(data)
        ? (data as unknown as HonorariumItem[])
        : [];

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: COLORS.WHITE,
        borderRadius: "14px",
        border: `1px solid ${COLORS.BORDER_GRAY}`,
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
      }}
    >
      <TableContainer sx={{ maxHeight: "calc(100vh - 280px)" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {COLUMNS.map((col, idx) => (
                <TableCell
                  key={idx}
                  sx={{
                    bgcolor: COLORS.BG_LIGHT,
                    py: 1.75,
                    px: 2.5,
                    borderBottom: `1px solid ${COLORS.BORDER_GRAY}`,
                    ...(col.label === "Actions" && { textAlign: "right" }),
                  }}
                >
                  <Typography sx={{ ...TYPOGRAPHY.TABLE_HEADER }}>
                    {col.label}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {honorariumList && honorariumList.length > 0 ? (
              honorariumList.map((item, index) => {
                const mentorName =
                  item.creator?.fullName ||
                  (item.creator?.firstName
                    ? `${item.creator.firstName} ${item.creator.lastName || ""}`.trim()
                    : "--");

                return (
                  <TableRow
                    key={item.id || index}
                    hover
                    onClick={() => {
                      if (item?.id) {
                        router.push(`/dashboard/honorarium/${item.id}`);
                      }
                    }}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { bgcolor: COLORS.HOVER_BG_LIGHT },
                      transition: "background-color 0.15s ease",
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
                    {/* Mentor Name & Avatar */}
                    <TableCell
                      sx={{
                        py: 1.75,
                        px: 2.5,
                        borderBottom: `1px solid ${COLORS.INPUT_BG}`,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                          src={item.creator?.profileImage}
                          alt={mentorName}
                          sx={{
                            width: 38,
                            height: 38,
                            bgcolor: COLORS.INPUT_BG,
                            color: COLORS.PRIMARY_NAVY,
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          {mentorName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography
                            sx={{
                              ...FS,
                              fontSize: "13.5px",
                              fontWeight: 600,
                              color: COLORS.PRIMARY_NAVY,
                              textTransform: "capitalize",
                            }}
                          >
                            {mentorName}
                          </Typography>
                          <Typography
                            sx={{
                              ...FS,
                              fontSize: "12px",
                              color: COLORS.TEXT_SECONDARY,
                            }}
                          >
                            {item.creator?.email || "--"}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Team & Achievement */}
                    <TableCell
                      sx={{
                        py: 1.75,
                        px: 2.5,
                        borderBottom: `1px solid ${COLORS.INPUT_BG}`,
                      }}
                    >
                      <Typography
                        sx={{
                          ...FS,
                          fontSize: "13.5px",
                          fontWeight: 500,
                          color: COLORS.TEXT_PRIMARY,
                        }}
                      >
                        {item.team?.title || "--"}
                      </Typography>
                      {(item.type || item.achievementType) && (
                        <Typography
                          sx={{
                            ...FS,
                            fontSize: "12px",
                            color: COLORS.TEXT_SECONDARY,
                            mt: 0.35,
                          }}
                        >
                          {[formatTitleCase(item.type), formatTitleCase(item.achievementType)]
                            .filter(Boolean)
                            .join(" • ")}
                        </Typography>
                      )}
                    </TableCell>

                    {/* School */}
                    <TableCell
                      sx={{
                        py: 1.75,
                        px: 2.5,
                        borderBottom: `1px solid ${COLORS.INPUT_BG}`,
                      }}
                    >
                      <Typography
                        sx={{
                          ...FS,
                          fontSize: "13.5px",
                          color: COLORS.TEXT_PRIMARY,
                          fontWeight: 500,
                          textTransform: "capitalize",
                        }}
                      >
                        {item.school?.name || "--"}
                      </Typography>
                      <Typography
                        sx={{
                          ...FS,
                          fontSize: "12px",
                          color: COLORS.TEXT_SECONDARY,
                        }}
                      >
                        {item.school?.code || item.school?.city || "--"}
                      </Typography>
                    </TableCell>

                    {/* Status (Innovation Management Select Pattern) */}
                    <TableCell
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        py: 1.75,
                        px: 2.5,
                        borderBottom: `1px solid ${COLORS.INPUT_BG}`,
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
                          value={getMatchedStatusValue(item.status)}
                          fullWidth
                          displayEmpty
                          onChange={(e) => {
                            const newStatus = e.target.value as string;
                            if (newStatus.toUpperCase() === "REJECTED") {
                              showModal(
                                <RejectionForm
                                  onSubmit={async (reason) => {
                                    hideModal();
                                    await handleStatusChange(item.id, newStatus, reason);
                                  }}
                                  onCancel={hideModal}
                                />,
                                { size: "sm" }
                              );
                            } else {
                              handleStatusChange(item.id, newStatus);
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
                            minWidth: "165px",
                            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select Status
                          </MenuItem>
                          {HONORARIUM_STATUS_OPTIONS.map((status) => (
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

                    {/* Date */}
                    <TableCell
                      sx={{
                        py: 1.75,
                        px: 2.5,
                        borderBottom: `1px solid ${COLORS.INPUT_BG}`,
                      }}
                    >
                      <Typography
                        sx={{
                          ...FS,
                          fontSize: "12.5px",
                          color: COLORS.TEXT_SECONDARY,
                        }}
                      >
                        {item.createdAt ? moment(item.createdAt).format("DD MMM YYYY") : "--"}
                      </Typography>
                    </TableCell>

                    {/* Actions Menu */}
                    <TableCell
                      sx={{
                        py: 1.75,
                        px: 2.5,
                        borderBottom: `1px solid ${COLORS.INPUT_BG}`,
                        textAlign: "right",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, item)}
                        sx={{
                          color: COLORS.TEXT_SECONDARY,
                          "&:hover": { color: COLORS.PRIMARY_NAVY, bgcolor: COLORS.HOVER_BG },
                        }}
                      >
                        <MoreVert sx={{ fontSize: 18 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center", py: 6 }}>
                  <Typography
                    sx={{
                      ...FS,
                      fontSize: "14px",
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    No honorarium records found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Popup Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "10px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: `1px solid ${COLORS.BORDER_GRAY}`,
              p: 0.5,
              minWidth: 190,
            },
          },
        }}
      >
        <MenuItem
          onClick={handleViewDetails}
          sx={{
            ...FS,
            fontSize: "13px",
            fontWeight: 500,
            py: 1,
            px: 1.5,
            borderRadius: "6px",
            color: COLORS.TEXT_PRIMARY,
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            "&:hover": { bgcolor: COLORS.HOVER_BG },
          }}
        >
          <Visibility sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
          View Details
        </MenuItem>

        <MenuItem
          onClick={handleOpenUpdateModal}
          sx={{
            ...FS,
            fontSize: "13px",
            fontWeight: 500,
            py: 1,
            px: 1.5,
            borderRadius: "6px",
            color: COLORS.PRIMARY_NAVY,
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            "&:hover": { bgcolor: COLORS.HOVER_BG },
          }}
        >
          <Edit sx={{ fontSize: 18, color: COLORS.PRIMARY_NAVY }} />
          Update Status
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default HonorariumTable;
