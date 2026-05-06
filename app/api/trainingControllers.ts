import { trainingApi } from "./config";

export const TrainingControllers = {
  getTrainingTeachers: async (page = 1, limit = 10, status?: string) => {
    try {
      const response = await trainingApi.get(`/teachers/all`, {
        params: { page, limit, status },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  scheduleInterview: async (id: number, interviewScheduledAt: string) => {
    try {
      const response = await trainingApi.patch(`/schedule-interview/${id}`, {
        interviewScheduledAt,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getTrainingTeacherDetails: async (id: number) => {
    try {
      const response = await trainingApi.get(`/teachers/details/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
