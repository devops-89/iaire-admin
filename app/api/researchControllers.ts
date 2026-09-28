import { researchAPI } from "./config";
import { API_REQUEST, GET_RESEARCH_RESPONSE } from "@/utils/type";

export const ResearchControllers = {
  getAllResearchSubmissions: async ({ search, page, limit }: API_REQUEST) => {
    try {
      const response = await researchAPI.get<GET_RESEARCH_RESPONSE>("/all", {
        params: {
          search: search,
          page: page,
          limit: limit,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateResearchStatus: async (
    id: number | string,
    data: { status: string; reviewComments?: string },
  ) => {
    try {
      const response = await researchAPI.patch(`/update/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
