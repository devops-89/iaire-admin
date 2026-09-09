import { boardsApi, userSecuredApi } from "./config";

export const SchoolsControllers = {
  getBoardWiseAnalytics: async () => {
    try {
      const response = await boardsApi.get(`/admin/dashboard/analytics`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  getHeadBoyorGirlsNomination: async () => {
    try {
      const result = await userSecuredApi.get("/head-nominations/list");
      return result;
    } catch (error) {
      throw error;
    }
  },

  getSchoolByBoardsId: async (id: string) => {
    try {
      let result = await boardsApi.get(`${id}/schools`);
      return result;
    } catch (error) {
      throw error;
    }
  },
};
