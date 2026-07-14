"use client";

import { ResearchControllers } from "@/app/api/researchControllers";
import { ResearchSubmission } from "@/utils/type";
import { useState } from "react";
import useSnackbar from "@/store/useSnackbar";

export const useResearch = () => {
  const [researchData, setResearchData] = useState<ResearchSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { setSnackbar } = useSnackbar();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchResearchData = async (search?: string, page: number = 1, limit: number = 10, status?: string) => {
    try {
      setLoading(true);
      const params: any = { page, limit };
      if (search) params.search = search;
      
      if (status && status !== "ALL") {
        params.search = params.search ? `${params.search} ${status}` : status;
      }
      
      const res = await ResearchControllers.getAllResearchSubmissions(params);

      // Extract pagination
      const pag = (res as any)?.data?.pagination || (res as any)?.pagination;
      if (pag) {
        setPagination({
          page: pag.page || page,
          limit: pag.limit || limit,
          total: pag.total || 0,
          totalPages: pag.totalPages || 1,
        });
      }

      // Robust array extraction supporting direct payload, success wrapper, or raw arrays
      const dataArray = Array.isArray((res as any)?.data?.data)
        ? (res as any).data.data
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];

      setResearchData(dataArray);
    } catch (err: any) {
      console.error("Error in fetching research submissions", err);
      const errorMessage =
        err?.response?.data?.message || "Failed to fetch research submissions";
      setSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    id: number | string,
    status: string,
    reviewComments?: string
  ) => {
    try {
      setUpdatingStatus(true);
      const res = await ResearchControllers.updateResearchStatus(id, {
        status,
        reviewComments,
      });
      if (res?.success || res?.statusCode === 200 || res?.message) {
        setSnackbar("Research status updated successfully", "success");
        await fetchResearchData();
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Error in updating research status", err);
      const errorMessage =
        err?.response?.data?.message || "Failed to update research status";
      setSnackbar(errorMessage, "error");
      return false;
    } finally {
      setUpdatingStatus(false);
    }
  };

  return {
    researchData,
    loading,
    updatingStatus,
    pagination,
    fetchResearchData,
    updateStatus,
  };
};
