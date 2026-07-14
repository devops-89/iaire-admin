"use client";

import { innovationControllers } from "@/app/api/innovationControllers";
import { INNOVATION_RESPONSE_DATA_PROPS } from "@/utils/type";
import { useState } from "react";
import useSnackbar from "@/store/useSnackbar";

export const useInnovations = () => {
  const [innovationData, setInnovationData] = useState<INNOVATION_RESPONSE_DATA_PROPS[]>([]);
  const [innovationDetails, setInnovationDetails] = useState<INNOVATION_RESPONSE_DATA_PROPS | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { setSnackbar } = useSnackbar();

  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const fetchData = async (search?: string, page: number = 1, limit: number = 10, status?: string) => {
    try {
      setLoading(true);
      const res = await innovationControllers.getInnovations(search, page, limit, status);
      console.log("innovation", res);
      const payload = res?.data;
      if (Array.isArray(payload)) {
        setInnovationData(payload);
        if (res?.pagination) {
          setPagination(res.pagination);
        }
      } else {
        setInnovationData(payload?.data || []);
        if (payload?.pagination) {
          setPagination(payload.pagination);
        } else if (res?.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      console.error("error in innovation list", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (id: number | string) => {
    try {
      setLoadingDetails(true);
      const res = await innovationControllers.getInnovationDetails(id);
      console.log("innovation details", res);
      const details = res?.data?.data || res?.data || res;
      setInnovationDetails(details);
      return details;
    } catch (err) {
      console.error("error in fetching innovation details", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const updateStatus = async (id: number | string, status: string, reviewComments?: string) => {
    try {
      setUpdatingStatus(true);
      const res = await innovationControllers.updateInnovation(id, { status, reviewComments });
      if (res?.success) {
        setSnackbar("Innovation status updated successfully", "success");
        // Refetch list and details
        await fetchDetails(id);
        await fetchData();
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("error in updating innovation status", err);
      const errorMessage = err?.response?.data?.message || "Failed to update innovation status";
      setSnackbar(errorMessage, "error");
      return false;
    } finally {
      setUpdatingStatus(false);
    }
  };

  return {
    innovationData,
    innovationDetails,
    loading,
    loadingDetails,
    updatingStatus,
    pagination,
    fetchData,
    fetchDetails,
    updateStatus,
    setInnovationDetails,
  };
};
