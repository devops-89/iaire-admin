"use client";
import { poppins, roboto } from "@/utils/fonts";
import {
  Autocomplete,
  Card,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { RESEARCH_STATUS } from "@/utils/enum";
import { useResearchData } from "@/hooks/common/useResearch";
import {
  RESEARCH_STATUS_DATA,
  RESEARCH_TABLE_HEADER_DATA,
} from "@/utils/constant";
import { Visibility } from "@mui/icons-material";
import { useModal } from "@/store/useModal";
import RejectResearch from "@/modals/RejectResearch";
import useSnackbar from "@/store/useSnackbar";
import { ResearchControllers } from "@/app/api/researchControllers";

const ResearchManagement = () => {
  const statusOptions = Object.values(RESEARCH_STATUS).map((status) => ({
    label: status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase()),
    value: status,
  }));

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const { showModal } = useModal();
  const { setSnackbar } = useSnackbar();

  const { data: researchData, fetchResearchData, loading } = useResearchData();
  useEffect(() => {
    fetchResearchData({ page: page === 0 ? 1 : page, limit });
  }, []);

  const handleStatusChange = async (
    researchId: string | number,
    newStatus: string,
  ) => {
    if (
      newStatus === RESEARCH_STATUS.REJECTED_BY_ADMIN ||
      newStatus === RESEARCH_STATUS.REJECTED
    ) {
      showModal(
        <RejectResearch
          researchId={researchId}
          status={newStatus}
          onSuccess={() =>
            fetchResearchData({ page: page === 0 ? 1 : page, limit })
          }
        />,
        { width: "500px" },
      );
    } else {
      try {
        const response: any = await ResearchControllers.updateResearchStatus(
          researchId,
          { status: newStatus },
        );
        if (
          response.success ||
          response.statusCode === 200 ||
          response.message ||
          response.data
        ) {
          setSnackbar("Research status updated successfully", "success");
          fetchResearchData({ page: page === 0 ? 1 : page, limit });
        }
      } catch (error: any) {
        setSnackbar(
          error.response?.data?.message || "Failed to update status",
          "error",
        );
      }
    }
  };

  return (
    <div>
      <Card sx={{ p: 2 }}>
        <Typography
          sx={{
            fontSize: 25,
            fontFamily: roboto.style.fontFamily,
            fontWeight: 600,
          }}
        >
          Research Management
        </Typography>
        <Grid container sx={{ mt: 2 }} spacing={2}>
          <Grid size={4}>
            <Autocomplete
              options={statusOptions}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Status" />
              )}
            />
          </Grid>
          <Grid size={8}>
            <TextField placeholder="Search by title, subtitle..." fullWidth />
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {RESEARCH_TABLE_HEADER_DATA.map((val, i) => (
                  <TableCell
                    sx={{ fontSize: 16, fontFamily: poppins.style.fontFamily }}
                  >
                    {val}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {researchData?.data?.map((val, i) => (
                <TableRow key={i}>
                  <TableCell
                    sx={{ fontSize: 14, fontFamily: poppins.style.fontFamily }}
                  >
                    {val.id}
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 250,
                      overflow: "hidden",
                      fontSize: 14,
                      fontFamily: poppins.style.fontFamily,
                    }}
                  >
                    {val.title}
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: 14, fontFamily: poppins.style.fontFamily }}
                  >
                    {val.topic || "--"}
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: 14, fontFamily: poppins.style.fontFamily }}
                  >
                    {val.teamId
                      ? val.team?.title
                      : val.creator.fullName ||
                        val.creator.firstName + " " + val.creator.lastName ||
                        "--"}
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: 14, fontFamily: poppins.style.fontFamily }}
                  >
                    {val.school.name}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={val.status}
                      onChange={(e) =>
                        handleStatusChange(val.id, e.target.value)
                      }
                      sx={{
                        fontSize: 14,
                        fontFamily: poppins.style.fontFamily,
                        borderRadius: "100px",
                        p: 0,
                      }}
                    >
                      {RESEARCH_STATUS_DATA.map((status, index) => (
                        <MenuItem
                          key={index}
                          value={status.value}
                          sx={{
                            fontSize: 14,
                            fontFamily: poppins.style.fontFamily,
                          }}
                        >
                          {status.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <IconButton>
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
};

export default ResearchManagement;
