import { useState } from "react";
import { AuthControllers } from "@/app/api/authControllers";
import useSnackbar from "@/store/useSnackbar";

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const { setSnackbar } = useSnackbar();

  const forgotPassword = async (identifier: string) => {
    setLoading(true);
    try {
      const response = await AuthControllers.forgotPassword(identifier);
      if (response.data.success) {
        setSnackbar("OTP sent to your registered email", "success");
        return true;
      }
    } catch (error: any) {
      setSnackbar(error.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
    return false;
  };

  const resetPassword = async (data: { identifier: string; otp: string; newPassword?: string }) => {
    setLoading(true);
    try {
      const response = await AuthControllers.resetPassword(data);
      if (response.data.success) {
        setSnackbar("Password reset successfully", "success");
        return true;
      }
    } catch (error: any) {
      setSnackbar(error.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
    return false;
  };

  return { forgotPassword, resetPassword, loading };
};
