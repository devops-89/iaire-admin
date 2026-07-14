import { useState, useEffect } from "react";
import { TrainingControllers } from "@/app/api/trainingControllers";
import { TrainingTeacher, Pagination } from "@/utils/type";
import useSnackbar from "@/store/useSnackbar";
import { TRAINING_NOMINATION_STATUS } from "@/utils/enum";

export const useInterviews = () => {
  const [teachers, setTeachers] = useState<TrainingTeacher[]>([]);
  const [teacherDetails, setTeacherDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [approving, setApproving] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const { setSnackbar } = useSnackbar();

  const fetchTeachers = async (page = 1, limit = 10, status?: string) => {
    setLoading(true);
    try {
      const currentStatus = status || TRAINING_NOMINATION_STATUS.SCHOOL_APPROVED;
      const response: any = await TrainingControllers.getTrainingTeachers(page, limit, currentStatus);
      if (response.data.success || response.data.statusCode === 200) {
        // Robust array extraction
        const dataArray = Array.isArray(response.data?.data?.data)
          ? response.data.data.data
          : Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : [];

        const sortedTeachers = dataArray.sort((a: any, b: any) => {
          if (a.interviewScheduledAt && !b.interviewScheduledAt) return -1;
          if (!a.interviewScheduledAt && b.interviewScheduledAt) return 1;
          return 0;
        });
        setTeachers(sortedTeachers);

        // Extract pagination
        const pag = response.data?.data?.pagination || response.data?.pagination;
        setPagination(
          pag || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 1,
          }
        );
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
        fetchTeachers(pagination?.page || 1, pagination?.limit || 10);
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

  const approveInterview = async (id: number, currentStatus: string) => {
    setApproving(true);
    try {
      const response: any = await TrainingControllers.approveTraining(id);
      if (response.data.success) {
        setSnackbar("Teacher approved successfully", "success");
        fetchTeachers(pagination?.page || 1, pagination?.limit || 10, currentStatus);
        return true;
      }
    } catch (error: any) {
      setSnackbar(error.response?.data?.message || "Failed to approve", "error");
    } finally {
      setApproving(false);
    }
    return false;
  };

  const rejectInterview = async (id: number, currentStatus: string, reason?: string) => {
    setApproving(true);
    try {
      const response: any = await TrainingControllers.rejectTraining(id, reason);
      if (response.data.success) {
        setSnackbar("Teacher rejected", "success");
        fetchTeachers(pagination?.page || 1, pagination?.limit || 10, currentStatus);
        return true;
      }
    } catch (error: any) {
      setSnackbar(error.response?.data?.message || "Failed to reject", "error");
    } finally {
      setApproving(false);
    }
    return false;
  };

  const goToPage = (page: number, status?: string) => {
    fetchTeachers(page, pagination?.limit || 10, status);
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
    approving,
    pagination,
    scheduleInterview,
    approveInterview,
    rejectInterview,
    fetchTeachers,
    fetchTeacherDetails,
    goToPage,
  };
};
