import { researchAPI } from "./config";
import { GET_RESEARCH_RESPONSE } from "@/utils/type";

export const ResearchControllers = {
  getAllResearchSubmissions: async (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const response = await researchAPI.get<GET_RESEARCH_RESPONSE>("/all", {
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateResearchStatus: async (
    id: number | string,
    data: { status: string; reviewComments?: string }
  ) => {
    try {
      const response = await researchAPI.patch(`/update/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
