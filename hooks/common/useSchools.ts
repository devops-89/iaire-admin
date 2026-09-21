import { useState, useEffect } from "react";
import { SchoolsControllers } from "@/app/api/schoolsControllers";
import { BoardAnalytics } from "@/utils/type";
import useSnackbar from "@/store/useSnackbar";

export const useSchools = () => {
  const [boardAnalytics, setBoardAnalytics] = useState<BoardAnalytics[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { setSnackbar } = useSnackbar();

  const fetchBoardAnalytics = async (page: number | string = 1, limit: number | string = 10) => {
    setLoading(true);
    try {
      const response: any = await SchoolsControllers.getBoardWiseAnalytics(page, limit);
      if (response.data.success) {
        setBoardAnalytics(response.data.data);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
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

  return {
    boardAnalytics,
    pagination,
    loading,
    fetchBoardAnalytics,
  };
};

export const getSchoolByBoardId = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  async function fetchSchoolByBoardId(
    id: string,
    page: number | string = 1,
    limit: number | string = 10,
  ) {
    try {
      setLoading(true);
      let response: any = await SchoolsControllers.getSchoolByBoardsId(
        id,
        page,
        limit,
      );
      if (response.data && response.data.data) {
        setData(response.data.data);
        setPagination(response.data.pagination);
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
    pagination,
    fetchSchoolByBoardId,
  };
};

export const useSchoolDetails = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  async function fetchSchoolDetails(id: string) {
    try {
      setLoading(true);
      let response: any = await SchoolsControllers.getSchoolDetails(id);
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
    fetchSchoolDetails,
  };
};

export const useGetUserDetails = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});

  async function fetchUserDetails(id: string) {
    try {
      setLoading(true);
      let response: any = await SchoolsControllers.getUserDetails(id);
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
    fetchUserDetails,
  };
};
