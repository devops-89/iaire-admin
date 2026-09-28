import { ResearchControllers } from "@/app/api/researchControllers";
import { API_REQUEST, GET_RESEARCH_RESPONSE } from "@/utils/type";
import { useState } from "react";

export const useResearchData = () => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<GET_RESEARCH_RESPONSE>();

  const fetchResearchData = async ({ page, limit, search }: API_REQUEST) => {
    setLoading(true);
    try {
      const response = await ResearchControllers.getAllResearchSubmissions({
        page,
        limit,
        search,
      });
      setData(response);
    } catch (error) {
      console.log("error in fetching Research Publications Listing", error);
    } finally {
      setLoading(false);
    }
  };
  return {
    fetchResearchData,
    loading,
    data,
  };
};
