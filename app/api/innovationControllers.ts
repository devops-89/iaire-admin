import { innovationAPI } from "./config";

export const innovationControllers = {
  getInnovations: async (search?: string, page: number = 1, limit: number = 10, status?: string) => {
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (status && status !== 'ALL') params.status = status;
      
      const response = await innovationAPI.get("/all", { params });
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
