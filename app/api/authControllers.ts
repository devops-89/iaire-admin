import { LOGIN_REQUEST, VERIFY_OTP_REQUEST } from "@/utils/type";
import { authApi } from "./config";
export const AuthControllers = {
  login: async ({ identifier, password }: LOGIN_REQUEST) => {
    try {
      const result = await authApi.post("/login", { identifier, password });
      return result;
    } catch (error) {
      throw error;
    }
  },

  verifyOtp: async ({ email, otp }: VERIFY_OTP_REQUEST) => {
    try {
      const result = await authApi.post("/verify-email", { email, otp });
      return result;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (identifier: string) => {
    try {
      const result = await authApi.post("/forgot-password", { identifier });
      return result;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (data: any) => {
    try {
      const result = await authApi.patch("/reset-password", data);
      return result;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const result = await authApi.post("/logout");
      return result;
    } catch (error) {
      throw error;
    }
  },
};
