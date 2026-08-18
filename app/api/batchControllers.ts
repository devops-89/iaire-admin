import { FETCH_BATCHES_API_INTERFACE } from "@/hooks/common/useBatches";
import { batchesApi } from "./config";
import { CREATE_BATCH_REQUEST, UPDATE_BATCH_REQUEST } from "@/utils/type";

export const BatchControllers = {
  getBatches: async (data: FETCH_BATCHES_API_INTERFACE) => {
    const params = new URLSearchParams();
    params.set("page", data.page.toString());
    params.set("limit", data.limit.toString());
    if (data.search) {
      params.set("search", data.search);
    }
    if (data.role) {
      params.set("role", data.role);
    }
    if (data.category) {
      params.set("category", data.category);
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
