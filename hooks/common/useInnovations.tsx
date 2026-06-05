"use client";
import { innovationControllers } from "@/app/api/innovationControllers";
import { useState } from "react";
export const useInnovations = () => {
  const [innovationData, setInnovationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await innovationControllers.getInnovations();
      console.log("innovation", res);
      setInnovationData(res?.data?.data);
    } catch (err) {
      console.error("error in innovation list", err);
    } finally {
      setLoading(false);
    }
  };
  return { innovationData, loading, fetchData };
};
