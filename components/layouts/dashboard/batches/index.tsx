"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useBatches } from "@/hooks/common/useBatches";
import { useModal } from "@/store/useModal";
import AddBatches from "@/modals/AddBatches";
import { Batch } from "@/utils/type";

import BatchesHeader from "./BatchesHeader";
import BatchesSearch from "./BatchesSearch";
import BatchesTable from "./BatchesTable";
import BatchActionsMenu from "./BatchActionsMenu";
import BatchDetailsDialog from "./BatchDetailsDialog";
import { CATEGORY } from "@/utils/enum";

const BatchesManagement = () => {
  const { fetchBatches, batches, loading } = useBatches();

  const [tabValue, setTabValue] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeRecord, setActiveRecord] = useState<Batch | null>(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [role, setRole] = useState({
    label: "",
    value: "",
  });
  const { showModal } = useModal();

  const handleChangePage = (page: number) => {
    setPage(page);
    fetchBatches({ page: page + 1, limit: rowsPerPage });
  };

  const handleRowsPerChange = (limit: number) => {
    setRowsPerPage(limit);
    fetchBatches({ page: page, limit: limit });
  };

  useEffect(() => {
    fetchBatches({ page: page + 1, limit: rowsPerPage });
  }, [page, rowsPerPage]);

  const handleTabChange = (_: React.SyntheticEvent, value: string) => {
    setTabValue(value);
    if (value === "ALL") {
      fetchBatches({ page: page + 1, limit: rowsPerPage });
    } else {
      fetchBatches({ page: page + 1, limit: rowsPerPage, search: value });
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleSelectRole = (newValue: string) => {
    console.log("newvlaue", newValue);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    record: Batch,
  ) => {
    setAnchorEl(event.currentTarget);
    setActiveRecord(record);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveRecord(null);
  };

  const handleViewDetails = () => {
    if (activeRecord) {
      setOpenDetailsModal(true);
      setAnchorEl(null);
    }
  };

  const handleCloseDetails = () => {
    setOpenDetailsModal(false);
    setActiveRecord(null);
  };

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 4 }}
    >
      <BatchesHeader onCreateBatch={() => showModal(<AddBatches />)} />

      <BatchesSearch
        value={searchTerm}
        onChange={handleSearchChange}
        onRoleSelection={handleSelectRole}
      />

      <BatchesTable
        loading={loading}
        batches={batches?.data}
        totalCount={batches?.pagination?.total || 0}
        tabValue={tabValue}
        page={page}
        rowsPerPage={batches?.pagination?.limit || 0}
        onTabChange={handleTabChange}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleRowsPerChange}
        onMenuOpen={handleMenuOpen}
      />

      <BatchActionsMenu
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        onViewDetails={handleViewDetails}
      />

      <BatchDetailsDialog
        open={openDetailsModal}
        record={activeRecord}
        onClose={handleCloseDetails}
      />
    </Box>
  );
};

export default BatchesManagement;
