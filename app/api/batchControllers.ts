import { batchesApi } from "./config";
import { CREATE_BATCH_REQUEST, UPDATE_BATCH_REQUEST } from "@/utils/type";

export const BatchControllers = {
  getBatches: async (page: number = 1, limit: number = 10) => {
    return await batchesApi.get(`/all?page=${page}&limit=${limit}`);
  },

  createBatch: async (data: CREATE_BATCH_REQUEST) => {
    return await batchesApi.post("/create", data);
  },

  updateBatch: async (id: number, data: UPDATE_BATCH_REQUEST) => {
    return await batchesApi.patch(`/update/${id}`, data);
  },

  deleteBatch: async (id: number) => {
    return await batchesApi.delete(`/delete/${id}`);
  },
};
