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
  ) => {
    try {
      setUpdating(true);
      await innovationControllers.updateInnovation(id, { status });
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
