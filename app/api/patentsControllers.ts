import { Patent, CREATE_PATENT_REQUEST, UPDATE_PATENT_REQUEST } from "@/utils/type";
import { patentsApi } from "./config";

export const PatentsControllers = {
  createPatent: async (data: CREATE_PATENT_REQUEST) => {
    try {
      const result = await patentsApi.post("/", data);
      return result;
    } catch (error) {
      throw error;
    }
  },

  getAllPatents: async (page = 1, limit = 10) => {
    try {
      const result = await patentsApi.get(`/all?page=${page}&limit=${limit}`);
      return result;
    } catch (error) {
      throw error;
    }
  },

  deletePatent: async (id: number) => {
    try {
      const result = await patentsApi.delete(`/${id}`);
      return result;
    } catch (error) {
      throw error;
    }
  },

  updatePatent: async (id: number, data: UPDATE_PATENT_REQUEST) => {
    try {
      const result = await patentsApi.patch(`/${id}`, data);
      return result;
    } catch (error) {
      throw error;
    }
  },
};
