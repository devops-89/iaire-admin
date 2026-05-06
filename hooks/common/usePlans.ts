"use client";
import { useState, useEffect, useCallback } from "react";
import { PlansControllers } from "@/app/api/plansControllers";
import { Plan, CREATE_PLAN_REQUEST, Pagination, UPDATE_PLAN_REQUEST } from "@/utils/type";
import useSnackbar from "@/store/useSnackbar";

export const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
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

  const fetchPlans = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await PlansControllers.getAllPlans(page, limit);
      const inner = res.data?.data;
      const list: Plan[] = inner?.data ?? [];
      const pag: Pagination = inner?.pagination ?? { page, limit, total: 0, totalPages: 1 };
      setPlans(list);
      setPagination(pag);
    } catch (err: any) {
      setSnackbar(
        err.response?.data?.message || "Failed to fetch plans.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [setSnackbar]);

  useEffect(() => {
    fetchPlans(1, 10);
  }, [fetchPlans]);

  const createPlan = async (data: CREATE_PLAN_REQUEST) => {
    setCreating(true);
    try {
      await PlansControllers.createPlan(data);
      setSnackbar("Plan created successfully!", "success");
      await fetchPlans(pagination.page, pagination.limit);
      return true;
    } catch (err: any) {
      const errors = err.response?.data?.error;
      const msg = Array.isArray(errors)
        ? errors.join(", ")
        : err.response?.data?.message || "Failed to create plan.";
      setSnackbar(msg, "error");
      return false;
    } finally {
      setCreating(false);
    }
  };

  const updatePlan = async (id: number, data: UPDATE_PLAN_REQUEST) => {
    setUpdating(true);
    try {
      await PlansControllers.updatePlan(id, data);
      setSnackbar("Plan updated successfully!", "success");
      await fetchPlans(pagination.page, pagination.limit);
      return true;
    } catch (err: any) {
      const errors = err.response?.data?.error;
      const msg = Array.isArray(errors)
        ? errors.join(", ")
        : err.response?.data?.message || "Failed to update plan.";
      setSnackbar(msg, "error");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const deletePlan = async (id: number) => {
    try {
      await PlansControllers.deletePlan(id);
      setSnackbar("Plan deleted successfully!", "success");
      await fetchPlans(pagination.page, pagination.limit);
    } catch (err: any) {
      setSnackbar(
        err.response?.data?.message || "Failed to delete plan.",
        "error"
      );
    }
  };

  const goToPage = (page: number) => {
    fetchPlans(page, pagination.limit);
  };

  return { plans, loading, creating, updating, pagination, createPlan, updatePlan, deletePlan, fetchPlans, goToPage };
};
