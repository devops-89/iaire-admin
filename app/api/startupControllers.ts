import { startupsApi } from "./config";

export const StartupControllers = {
  getAllStartups: async (page = 1, limit = 10, status = "ALL") => {
    let url = `/all?page=${page}&limit=${limit}`;
    if (status && status !== "ALL") {
      url += `&search=${status}`;
    }
    return await startupsApi.get(url);
  },
};
