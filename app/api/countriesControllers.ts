import { CREATE_COUNTRIES_REQUEST, UPDATE_COUNTRIES_REQUEST } from "@/utils/type";
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

  getAllCountries: async (page = 1, limit = 10) => {
    try {
      const result = await countriesApi.get(`/all?page=${page}&limit=${limit}`);
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

