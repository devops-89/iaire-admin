import { useInterviews } from "@/hooks/common/useInterviews";
import RejectNomination from "@/modals/RejectNomination";
import ScheduleInterview from "@/modals/ScheduleInterview";
import { useModal } from "@/store/useModal";
import { COLORS, TRAINING_NOMINATION_STATUS } from "@/utils/enum";
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
import React, { useState } from "react";

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
    { label: "Teacher Info" },
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

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {COLUMNS.map((val, i) => (
                <TableCell key={i}>
                  <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                    {val.label}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((val, i) => (
              <TableRow key={i}>
                <TableCell sx={{ width: 200 }}>
                  <Typography sx={{ fontSize: 14 }}>
                    {val?.teacher?.fullName || "--"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 14 }}>
                    {val?.training?.batch?.name || "--"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{ fontSize: 14, textTransform: "capitalize" }}
                  >
                    {val?.training?.school?.name || "--"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={val?.status?.replaceAll("_", " ") || "--"}
                    sx={{
                      textTransform: "capitalize",
                      fontFamily: poppins.style.fontFamily,
                      fontSize: 14,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{ fontSize: 14, textTransform: "capitalize" }}
                  >
                    {val.interviewScheduledAt
                      ? moment(val?.interviewScheduledAt).format("DD MMM YYYY")
                      : "--"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, val)}
                    disabled={
                      val.status === TRAINING_NOMINATION_STATUS.REJECTED
                    }
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
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
          sx={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
        />
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
              border: "1px solid rgba(0,0,0,0.05)",
              mt: 1,
              minWidth: 200,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          // onClick={handleViewDetails}
          sx={{
            fontSize: 14,
            fontWeight: 600,
            py: 1.5,
            color: COLORS.BLACK,
            display: "flex",
            gap: 1.5,
            "&:hover": { bgcolor: "rgba(11, 23, 39, 0.04)" },
          }}
        >
          <Visibility sx={{ fontSize: 20, color: COLORS.TEXT_SECONDARY }} />
          View Profile Details
        </MenuItem>
        <Divider sx={{ my: 0.5, borderStyle: "dashed" }} />
        {(activeStatus === TRAINING_NOMINATION_STATUS.SCHOOL_APPROVED ||
          activeStatus === TRAINING_NOMINATION_STATUS.SCHOOL_ASSIGNED ||
          activeRecord?.status ===
            TRAINING_NOMINATION_STATUS.SCHOOL_ASSIGNED) && (
          <MenuItem
            onClick={handleOpenSchedule}
            sx={{
              fontSize: 14,
              fontWeight: 600,
              py: 1.5,
              color: COLORS.PRIMARY_NAVY,
              display: "flex",
              gap: 1.5,
              "&:hover": { bgcolor: "rgba(11, 23, 39, 0.04)" },
            }}
          >
            <CalendarMonth sx={{ fontSize: 20 }} />
            Schedule Interview
          </MenuItem>
        )}
        {(activeStatus === TRAINING_NOMINATION_STATUS.INTERVIEW_SCHEDULED ||
          activeRecord?.status ===
            TRAINING_NOMINATION_STATUS.INTERVIEW_SCHEDULED) && (
          <>
            <Divider sx={{ my: 0.5, borderStyle: "dashed" }} />

            <MenuItem
              onClick={handleApprove}
              disabled={approving}
              sx={{
                fontSize: 14,
                fontWeight: 600,
                py: 1.5,
                color: "#059669",
                display: "flex",
                gap: 1.5,
                "&:hover": { bgcolor: "rgba(5, 150, 105, 0.06)" },
              }}
            >
              <CheckCircle sx={{ fontSize: 20 }} />
              {approving ? "Processing..." : "Approve Teacher"}
            </MenuItem>
            <MenuItem
              onClick={handleOpenReject}
              disabled={approving}
              sx={{
                fontSize: 14,
                fontWeight: 600,
                py: 1.5,
                color: COLORS.ERROR,
                display: "flex",
                gap: 1.5,
                "&:hover": { bgcolor: "rgba(239, 68, 68, 0.06)" },
              }}
            >
              <Cancel sx={{ fontSize: 20 }} />
              Reject Teacher
            </MenuItem>
          </>
        )}

        {activeRecord?.status === TRAINING_NOMINATION_STATUS.IAIRE_APPROVED && (
          <>
            <Divider sx={{ my: 0.5, borderStyle: "dashed" }} />
            <MenuItem
              onClick={handleTrainingCompleted}
              sx={{
                fontSize: 14,
                fontWeight: 600,
                py: 1.5,
                color: COLORS.PRIMARY_NAVY,
                display: "flex",
                gap: 1.5,
                "&:hover": { bgcolor: "rgba(11, 23, 39, 0.04)" },
              }}
            >
              Training Completed
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default InterviewTable;
