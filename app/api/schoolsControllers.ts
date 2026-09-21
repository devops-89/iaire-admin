import {
  boardsApi,
  needAssistance,
  schoolSecuredAPI,
  userSecuredApi,
} from "./config";

export const SchoolsControllers = {
  getBoardWiseAnalytics: async (
    page: number | string = 1,
    limit: number | string = 10,
  ) => {
    try {
      const response = await boardsApi.get(
        `/admin/dashboard/analytics?page=${page}&limit=${limit}`,
      );
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

  getSchoolByBoardsId: async (
    id: string,
    page: number | string,
    limit: number | string,
  ) => {
    try {
      let result = await boardsApi.get(
        `${id}/schools?page=${page}&limit=${limit}`,
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getSchoolDetails: async (id: string) => {
    try {
      let response = await schoolSecuredAPI.get(`/${id}/users`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  getUserDetails: async (id: string) => {
    try {
      let result = await userSecuredApi.get(`/details/${id}`);
      return result;
    } catch (error) {
      throw error;
    }
  },
  getHeadNomination: async () => {
    try {
      let result = await userSecuredApi.get("/head-nominations/list");
      return result;
    } catch (error) {
      throw error;
    }
  },

  getAllUsers: async (
    page: number | string,
    limit: number | string,
    role: string,
    country?: string,
  ) => {
    try {
      let result = await userSecuredApi.get(`/all`, {
        params: {
          page,
          limit,
          role,
          countryName: country,
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllSupportTickets: async () => {
    try {
      let result = await needAssistance.get(`/all`);
      return result;
    } catch (error) {
      throw error;
    }
  },
  deleteTickets: async (id: number | string) => {
    try {
      let result = await needAssistance.delete(`/${id}`);
      return result;
    } catch (error) {
      throw error;
    }
  },
  updateTicketStatus: async (id: string, status: string) => {
    try {
      let result = await needAssistance.patch(`/${id}/status`, {
        status: status,
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
};
