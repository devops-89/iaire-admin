import { useState } from "react";
import { HonorariumControllers } from "@/app/api/honorariumControllers";
import {
  HonorariumItem,
  HONORARIUMS_RESPONSE,
  UPDATE_HONORARIUM_STATUS_REQUEST,
} from "@/utils/type";
import useSnackbar from "@/store/useSnackbar";
export const useHonorariums = () => {
  const [honorariums, setHonorariums] = useState<HONORARIUMS_RESPONSE>();
  const [honorariumDetails, setHonorariumDetails] = useState<HonorariumItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { setSnackbar } = useSnackbar();
  const fetchHonorariums = async (
    page = 1,
    limit = 10,
    status?: string,
    search?: string,
  ) => {
    setLoading(true);
    try {
      const currentStatus = status === "ALL" ? undefined : status;
      const response: any = await HonorariumControllers.getAllHonorariums(
        page,
        limit,
        currentStatus,
        search,
      );

      setHonorariums(response?.data);
    } catch (error: any) {
      setSnackbar(
        error.response?.data?.message || "Failed to fetch honorariums",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };


  const fetchHonorariumDetails = async (id: number | string) => {
    setLoadingDetails(true);
    try {
      const response: any = await HonorariumControllers.getHonorariumDetails(id);
      if (response?.data?.success) {
        const details = response.data.data?.data || response.data.data;
        setHonorariumDetails(details);
        return details;
      }
    } catch (error: any) {
      setSnackbar(
        error.response?.data?.message || "Failed to fetch honorarium details",
        "error",
      );
    } finally {
      setLoadingDetails(false);
    }
    return null;
  };

  const updateStatus = async (
    id: number | string,
    payload: UPDATE_HONORARIUM_STATUS_REQUEST,
  ) => {
    setUpdating(true);
    try {
      const response: any = await HonorariumControllers.updateHonorariumStatus(
        id,
        payload,
      );
      if (response?.data?.success) {
        setSnackbar(
          response.data.message || "Honorarium status updated successfully",
          "success",
        );
        return true;
      }
    } catch (error: any) {
      setSnackbar(
        error.response?.data?.message || "Failed to update honorarium status",
        "error",
      );
    } finally {
      setUpdating(false);
    }
    return false;
  };

  return {
    honorariums,
    honorariumDetails,
    setHonorariumDetails,
    loading,
    loadingDetails,
    updating,
    fetchHonorariums,
    fetchHonorariumDetails,
    updateStatus,
  };
};
