import { ResourcesControllers } from "@/app/api/resourceControllers";
import useSnackbar from "@/store/useSnackbar";
import { Pagination, ResourceItem } from "@/utils/type";
import { useState } from "react";

export const useAddResource = () => {
  const [loading, setLoading] = useState(false);
  const { setSnackbar } = useSnackbar();

  const addResources = async (data: FormData): Promise<boolean> => {
    setLoading(true);
    try {
      await ResourcesControllers.addResources(data);
      setSnackbar("Resource added successfully", "success");
      return true;
    } catch (error: any) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.error
        ? Array.isArray(errorData.error)
          ? errorData.error.join(" & ")
          : errorData.error
        : errorData?.message || "Failed to add resource";
      setSnackbar(errorMessage, "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, addResources };
};

export const useGetResources = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ResourceItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const { setSnackbar } = useSnackbar();

  const getResources = async (
    page = 1,
    limit = 10,
    section?: string,
    fileType?: string
  ) => {
    setLoading(true);
    try {
      const response: any = await ResourcesControllers.getResourcesList(
        page,
        limit,
        section,
        fileType
      );
      if (response.data?.data) {
        const resData = response.data.data;
        setData(Array.isArray(resData.data) ? resData.data : []);
        setPagination(
          resData.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          }
        );
      }
    } catch (err: any) {
      setSnackbar(
        err.response?.data?.message || "Failed to fetch resources",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return { getResources, loading, data, pagination };
};
