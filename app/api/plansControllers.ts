import { CREATE_PLAN_REQUEST, UPDATE_PLAN_REQUEST } from "@/utils/type";
import { plansApi } from "./config";

export const PlansControllers = {
  createPlan: async (data: CREATE_PLAN_REQUEST) => {
    try {
      const result = await plansApi.post("/plans/add-plan", data);
      return result;
    } catch (error) {
      throw error;
    }
  },

  getAllPlans: async (page = 1, limit = 10) => {
    try {
      const result = await plansApi.get("/plans/all", {
        params: { page, limit },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  deletePlan: async (id: number) => {
    try {
      const result = await plansApi.delete(`/plans/${id}`);
      return result;
    } catch (error) {
      throw error;
    }
  },

  updatePlan: async (id: number, data: UPDATE_PLAN_REQUEST) => {
    try {
      const result = await plansApi.patch(`/plans/${id}`, data);
      return result;
    } catch (error) {
      throw error;
    }
  },
};
