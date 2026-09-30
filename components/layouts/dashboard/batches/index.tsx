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

const BatchesManagement = () => {
  const { fetchBatches, batches, loading } = useBatches();

  const [category, setCategory] = useState<string>("ALL");
  const [role, setRole] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeRecord, setActiveRecord] = useState<Batch | null>(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const { showModal } = useModal();

  // Initial load
  useEffect(() => {
    fetchBatches({
      page: 1,
      limit: rowsPerPage,
      search: searchTerm.trim() || undefined,
      role: role || undefined,
      category: category !== "ALL" ? category : undefined,
    });
  }, [page, rowsPerPage]);

  // Debounced search handling
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(0);
      fetchBatches({
        page: 1,
        limit: rowsPerPage,
        search: searchTerm.trim() || undefined,
        role: role || undefined,
        category: category !== "ALL" ? category : undefined,
      });
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(0);
    fetchBatches({
      page: 1,
      limit: rowsPerPage,
      search: searchTerm.trim() || undefined,
      role: role || undefined,
      category: newCategory !== "ALL" ? newCategory : undefined,
    });
  };

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    setPage(0);
    fetchBatches({
      page: 1,
      limit: rowsPerPage,
      search: searchTerm.trim() || undefined,
      role: newRole || undefined,
      category: category !== "ALL" ? category : undefined,
    });
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    fetchBatches({
      page: newPage + 1,
      limit: rowsPerPage,
      search: searchTerm.trim() || undefined,
      role: role || undefined,
      category: category !== "ALL" ? category : undefined,
    });
  };

  const handleRowsPerChange = (limit: number) => {
    setRowsPerPage(limit);
    setPage(0);
    fetchBatches({
      page: 1,
      limit: limit,
      search: searchTerm.trim() || undefined,
      role: role || undefined,
      category: category !== "ALL" ? category : undefined,
    });
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

  const handleRowClick = (record: Batch) => {
    setActiveRecord(record);
    setOpenDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setOpenDetailsModal(false);
    setActiveRecord(null);
  };

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <BatchesHeader
        onCreateBatch={() => showModal(<AddBatches />)}
        totalCount={batches?.pagination?.total}
      />

      <Box sx={{ my: 3 }}>
        <BatchesSearch
          value={searchTerm}
          onChange={setSearchTerm}
          categoryValue={category}
          onCategoryChange={handleCategoryChange}
          roleValue={role}
          onRoleChange={handleRoleChange}
        />
      </Box>

      <BatchesTable
        loading={loading}
        batches={batches?.data}
        totalCount={batches?.pagination?.total || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleRowsPerChange}
        onMenuOpen={handleMenuOpen}
        onRowClick={handleRowClick}
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
