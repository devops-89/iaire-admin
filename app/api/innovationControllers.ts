import { innovationAPI } from "./config";

export const innovationControllers = {
  getInnovations: async (search?: string) => {
    try {
      const response = await innovationAPI.get("/all", {
        params: search ? { search } : {},
      });
      return response.data;
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

  updateInnovation: async (id: number | string, data: { status: string; reviewComments?: string }) => {
    try {
      const response = await innovationAPI.patch(`/update/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
