import { useState, useEffect } from "react";
import { PatentsControllers } from "@/app/api/patentsControllers";
import { Patent, Pagination, CREATE_PATENT_REQUEST, UPDATE_PATENT_REQUEST } from "@/utils/type";
import useSnackbar from "@/store/useSnackbar";

export const usePatents = () => {
  const [patents, setPatents] = useState<Patent[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
  });

  const { setSnackbar } = useSnackbar();

  const fetchPatents = async (page = 1, limit = 6) => {
    setLoading(true);
    try {
      const response: any = await PatentsControllers.getAllPatents(page, limit);
      if (response.data.success) {
        setPatents(response.data.data.patents || []);
        setPagination(response.data.data.pagination);
      }
    } catch (error: any) {
      setSnackbar(error.response?.data?.message || "Failed to fetch patents", "error");
    } finally {
      setLoading(false);
    }
  };

  const createPatent = async (data: CREATE_PATENT_REQUEST) => {
    setCreating(true);
    try {
      const response: any = await PatentsControllers.createPatent(data);
      if (response.data.success) {
        setSnackbar("Patent added successfully", "success");
        fetchPatents(pagination.page, pagination.limit);
        return true;
      }
    } catch (error: any) {
      setSnackbar(error.response?.data?.message || "Failed to add patent", "error");
    } finally {
      setCreating(false);
    }
    return false;
  };

  const updatePatent = async (id: number, data: UPDATE_PATENT_REQUEST) => {
    setUpdating(true);
    try {
      const response: any = await PatentsControllers.updatePatent(id, data);
      if (response.data.success) {
        setSnackbar("Patent updated successfully", "success");
        fetchPatents(pagination.page, pagination.limit);
        return true;
      }
    } catch (error: any) {
      setSnackbar(error.response?.data?.message || "Failed to update patent", "error");
    } finally {
      setUpdating(false);
    }
    return false;
  };

  const deletePatent = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this patent?")) return;
    try {
      const response: any = await PatentsControllers.deletePatent(id);
      if (response.data.success) {
        setSnackbar("Patent deleted successfully", "success");
        fetchPatents(pagination.page, pagination.limit);
      }
    } catch (error: any) {
      setSnackbar(error.response?.data?.message || "Failed to delete patent", "error");
    }
  };

  const goToPage = (page: number) => {
    fetchPatents(page, pagination.limit);
  };

  useEffect(() => {
    fetchPatents();
  }, []);

  return {
    patents,
    loading,
    creating,
    updating,
    pagination,
    createPatent,
    updatePatent,
    deletePatent,
    fetchPatents,
    goToPage,
  };
};
