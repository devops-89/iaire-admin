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

  const fetchData = async (search?: string) => {
    try {
      setLoading(true);
      const res = await innovationControllers.getInnovations(search);
      console.log("innovation", res);
      setInnovationData(res?.data?.data || []);
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
    fetchData,
    fetchDetails,
    updateStatus,
    setInnovationDetails,
  };
};
