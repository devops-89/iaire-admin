import { useState, useEffect } from "react";
import { BatchControllers } from "@/app/api/batchControllers";
import {
  Batch,
  Pagination,
  CREATE_BATCH_REQUEST,
  UPDATE_BATCH_REQUEST,
  BATCHESLIST,
} from "@/utils/type";
import useSnackbar from "@/store/useSnackbar";
import { useModal } from "@/store/useModal";

export const useBatches = () => {
  const [batches, setBatches] = useState<BATCHESLIST>({
    data: [],
    message: "",
    pagination: {
      page: 0,
      limit: 0,
      total: 0,
      totalPages: 0,
    },
    statusCode: 0,
  });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const { setSnackbar } = useSnackbar();
  const { hideModal } = useModal();

  const fetchBatches = async ({
    page,
    limit,
    search,
  }: {
    page: number;
    limit: number;
    search?: string;
  }) => {
    setLoading(true);
    try {
      if (page === 0) {
        page = page + 1;
      }
      const response: any = await BatchControllers.getBatches(
        page,
        limit,
        search,
      );
      if (response.data.success) {
        const payload = response.data;
        setBatches(payload);
      }
    } catch (error: any) {
      setSnackbar(
        error.response?.data?.message || "Failed to fetch batches",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const createBatch = async (data: CREATE_BATCH_REQUEST) => {
    setCreating(true);
    try {
      const response: any = await BatchControllers.createBatch(data);
      if (response.data.success) {
        setSnackbar("Batch created successfully", "success");
        hideModal();
        // fetchBatches(pagination.page, pagination.limit);
        return true;
      }
    } catch (error: any) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.error
        ? Array.isArray(errorData.error)
          ? errorData.error.join(" & ")
          : errorData.error
        : errorData?.message || "Failed to create batch";
      setSnackbar(errorMessage, "error");
    } finally {
      setCreating(false);
    }
    return false;
  };

  const updateBatch = async (id: number, data: UPDATE_BATCH_REQUEST) => {
    setUpdating(true);
    try {
      const response: any = await BatchControllers.updateBatch(id, data);
      if (response.data.success) {
        setSnackbar("Batch updated successfully", "success");
        // fetchBatches(pagination.page, pagination.limit);
        return true;
      }
    } catch (error: any) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.error
        ? Array.isArray(errorData.error)
          ? errorData.error.join(", ")
          : errorData.error
        : errorData?.message || "Failed to update batch";
      setSnackbar(errorMessage, "error");
    } finally {
      setUpdating(false);
    }
    return false;
  };

  return {
    batches,
    loading,
    creating,
    updating,
    // pagination,
    fetchBatches,
    createBatch,
    updateBatch,
  };
};
