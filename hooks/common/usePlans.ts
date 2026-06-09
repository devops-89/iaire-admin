import { PlansControllers } from "@/app/api/plansControllers";
import { CREATE_PLAN_REQUEST, PLAN_DATA_PROPS } from "@/utils/type";
import { useState, useEffect } from "react";
import useSnackbar from "@/store/useSnackbar";
import { useModal } from "@/store/useModal";
export const useCreatePlans = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const { hideModal } = useModal();
  const { setSnackbar } = useSnackbar();
  const createPlan = (data: CREATE_PLAN_REQUEST) => {
    setLoading(true);
    PlansControllers.createPlan(data)
      .then((res) => {
        // console.log("response in create plan ", res);
        setSnackbar("Plan Created Successfully", "success");
        hideModal();
        if (onSuccess) onSuccess();
        setLoading(false);
      })
      .catch((err) => {
        console.log("error in create plan", err);
        setSnackbar(
          err.response?.data?.message || "Failed to create plan",
          "error"
        );
        setLoading(false);
      });
  };
  return { createPlan, loading };
};

export const usePlansList = () => {
  const [planLoading, setPlanLoading] = useState(false);
  const [planList, setPlanList] = useState<PLAN_DATA_PROPS>();
  const { setSnackbar } = useSnackbar();

  const fetchPlans = async (page = 1, limit = 10) => {
    setPlanLoading(true);
    PlansControllers.getAllPlans(page, limit)
      .then((res) => {
        setPlanList(res.data.data);
        setPlanLoading(false);
      })
      .catch((err) => {
        console.log("error in plansData", err);
        setPlanLoading(false);
      });
  };

  const updatePlan = async (id: number, data: any) => {
    try {
      const res = await PlansControllers.updatePlan(id, data);
      if (res.status === 200 || res.status === 201) {
        setSnackbar("Plan updated successfully", "success");
        return true;
      }
      return false;
    } catch (error: any) {
      setSnackbar(
        error.response?.data?.message || "Failed to update plan",
        "error",
      );
      return false;
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return { planList, planLoading, fetchPlans, updatePlan };
};
