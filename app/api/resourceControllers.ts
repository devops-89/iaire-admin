import { resourcesAPI } from "./config";

export const ResourcesControllers = {
  addResources: async (data: FormData) => {
    try {
      let result = await resourcesAPI.post("/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  getResourcesList: async (
    page = 1,
    limit = 10,
    section?: string,
    fileType?: string
  ) => {
    try {
      const params: Record<string, any> = { page, limit };
      if (section) params.section = section;
      if (fileType) params.fileType = fileType;

      let result = await resourcesAPI.get("/all", { params });
      return result;
    } catch (error) {
      throw error;
    }
  },
};
