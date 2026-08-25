"use client";
import { useInnovationList } from "@/hooks/common/useInnovations";
import { INNOVATION_STATUS_DATA } from "@/utils/constant";
import { roboto } from "@/utils/fonts";
import {
  Autocomplete,
  Card,
  Grid,
  Stack,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import InnovationTable from "./Innovation_table";

const InnovationList = () => {
  const { innovationData, getInnovationList, updateInnovationStatus } =
    useInnovationList();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    getInnovationList({ page: page === 0 ? 1 : page, limit });
  }, []);

  const handleStatusChange = async (id: number | string, status: string) => {
    const success = await updateInnovationStatus(id, status);
    if (success) {
      getInnovationList({ page: page === 0 ? 1 : page, limit });
    }
  };

  return (
    <div>
      <Card sx={{ p: 2 }}>
        <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Typography
            sx={{
              fontSize: 20,
              fontFamily: roboto.style.fontFamily,
              fontWeight: 800,
              color: "#09090B",
            }}
          >
            Innovation Management
          </Typography>
        </Stack>
        <Grid container sx={{ mt: 2 }} spacing={4}>
          <Grid size={4}>
            <Autocomplete
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Status" />
              )}
              options={INNOVATION_STATUS_DATA}
              getOptionLabel={(option) => option.label}
            />
          </Grid>
          <Grid size={8}>
            <TextField placeholder="Search.." fullWidth />
          </Grid>
        </Grid>

        <InnovationTable
          innovationData={innovationData}
          onStatusChange={handleStatusChange}
        />
        <TablePagination
          component="div"
          count={innovationData?.pagination?.total || 0}
          page={innovationData?.pagination?.page || 0}
          rowsPerPage={innovationData?.pagination?.limit || 10}
          onPageChange={(e, newPage) => {
            setPage(newPage);
            getInnovationList({
              page: newPage,
              limit: innovationData?.pagination?.limit || 10,
            });
          }}
          onRowsPerPageChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(0);
            getInnovationList({
              page: 1,
              limit: Number(e.target.value),
            });
          }}
        />
      </Card>
    </div>
  );
};

export default InnovationList;
