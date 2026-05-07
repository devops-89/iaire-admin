import { useState, useEffect } from "react";
import { SchoolsControllers } from "@/app/api/schoolsControllers";
import { BoardAnalytics } from "@/utils/type";
import useSnackbar from "@/store/useSnackbar";

export const useSchools = () => {
  const [boardAnalytics, setBoardAnalytics] = useState<BoardAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSnackbar } = useSnackbar();

  const fetchBoardAnalytics = async () => {
    setLoading(true);
    try {
      const response: any = await SchoolsControllers.getBoardWiseAnalytics();
      if (response.data.success) {
        setBoardAnalytics(response.data.data);
      }
    } catch (error: any) {
      setSnackbar(error.response?.data?.message || "Failed to fetch board analytics", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardAnalytics();
  }, []);

  return {
    boardAnalytics,
    loading,
    fetchBoardAnalytics,
  };
};
