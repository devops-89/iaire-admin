import { batchesApi } from "./config";
import { CREATE_BATCH_REQUEST, UPDATE_BATCH_REQUEST } from "@/utils/type";

export const BatchControllers = {
  getBatches: async (page: number, limit: number, search?: string) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (search) {
      params.set("search", search);
    }
    return await batchesApi.get(`/all?${params.toString()}`);
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
