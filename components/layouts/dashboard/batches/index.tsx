"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";

import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";
import { Add, MoreVert } from "@mui/icons-material";
import { useBatches } from "@/hooks/common/useBatches";
import { BATCH_TABLE_HEADER, BATCH_TABLE_TABS } from "@/utils/constant";
import moment from "moment";
import { useModal } from "@/store/useModal";
import AddBatches from "@/modals/AddBatches";

const FS = { fontFamily: poppins.style.fontFamily };

const BatchesManagement = () => {
  const { fetchBatches, batches, loading, pagination } = useBatches();
  const [tabValue, setTabValue] = useState("ALL");

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const { showModal } = useModal();
  const addBatches = () => {
    showModal(<AddBatches />);
  };
  return (
    <Card sx={{ p: 2, boxShadow: "none", borderRadius: 2 }}>
      <Stack
        component="div"
        direction="row"
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography
          sx={{
            ...FS,
            color: COLORS.PRIMARY_NAVY,
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          Batch Management
        </Typography>
        <Button
          sx={{
            ...FS,
            textTransform: "none",
            backgroundColor: COLORS.PRIMARY_NAVY,
            color: COLORS.WHITE,
            padding: "8px 20px",
            borderRadius: "8px",
          }}
          endIcon={<Add />}
          onClick={addBatches}
        >
          Create Batches
        </Button>
      </Stack>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mt: 2, mb: 2 }}>
        {BATCH_TABLE_TABS.map((v, i) => (
          <Tab label={v.label} value={v.value} key={i} />
        ))}
      </Tabs>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {BATCH_TABLE_HEADER.map((val, i) => (
                <TableCell sx={{ ...FS }} key={i}>
                  {val}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {batches.map((val, i) => (
              <TableRow key={i}>
                <TableCell sx={{ ...FS }}>{val.id}</TableCell>
                <TableCell sx={{ ...FS }}>{val.name || "--"}</TableCell>
                <TableCell sx={{ ...FS }}>
                  {moment(val.startDate).format("YYYY, MMM DD")}
                </TableCell>
                <TableCell sx={{ ...FS }}>
                  {moment(val.endDate).format("YYYY, MMM DD")}
                </TableCell>
                <TableCell sx={{ ...FS }}>{val.status}</TableCell>
                <TableCell sx={{ ...FS }}>{val.category}</TableCell>
                <TableCell>
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default BatchesManagement;
