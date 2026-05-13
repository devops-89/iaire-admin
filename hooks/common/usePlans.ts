import { PlansControllers } from "@/app/api/plansControllers";
import { CREATE_PLAN_REQUEST, PLAN_DATA_PROPS } from "@/utils/type";
import { useState, useEffect } from "react";
import useSnackbar from "@/store/useSnackbar";
export const useCreatePlans = () => {
  const [loading, setLoading] = useState(false);
  const createPlan = (data: CREATE_PLAN_REQUEST) => {
    setLoading(true);
    PlansControllers.createPlan(data)
      .then((res) => {
        console.log("response in create plan ", res);
        setLoading(false);
      })
      .catch((err) => {
        console.log("error in create plan", err);
        setLoading(false);
      });
  };
  return { createPlan, loading };
};

export const usePlansList = () => {
  const [planLoading, setPlanLoading] = useState(false);
  const [planList, setPlanList] = useState<PLAN_DATA_PROPS>();

  useEffect(() => {
    const fetchPlans = async () => {
      setPlanLoading(true);
      PlansControllers.getAllPlans()
        .then((res) => {
          console.log("plansData", res);
          // setPlanList(res.data);
          setPlanLoading(false);
        })
        .catch((err) => {
          console.log("error in plansData", err);
          setPlanLoading(false);
        });
    };
    fetchPlans();
  }, []);
  return { planList, planLoading };
};
