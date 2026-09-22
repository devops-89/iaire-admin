import { SchoolsControllers } from "@/app/api/schoolsControllers";
import { useState } from "react";

export const useUpdateHeadNominationStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateHeadNominationStatus = async (id: number | string, status: string, rejectReason?: string) => {
    try {
      setLoading(true);
      const response = await SchoolsControllers.updateHeadNominationStatus(id, status, rejectReason);
      return response;
    } catch (error) {
      setError("error in updating head nomination status");
      console.log("error in updating head nomination status", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateHeadNominationStatus,
  };
};
