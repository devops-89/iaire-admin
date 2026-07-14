import { useState, useEffect } from "react";
import { BatchControllers } from "@/app/api/batchControllers";
import {
  Batch,
  Pagination,
  CREATE_BATCH_REQUEST,
  UPDATE_BATCH_REQUEST,
} from "@/utils/type";
import useSnackbar from "@/store/useSnackbar";
import { useModal } from "@/store/useModal";

export const useBatches = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const { setSnackbar } = useSnackbar();
  const { hideModal } = useModal();

  const fetchBatches = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response: any = await BatchControllers.getBatches(page, limit);
      if (response.data.success) {
        const payload = response.data.data;
        if (Array.isArray(payload)) {
          setBatches(payload);
          setPagination({ page: 1, limit: payload.length, total: payload.length, totalPages: 1 });
        } else {
          setBatches(payload?.data || []);
          setPagination(payload?.meta || { page: 1, limit: 10, total: 0, totalPages: 0 });
        }
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
        fetchBatches(pagination.page, pagination.limit);
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
        fetchBatches(pagination.page, pagination.limit);
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

  const goToPage = (page: number) => {
    fetchBatches(page, pagination.limit);
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  return {
    batches,
    loading,
    creating,
    updating,
    pagination,
    fetchBatches,
    createBatch,
    updateBatch,

    goToPage,
  };
};
