import { platformAPI } from "./config";

export const platformControllers = {
  getDashboardCount: async () => {
    try {
      let result = await platformAPI.get("/dashboard/counts");
      return result.data;
    } catch (error) {
      throw error;
    }
  },
};
