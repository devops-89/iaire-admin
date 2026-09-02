import { platformControllers } from "@/app/api/platformControllers";
import { useState } from "react";

export const useDashboardCount = () => {
  const [loading, setLoading] = useState(false);

  const getDashboardCount = async () => {
    setLoading(true);

    try {
      const result = await platformControllers.getDashboardCount();
      setLoading(false);
      return result.data;
    } catch (error) {
      setLoading(false);
      console.log("error in fetching dashboard count", error);
    }
  };

  return {
    getDashboardCount,
    loading,
  };
};
