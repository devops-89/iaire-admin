"use client";
import { innovationControllers } from "@/app/api/innovationControllers";
import { INNOVATION_RESPONSE_DATA_PROPS } from "@/utils/type";
import { useState } from "react";
export const useInnovations = () => {
  const [innovationData, setInnovationData] = useState<INNOVATION_RESPONSE_DATA_PROPS[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async (search?: string) => {
    try {
      setLoading(true);
      const res = await innovationControllers.getInnovations(search);
      console.log("innovation", res);
      setInnovationData(res?.data?.data || []);
    } catch (err) {
      console.error("error in innovation list", err);
    } finally {
      setLoading(false);
    }
  };
  return { innovationData, loading, fetchData };
};
