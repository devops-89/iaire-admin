import { platformControllers } from "@/app/api/platformControllers";
import { useState } from "react";

export interface StatItem {
  title: string;
  count: number;
}

export interface DashboardData {
  users: StatItem[];
  patents: StatItem[];
  researchPublications: StatItem[];
  startups: StatItem[];
}

export const useDashboardCount = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardData | undefined>();

  const getDashboardCount = async () => {
    setLoading(true);

    try {
      const result = await platformControllers.getDashboardCount();
      setLoading(false);
      setData(result.data);
    } catch (error) {
      setLoading(false);
      console.log("error in fetching dashboard count", error);
    }
  };

  return {
    getDashboardCount,
    loading,
    data,
  };
};
