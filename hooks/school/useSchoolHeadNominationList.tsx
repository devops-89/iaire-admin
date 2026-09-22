import { SchoolsControllers } from "@/app/api/schoolsControllers";
import { Pagination, SCHOOL_HEAD_NOMINATION_LIST_RESPONSE } from "@/utils/type";
import { useState } from "react";

export const useSchoolHeadNominationList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SCHOOL_HEAD_NOMINATION_LIST_RESPONSE>();

  const getSchoolHeadNominationList = async ({ page, limit }: Pagination) => {
    try {
      setLoading(true);
      const result = await SchoolsControllers.getHeadNominationList({
        page,
        limit,
      });
      setData(result?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return {
    getSchoolHeadNominationList,
    loading,
    data,
  };
};
