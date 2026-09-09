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
      setSnackbar(
        error.response?.data?.message || "Failed to fetch board analytics",
        "error",
      );
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

export const getSchoolByBoardId = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  async function fetchSchoolByBoardId(id: string) {
    try {
      setLoading(true);
      let response: any = await SchoolsControllers.getSchoolByBoardsId(id);
      if (response.data && response.data.data) {
        setData(response.data.data);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    data,
    loading,
    fetchSchoolByBoardId,
  };
};
