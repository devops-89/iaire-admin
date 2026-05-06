"use client";
import { AuthControllers } from "@/app/api/authControllers";
import { useState } from "react";
import { LOGIN_REQUEST } from "@/utils/type";
import { USER_ROLES } from "@/utils/enum";
import useSnackbar from "@/store/useSnackbar";
import { useRouter } from "next/navigation";
export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setSnackbar } = useSnackbar();
  const router = useRouter();

  const login = async (data: LOGIN_REQUEST) => {
    setLoading(true);
    await AuthControllers.login(data)
      .then((res) => {
        const responseData = res.data.data;
        const tokens = responseData.tokens;
        const user = responseData.user;

        localStorage.setItem("token", tokens?.accessToken);
        localStorage.setItem("role", user?.role);

        router.push("/dashboard");
        setSnackbar("Login successful!", "success");
      })
      .catch((err) => {
        console.log("err", err);
        setSnackbar(
          err.response?.data?.message || "Login failed. Please try again.",
          "error"
        );
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
    setSnackbar("Logged out successfully", "success");
  };

  return { login, logout, loading };
};
