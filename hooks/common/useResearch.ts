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

  const fetchResearchData = async (search?: string) => {
    try {
      setLoading(true);
      const res = await ResearchControllers.getAllResearchSubmissions(
        search ? { search } : undefined
      );

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
    fetchResearchData,
    updateStatus,
  };
};
