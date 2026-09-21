import { SchoolsControllers } from "@/app/api/schoolsControllers";
import { BOARDS_LIST_RESPONSE } from "@/utils/type";
import { useState } from "react";

export const useBoardList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BOARDS_LIST_RESPONSE>();
  const fetchBoardList = async ({
    page,
    limit,
    role,
  }: {
    page: number;
    limit: number;
    role: string;
  }) => {
    setLoading(true);
    try {
      const response = await SchoolsControllers.getAllUsers(page, limit, role);
      setData(response?.data);
      setLoading(false);
    } catch (error) {
      console.log("error in getBoards List", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    data,
    fetchBoardList,
  };
};
