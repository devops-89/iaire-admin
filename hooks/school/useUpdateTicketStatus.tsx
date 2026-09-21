import { SchoolsControllers } from "@/app/api/schoolsControllers";
import { useState } from "react";

export const useUpdateTicketStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateTicketStatus = async (id: string, status: string) => {
    try {
      setLoading(true);
      const response = await SchoolsControllers.updateTicketStatus(id, status);
      console.log("response from update ticket ", response);
    } catch (error) {
      setError("error in updating ticket status");
      console.log("error in updating ticket status", error);
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    error,
    updateTicketStatus,
  };
};
