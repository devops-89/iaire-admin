import { honorariumsApi } from "./config";

/**
 * Honorarium Controllers
 * Handles all API interactions related to Honorarium Management:
 * 1. Fetch all honorariums with pagination, search, and status filters
 * 2. Fetch specific honorarium details by ID
 * 3. Update honorarium request status and details (Admin action)
 */
export const HonorariumControllers = {
  /**
   * Get all honorarium requests with pagination and filters
   * Endpoint: GET /honorariums/all
   */
  getAllHonorariums: async (
    page = 1,
    limit = 10,
    status?: string,
    search?: string,
  ) => {
    try {
      const response = await honorariumsApi.get("/all", {
        params: {
          page,
          limit,
          ...(status && status !== "ALL" && { status }),
          ...(search && { search }),
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get single honorarium details by ID
   * Endpoint: GET /honorariums/:id
   */
  getHonorariumDetails: async (id: number | string) => {
    try {
      const response = await honorariumsApi.get(`/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update honorarium status (Admin action: approve, reject, mark as paid, etc.)
   * Endpoint: PATCH /honorariums/:id
   */
  updateHonorariumStatus: async (
    id: number | string,
    data: {
      status: string;
      amount?: number | null;
      remarks?: string;
      [key: string]: any;
    },
  ) => {
    try {
      const response = await honorariumsApi.patch(`/${id}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
