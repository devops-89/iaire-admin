import {
  CREATE_COUNTRIES_REQUEST,
  UPDATE_COUNTRIES_REQUEST,
} from "@/utils/type";
import { countriesApi } from "./config";

export const CountriesControllers = {
  createCountry: async (data: CREATE_COUNTRIES_REQUEST) => {
    try {
      const result = await countriesApi.post("/create", data);
      return result;
    } catch (error) {
      throw error;
    }
  },

  getAllCountries: async (
    page?: any,
    limit?: any,
    search?: string,
    status?: boolean,
  ) => {
    try {
      const params = new URLSearchParams();
      if (page) params.append("page", String(page));
      if (limit) params.append("limit", String(limit));
      if (search) params.append("search", search);
      if (status !== undefined) params.append("isActive", String(status));

      const queryString = params.toString();
      const endpoint = queryString ? `/all?${queryString}` : "/all";
      const result = await countriesApi.get(endpoint);
      return result;
    } catch (error) {
      throw error;
    }
  },

  deleteCountry: async (id: number) => {
    try {
      const result = await countriesApi.delete(`/${id}`);
      return result;
    } catch (error) {
      throw error;
    }
  },

  updateCountry: async (id: number, data: UPDATE_COUNTRIES_REQUEST) => {
    try {
      const result = await countriesApi.patch(`/${id}`, data);
      return result;
    } catch (error) {
      throw error;
    }
  },
};
