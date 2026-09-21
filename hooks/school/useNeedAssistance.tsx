import { SchoolsControllers } from "@/app/api/schoolsControllers";
import { useState } from "react";

export const useGetAllNeedAssistance = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();

  const getAllSupportTickets = async () => {
    setLoading(true);
    try {
      const response = await SchoolsControllers.getAllSupportTickets();
      setData(response.data);
    } catch (error) {
      console.log("error in fetching tickets", error);
    } finally {
      setLoading(false);
    }
  };
  return {
    data,
    loading,
    getAllSupportTickets,
  };
};
