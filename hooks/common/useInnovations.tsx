import {
  INNOVATION_LIST_API_REQUEST_DATA,
  innovationControllers,
} from "@/app/api/innovationControllers";
import { useState } from "react";
import useSnackbar from "@/store/useSnackbar";

export const useInnovationList = () => {
  const [innovationData, setInnovationData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { setSnackbar } = useSnackbar();

  const getInnovationList = async ({
    page,
    limit,
    status,
    search,
  }: INNOVATION_LIST_API_REQUEST_DATA) => {
    try {
      setLoading(true);
      const result = await innovationControllers.getInnovations({
        page,
        limit,
        status,
        search,
      });

      setInnovationData(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateInnovationStatus = async (
    id: number | string,
    status: string,
    reason?: string,
  ) => {
    try {
      setUpdating(true);
      const payload: { status: string; reviewComments?: string } = { status };
      if (reason) {
        payload.reviewComments = reason;
      }
      await innovationControllers.updateInnovation(id, payload);
      setSnackbar("Innovation status updated successfully", "success");
      return true;
    } catch (error: any) {
      console.log("error in updating innovation status", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to update innovation status";
      setSnackbar(errorMessage, "error");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    getInnovationList,
    innovationData,
    loading,
    updating,
    updateInnovationStatus,
  };
};

export const useInnovationDetails = () => {
  const [innovationDetails, setInnovationDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { setSnackbar } = useSnackbar();

  const getInnovationDetails = async (id: number | string) => {
    try {
      setLoading(true);
      const result = await innovationControllers.getInnovationDetails(id);
      setInnovationDetails(result.data || result);
    } catch (error: any) {
      console.log("error in fetching innovation details", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch innovation details";
      setSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    getInnovationDetails,
    innovationDetails,
    loading,
  };
};
