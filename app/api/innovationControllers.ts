import { innovationAPI } from "./config";

export const innovationControllers = {
  getInnovations: async () => {
    try {
      const response = await innovationAPI.get("/all");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
