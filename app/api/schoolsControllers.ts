import { boardsApi } from "./config";

export const SchoolsControllers = {
  getBoardWiseAnalytics: async () => {
    try {
      const response = await boardsApi.get(`/admin/dashboard/analytics`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
