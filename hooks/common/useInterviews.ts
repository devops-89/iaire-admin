import { useState, useEffect } from "react";
import { TrainingControllers } from "@/app/api/trainingControllers";
import { TrainingTeacher, Pagination } from "@/utils/type";
import useSnackbar from "@/store/useSnackbar";

export const useInterviews = () => {
  const [teachers, setTeachers] = useState<TrainingTeacher[]>([]);
  const [teacherDetails, setTeacherDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const { setSnackbar } = useSnackbar();

  const fetchTeachers = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response: any = await TrainingControllers.getTrainingTeachers(page, limit, "SCHOOL_APPROVED");
      if (response.data.success) {
        const sortedTeachers = (response.data.data.data || []).sort((a: any, b: any) => {
          if (a.interviewScheduledAt && !b.interviewScheduledAt) return -1;
          if (!a.interviewScheduledAt && b.interviewScheduledAt) return 1;
          return 0;
        });
        setTeachers(sortedTeachers);
        setPagination(response.data.data.pagination);
      }
    } catch (error: any) {
      setSnackbar(error.response?.data?.message || "Failed to fetch training teachers", "error");
    } finally {
      setLoading(false);
    }
  };

  const scheduleInterview = async (id: number, date: string) => {
    setScheduling(true);
    try {
      const response: any = await TrainingControllers.scheduleInterview(id, date);
      if (response.data.success) {
        setSnackbar("Interview scheduled successfully", "success");
        fetchTeachers(pagination.page, pagination.limit);
        return true;
      }
    } catch (error: any) {
      setSnackbar(error.response?.data?.message || "Failed to schedule interview", "error");
    } finally {
      setScheduling(false);
    }
    return false;
  };

  const fetchTeacherDetails = async (id: number) => {
    setLoadingDetails(true);
    try {
      const response: any = await TrainingControllers.getTrainingTeacherDetails(id);
      if (response.data.success) {
        setTeacherDetails(response.data.data.data);
        return response.data.data.data;
      }
    } catch (error: any) {
      setSnackbar(error.response?.data?.message || "Failed to fetch teacher details", "error");
    } finally {
      setLoadingDetails(false);
    }
  };

  const goToPage = (page: number) => {
    fetchTeachers(page, pagination.limit);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return {
    teachers,
    teacherDetails,
    setTeacherDetails,
    loading,
    loadingDetails,
    scheduling,
    pagination,
    scheduleInterview,
    fetchTeachers,
    fetchTeacherDetails,
    goToPage,
  };
};
