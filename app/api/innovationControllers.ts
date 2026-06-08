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
};
