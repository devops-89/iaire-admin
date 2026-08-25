import { innovationAPI } from "./config";

export interface INNOVATION_LIST_API_REQUEST_DATA {
  limit: string | number;
  page: string | number;
  search?: string;
  status?: string;
}

export const innovationControllers = {
  getInnovations: async ({
    limit,
    page,
    search,
    status,
  }: INNOVATION_LIST_API_REQUEST_DATA) => {
    try {
      const result = await innovationAPI.get("/all", {
        params: {
          limit,
          page,
          search,
          status,
        },
      });
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  getInnovationDetails: async (id: number | string) => {
    try {
      const response = await innovationAPI.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateInnovation: async (
    id: number | string,
    data: { status: string; reviewComments?: string },
  ) => {
    try {
      const response = await innovationAPI.patch(`/update/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
