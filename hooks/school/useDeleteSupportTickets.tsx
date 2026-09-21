import { SchoolsControllers } from "@/app/api/schoolsControllers";
import { useModal } from "@/store/useModal";
import { useState } from "react";

export const useDeleteSupportTickets = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>();
  const { hideModal } = useModal();
  const deleteSupportTickets = async (id: string | number) => {
    try {
      setLoading(true);
      const response = await SchoolsControllers.deleteTickets(id);
      setData(response);
      hideModal();
    } catch (error) {
      setError("error in deleting Support tickets");
      console.log("error in deleting Support tickets", error);
    } finally {
      setLoading(false);
    }
  };
  return {
    data,
    loading,
    error,
    deleteSupportTickets,
  };
};
