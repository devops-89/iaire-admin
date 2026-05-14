import { CREATE_PLAN_REQUEST, UPDATE_PLAN_REQUEST } from "@/utils/type";
import { plansApi } from "./config";

export const PlansControllers = {
  createPlan: async (data: CREATE_PLAN_REQUEST) => {
    try {
      const result = await plansApi.post("/add-plan", data);
      return result;
    } catch (error) {
      throw error;
    }
  },

  getAllPlans: async (page = 1, limit = 10) => {
    try {
      const result = await plansApi.get("/all", {
        params: { page, limit },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  deletePlan: async (id: number) => {
    try {
      const result = await plansApi.delete(`/${id}`);
      return result;
    } catch (error) {
      throw error;
    }
  },

  updatePlan: async (id: number, data: UPDATE_PLAN_REQUEST) => {
    try {
      const result = await plansApi.patch(`/${id}`, data);
      return result;
    } catch (error) {
      throw error;
    }
  },
};
