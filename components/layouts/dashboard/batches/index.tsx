"use client";
import React from "react";
import { Box } from "@mui/material";
import { useBatchLogic } from "./useBatchLogic";
import BatchHeader from "./BatchHeader";
import BatchStats from "./BatchStats";
import BatchTable from "./BatchTable";
import BatchDialog from "./BatchDialog";
import { poppins } from "@/utils/fonts";

const FS = { fontFamily: poppins.style.fontFamily };

const BatchesManagement = () => {
  const batchLogic = useBatchLogic();

  return (
    <Box>
      <BatchHeader 
        onRefresh={() => batchLogic.fetchBatches(batchLogic.pagination.page, batchLogic.pagination.limit)} 
        onCreate={batchLogic.handleCreateOpen} 
        fontStyle={FS} 
      />

      <BatchStats 
        loading={batchLogic.loading} 
        pagination={batchLogic.pagination} 
        batches={batchLogic.batches} 
        fontStyle={FS} 
      />
      
      <BatchTable 
        loading={batchLogic.loading} 
        batches={batchLogic.batches} 
        pagination={batchLogic.pagination} 
        search={batchLogic.search} 
        setSearch={batchLogic.setSearch} 
        onEdit={batchLogic.handleEdit} 
        goToPage={batchLogic.goToPage} 
        fontStyle={FS} 
        poppinsFont={poppins} 
      />

      <BatchDialog 
        open={batchLogic.openDialog} 
        onClose={batchLogic.handleCloseDialog} 
        formik={batchLogic.formik} 
        selectedBatch={batchLogic.selectedBatch} 
        creating={batchLogic.creating} 
        updating={batchLogic.updating} 
        fontStyle={FS} 
        poppinsFont={poppins} 
      />
    </Box>
  );
};

export default BatchesManagement;
