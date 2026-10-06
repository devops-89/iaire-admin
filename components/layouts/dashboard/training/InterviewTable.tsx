import { useInterviews } from "@/hooks/common/useInterviews";
import RejectNomination from "@/modals/RejectNomination";
import ScheduleInterview from "@/modals/ScheduleInterview";
import ViewInterviewDetails from "@/modals/ViewInterviewDetails";
import { useModal } from "@/store/useModal";
import { COLORS, TRAINING_NOMINATION_STATUS, TYPOGRAPHY } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import { TEACHER_TRAINING_RESPONSE, TrainingTeacher } from "@/utils/type";
import {
  CalendarMonth,
  Cancel,
  CheckCircle,
  MoreVert,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const STATUS_CONFIG: Record<
  string,
  { label: string; bgcolor: string; color: string; border: string }
> = {
  [TRAINING_NOMINATION_STATUS.TRAINING_COMPLETED]: {
    label: "Training Completed",
    bgcolor: COLORS.STATUS_SUCCESS_BG,
    color: COLORS.STATUS_SUCCESS_TEXT,
    border: `1px solid ${COLORS.STATUS_SUCCESS_BORDER}`,
  },
  [TRAINING_NOMINATION_STATUS.SCHOOL_APPROVED]: {
    label: "School Approved",
    bgcolor: COLORS.STATUS_INFO_BG,
    color: COLORS.STATUS_INFO_TEXT,
    border: `1px solid ${COLORS.STATUS_INFO_BORDER}`,
  },
  [TRAINING_NOMINATION_STATUS.IAIRE_APPROVED]: {
    label: "IAIRE Approved",
    bgcolor: COLORS.STATUS_INDIGO_BG,
    color: COLORS.STATUS_INDIGO_TEXT,
    border: `1px solid ${COLORS.STATUS_INDIGO_BORDER}`,
  },
  [TRAINING_NOMINATION_STATUS.INTERVIEW_SCHEDULED]: {
    label: "Interview Scheduled",
    bgcolor: COLORS.STATUS_PURPLE_BG,
    color: COLORS.STATUS_PURPLE_TEXT,
    border: `1px solid ${COLORS.STATUS_PURPLE_BORDER}`,
  },
  [TRAINING_NOMINATION_STATUS.INTERVIEW_COMPLETED]: {
    label: "Interview Completed",
    bgcolor: COLORS.STATUS_PURPLE_BG,
    color: COLORS.STATUS_PURPLE_TEXT,
    border: `1px solid ${COLORS.STATUS_PURPLE_BORDER}`,
  },
  [TRAINING_NOMINATION_STATUS.SELF_NOMINATED]: {
    label: "Self Nominated",
    bgcolor: COLORS.STATUS_WARNING_BG,
    color: COLORS.STATUS_WARNING_TEXT,
    border: `1px solid ${COLORS.STATUS_WARNING_BORDER}`,
  },
  [TRAINING_NOMINATION_STATUS.SCHOOL_ASSIGNED]: {
    label: "School Assigned",
    bgcolor: COLORS.STATUS_TEAL_BG,
    color: COLORS.STATUS_TEAL_TEXT,
    border: `1px solid ${COLORS.STATUS_TEAL_BORDER}`,
  },
  [TRAINING_NOMINATION_STATUS.PENDING]: {
    label: "Pending",
    bgcolor: COLORS.INPUT_BG,
    color: COLORS.TEXT_SECONDARY,
    border: `1px solid ${COLORS.BORDER_GRAY}`,
  },
  [TRAINING_NOMINATION_STATUS.REJECTED]: {
    label: "Rejected",
    bgcolor: COLORS.STATUS_ERROR_BG,
    color: COLORS.STATUS_ERROR_TEXT,
    border: `1px solid ${COLORS.STATUS_ERROR_BORDER}`,
  },
};

const getStatusBadge = (status?: string) => {
  if (!status) {
    return {
      label: "--",
      bgcolor: COLORS.INPUT_BG,
      color: COLORS.TEXT_SECONDARY,
      border: `1px solid ${COLORS.BORDER_GRAY}`,
    };
  }

  if (STATUS_CONFIG[status]) {
    return STATUS_CONFIG[status];
  }

  const formatted = status
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    label: formatted,
    bgcolor: COLORS.INPUT_BG,
    color: COLORS.TEXT_SECONDARY,
    border: `1px solid ${COLORS.BORDER_GRAY}`,
  };
};

const InterviewTable = ({
  data,
  activeStatus,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: {
  data?: TEACHER_TRAINING_RESPONSE;
  activeStatus: string;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (limit: number) => void;
}) => {
  const COLUMNS = [
    { label: "Mentor Name" },
    { label: "Batch" },
    {
      label: "School",
    },
    { label: "Status" },
    { label: "Interview Schedule" },
    { label: "Actions" },
  ];

  const {
    teachers,
    loading,
    approving,
    // pagination,
    approveInterview,
    fetchTeachers,
  } = useInterviews();

  const { showModal } = useModal();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeRecord, setActiveRecord] = useState<any>(null);
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    record: any,
  ) => {
    setAnchorEl(event.currentTarget);
    setActiveRecord(record);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveRecord(null);
  };

  const handleViewDetails = () => {
    if (activeRecord?.id) {
      router.push(`/dashboard/interviews/${activeRecord.id}`);
    }
    handleMenuClose();
  };

  const handleOpenSchedule = () => {
    if (activeRecord) {
      showModal(
        <ScheduleInterview
          selectedTeacher={activeRecord}
          onSuccess={() => fetchTeachers(1, 1000, activeStatus)}
        />,
        { size: "sm" },
      );
    }
    handleMenuClose();
  };

  const handleApprove = async () => {
    if (!activeRecord) return;
    const id = activeRecord.id;

    handleMenuClose();
    const success = await approveInterview(
      id,
      activeRecord?.status === TRAINING_NOMINATION_STATUS.INTERVIEW_SCHEDULED
        ? TRAINING_NOMINATION_STATUS.IAIRE_APPROVED
        : "",
    );
    if (success) fetchTeachers(1, 1000, activeStatus);
  };

  const handleTrainingCompleted = async () => {
    if (!activeRecord) return;
    const id = activeRecord.id;
    handleMenuClose();
    const success = await approveInterview(
      id,
      TRAINING_NOMINATION_STATUS.TRAINING_COMPLETED,
    );
    if (success) fetchTeachers(1, 1000, activeStatus);
  };

  const handleOpenReject = () => {
    if (activeRecord) {
      showModal(
        <RejectNomination
          selectedTeacher={activeRecord}
          activeStatus={activeStatus}
          onSuccess={() => fetchTeachers(1, 1000, activeStatus)}
        />,
        { size: "sm" },
      );
    }
    handleMenuClose();
  };

  const canSchedule =
    activeRecord?.status === TRAINING_NOMINATION_STATUS.SCHOOL_APPROVED ||
    activeRecord?.status === TRAINING_NOMINATION_STATUS.SCHOOL_ASSIGNED ||
    activeStatus === TRAINING_NOMINATION_STATUS.SCHOOL_APPROVED ||
    activeStatus === TRAINING_NOMINATION_STATUS.SCHOOL_ASSIGNED;

  const canApproveOrReject =
    activeRecord?.status === TRAINING_NOMINATION_STATUS.INTERVIEW_SCHEDULED ||
    activeRecord?.status === TRAINING_NOMINATION_STATUS.INTERVIEW_COMPLETED ||
    activeStatus === TRAINING_NOMINATION_STATUS.INTERVIEW_SCHEDULED ||
    activeStatus === TRAINING_NOMINATION_STATUS.INTERVIEW_COMPLETED;

  const canCompleteTraining =
    activeRecord?.status === TRAINING_NOMINATION_STATUS.IAIRE_APPROVED ||
    activeStatus === TRAINING_NOMINATION_STATUS.IAIRE_APPROVED;

  return (
    <Box>
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
              {COLUMNS.map((val, i) => (
                <TableCell
                  key={i}
                  sx={{
                    py: 1.75,
                    px: 2.5,
                    borderBottom: `1px solid ${COLORS.BORDER_GRAY}`,
                  }}
                >
                  <Typography
                    sx={{
                      ...TYPOGRAPHY.TABLE_HEADER,
                    }}
                  >
                    {val.label}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data && data.data.length > 0 ? (
              data.data.map((val, i) => (
                <TableRow
                  key={val.id || i}
                  onClick={() => {
                    if (val?.id) {
                      router.push(`/dashboard/interviews/${val.id}`);
                    }
                  }}
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
                      width: 220,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: poppins.style.fontFamily,
                        fontSize: "13.5px",
                        fontWeight: 600,
                        color: COLORS.PRIMARY_NAVY,
                        textTransform: "capitalize",
                      }}
                    >
                      {val?.teacher?.fullName ||
                        (val?.teacher?.firstName
                          ? `${val?.teacher?.firstName} ${val?.teacher?.lastName || ""}`
                          : "--")}
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
                        fontFamily: poppins.style.fontFamily,
                        fontSize: "13.5px",
                        fontWeight: 500,
                        color: COLORS.TEXT_PRIMARY,
                      }}
                    >
                      {val?.training?.batch?.name || "--"}
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
                        fontFamily: poppins.style.fontFamily,
                        fontSize: "13.5px",
                        color: COLORS.TEXT_SECONDARY,
                        textTransform: "capitalize",
                      }}
                    >
                      {val?.training?.school?.name || "--"}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      py: 1.75,
                      px: 2.5,
                      borderBottom: `1px solid ${COLORS.INPUT_BG}`,
                    }}
                  >
                    {(() => {
                      const badge = getStatusBadge(val?.status);
                      return (
                        <Chip
                          label={badge.label}
                          size="small"
                          sx={{
                            fontFamily: poppins.style.fontFamily,
                            fontSize: 12,
                            fontWeight: 500,
                            height: 24,
                            borderRadius: "6px",
                            bgcolor: badge.bgcolor,
                            color: badge.color,
                            border: badge.border,
                            "& .MuiChip-label": {
                              px: 1,
                            },
                          }}
                        />
                      );
                    })()}
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
                        fontFamily: poppins.style.fontFamily,
                        fontSize: "13.5px",
                        color: COLORS.TEXT_SECONDARY,
                      }}
                    >
                      {val.interviewScheduledAt
                        ? moment(val?.interviewScheduledAt).format("DD MMM YYYY")
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
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuOpen(e, val);
                      }}
                      disabled={
                        val.status === TRAINING_NOMINATION_STATUS.REJECTED
                      }
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
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center", py: 6 }}>
                  <Typography
                    sx={{
                      color: COLORS.TEXT_SECONDARY,
                      fontFamily: poppins.style.fontFamily,
                      fontSize: 14,
                    }}
                  >
                    No teacher records found for the selected status or search filter.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={data?.pagination?.total || 0}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(event, newPage) => {
            onPageChange(newPage);
          }}
          onRowsPerPageChange={(event) => {
            onRowsPerPageChange(parseInt(event.target.value));
          }}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{
            borderTop: `1px solid ${COLORS.BORDER_GRAY}`,
            fontFamily: poppins.style.fontFamily,
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select": {
              fontFamily: poppins.style.fontFamily,
              fontSize: "13px",
            },
          }}
        />
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "10px",
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
              border: `1px solid ${COLORS.BORDER_GRAY}`,
              p: 0.75,
              minWidth: 190,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={handleViewDetails}
          sx={{
            fontFamily: poppins.style.fontFamily,
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
          View Profile Details
        </MenuItem>

        {canSchedule && (
          <>
            <Divider sx={{ my: 0.5, borderColor: COLORS.INPUT_BG }} />
            <MenuItem
              onClick={handleOpenSchedule}
              sx={{
                fontFamily: poppins.style.fontFamily,
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
              <CalendarMonth sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
              Schedule Interview
            </MenuItem>
          </>
        )}

        {canApproveOrReject && (
          <>
            <Divider sx={{ my: 0.5, borderColor: COLORS.INPUT_BG }} />
            <MenuItem
              onClick={handleApprove}
              disabled={approving}
              sx={{
                fontFamily: poppins.style.fontFamily,
                fontSize: "13px",
                fontWeight: 500,
                py: 1,
                px: 1.5,
                borderRadius: "6px",
                color: COLORS.SUCCESS_DARK,
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                "&:hover": { bgcolor: COLORS.STATUS_SUCCESS_BG },
              }}
            >
              <CheckCircle sx={{ fontSize: 18, color: COLORS.SUCCESS_DARK }} />
              {approving ? "Processing..." : "Approve Teacher"}
            </MenuItem>
            <MenuItem
              onClick={handleOpenReject}
              disabled={approving}
              sx={{
                fontFamily: poppins.style.fontFamily,
                fontSize: "13px",
                fontWeight: 500,
                py: 1,
                px: 1.5,
                borderRadius: "6px",
                color: COLORS.ERROR,
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                "&:hover": { bgcolor: COLORS.STATUS_ERROR_BG },
              }}
            >
              <Cancel sx={{ fontSize: 18, color: COLORS.ERROR }} />
              Reject Teacher
            </MenuItem>
          </>
        )}

        {canCompleteTraining && (
          <>
            <Divider sx={{ my: 0.5, borderColor: COLORS.INPUT_BG }} />
            <MenuItem
              onClick={handleTrainingCompleted}
              sx={{
                fontFamily: poppins.style.fontFamily,
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
              <CheckCircle sx={{ fontSize: 18, color: COLORS.SUCCESS_DARK }} />
              Training Completed
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default InterviewTable;
