"use client";
import { useState, useEffect, useCallback } from "react";
import { CountriesControllers } from "@/app/api/countriesControllers";
import { Country, CREATE_COUNTRIES_REQUEST, Pagination, UPDATE_COUNTRIES_REQUEST } from "@/utils/type";
import useSnackbar from "@/store/useSnackbar";
export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const { setSnackbar } = useSnackbar();

  const fetchCountries = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await CountriesControllers.getAllCountries(page, limit);
      const inner = res.data?.data;
      const list: Country[] = inner?.data ?? [];
      const pag: Pagination = inner?.pagination ?? { page, limit, total: 0, totalPages: 1 };
      setCountries(list);
      setPagination(pag);
    } catch (err: any) {
      setSnackbar(
        err.response?.data?.message || "Failed to fetch countries.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchCountries(1, 10);
  }, [fetchCountries]);

  const createCountry = async (data: CREATE_COUNTRIES_REQUEST) => {
    setCreating(true);
    try {
      await CountriesControllers.createCountry(data);
      setSnackbar("Country created successfully!", "success");
      await fetchCountries(pagination.page, pagination.limit);
      return true;
    } catch (err: any) {
      const errors = err.response?.data?.error;
      const msg = Array.isArray(errors)
        ? errors.join(", ")
        : err.response?.data?.message || "Failed to create country.";
      setSnackbar(msg, "error");
      return false;
    } finally {
      setCreating(false);
    }
  };

  const deleteCountry = async (id: number) => {
    try {
      await CountriesControllers.deleteCountry(id);
      setSnackbar("Country deleted successfully!", "success");
      await fetchCountries(pagination.page, pagination.limit);
    } catch (err: any) {
      setSnackbar(
        err.response?.data?.message || "Failed to delete country.",
        "error"
      );
    }
  };

  const updateCountry = async (id: number, data: UPDATE_COUNTRIES_REQUEST) => {
    setUpdating(true);
    try {
      await CountriesControllers.updateCountry(id, data);
      setSnackbar("Country updated successfully!", "success");
      await fetchCountries(pagination.page, pagination.limit);
      return true;
    } catch (err: any) {
      const errors = err.response?.data?.error;
      const msg = Array.isArray(errors)
        ? errors.join(", ")
        : err.response?.data?.message || "Failed to update country.";
      setSnackbar(msg, "error");
      return false;
    } finally {
      setUpdating(false);
    }
  };


  const goToPage = (page: number) => {
    fetchCountries(page, pagination.limit);
  };

  return { countries, loading, creating, updating, pagination, createCountry, updateCountry, deleteCountry, fetchCountries, goToPage };
};
