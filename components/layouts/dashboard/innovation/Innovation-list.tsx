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
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import InnovationTable from "./Innovation_table";

const InnovationList = () => {
  const { innovationData, getInnovationList, updateInnovationStatus, loading } =
    useInnovationList();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [statusLoading, setStatusLoading] = useState<number | string | null>(
    null,
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getInnovationList({
        page: page === 0 ? 1 : page,
        limit,
        status: status?.value || undefined,
        search: search || undefined,
      });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [page, limit, status, search]);

  const handleStatusChange = async (id: number | string, newStatus: string, reason?: string) => {
    setStatusLoading(id);
    const success = await updateInnovationStatus(id, newStatus, reason);
    if (success) {
      await getInnovationList({
        page: page === 0 ? 1 : page,
        limit,
        status: status?.value || undefined,
        search: search || undefined,
      });
    }
    setStatusLoading(null);
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
              value={status}
              onChange={(e, newValue) => {
                setStatus(newValue);
                setPage(0);
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Status" />
              )}
              options={INNOVATION_STATUS_DATA}
              getOptionLabel={(option) => option.label}
            />
          </Grid>
          <Grid size={8}>
            <TextField
              placeholder="Search.."
              fullWidth
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: loading ? (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ) : null,
                },
              }}
            />
          </Grid>
        </Grid>

        <InnovationTable
          innovationData={innovationData}
          onStatusChange={handleStatusChange}
          statusLoading={statusLoading}
        />
        <TablePagination
          component="div"
          count={innovationData?.pagination?.total || 0}
          page={innovationData?.pagination?.page || 0}
          rowsPerPage={innovationData?.pagination?.limit || 10}
          onPageChange={(e, newPage) => {
            setPage(newPage);
          }}
          onRowsPerPageChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(0);
          }}
        />
      </Card>
    </div>
  );
};

export default InnovationList;
