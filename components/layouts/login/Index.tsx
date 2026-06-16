"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  Fade,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { COLORS } from "@/utils/enum";
import { poppins, outfit } from "@/utils/fonts";

import { useFormik } from "formik";
import { loginValidationSchema } from "@/utils/validation";

import { useLogin } from "@/hooks/common/useLogin";
import { useForgotPassword } from "@/hooks/common/useForgotPassword";

import { LoginForm } from "./LoginForm";
import { ForgotForm } from "./ForgotForm";
import { ResetForm } from "./ResetForm";

export type LoginView = "LOGIN" | "FORGOT" | "RESET";

const LoginLayout = () => {
  const [view, setView] = useState<LoginView>("LOGIN");
  const [mounted, setMounted] = useState(false);

  const { login, loading } = useLogin();
  const {
    forgotPassword,
    resetPassword,
    loading: forgotLoading,
  } = useForgotPassword();

  useEffect(() => {
    setMounted(true);
  }, []);

  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const loginFormik = useFormik({
    initialValues: {
      identifier: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      login(values);
    },
  });

  useEffect(() => {
    if (view === "LOGIN") {
      setIdentifier("");
      setOtp("");
      setNewPassword("");
      loginFormik.resetForm();
    }
  }, [view]);

  const handleForgotSubmit = async () => {
    if (!identifier) return;
    const success = await forgotPassword(identifier);
    if (success) {
      setView("RESET");
    }
  };

  const handleResetSubmit = async () => {
    if (otp.length < 6 || !newPassword) return;
    const success = await resetPassword({ identifier, otp, newPassword });
    if (success) {
      setView("LOGIN");
      setIdentifier("");
      setOtp("");
      setNewPassword("");
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#050B14",
        overflow: "hidden",
        padding: 3,
      }}
    >
      {/* Animated Mesh Gradients Background */}
      <Box
        sx={{
          position: "absolute",
          top: "-15%",
          left: "-10%",
          width: "50vw",
          height: "50vw",
          minWidth: "600px",
          minHeight: "600px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.PRIMARY_NAVY} 0%, transparent 70%)`,
          filter: "blur(120px)",
          zIndex: 0,
          animation: "drift1 15s ease-in-out infinite alternate",
          "@keyframes drift1": {
            "0%": { transform: "translate(0, 0) scale(1)" },
            "100%": { transform: "translate(5%, 10%) scale(1.1)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "60vw",
          height: "60vw",
          minWidth: "700px",
          minHeight: "700px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.ACCENT_TAN}15 0%, transparent 60%)`,
          filter: "blur(140px)",
          zIndex: 0,
          animation: "drift2 20s ease-in-out infinite alternate",
          "@keyframes drift2": {
            "0%": { transform: "translate(0, 0) scale(1)" },
            "100%": { transform: "translate(-10%, -5%) scale(1.2)" },
          },
        }}
      />

      {/* Decorative Grid Pattern Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.15,
          zIndex: 0,
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse at center, black 10%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 10%, transparent 80%)",
        }}
      />

      {/* Form Container */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "460px",
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(20px)",
          borderRadius: "32px",
          padding: { xs: 4, sm: 6 },
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Fade in={mounted} key={view} timeout={500}>
          <Box>
            {/* Header */}
            <Box sx={{ mb: 5, position: "relative" }}>
              {view !== "LOGIN" && (
                <IconButton
                  onClick={() =>
                    setView(view === "RESET" ? "FORGOT" : "LOGIN")
                  }
                  sx={{
                    mb: 2,
                    ml: -1,
                    color: COLORS.TEXT_SECONDARY,
                    background: "#F3F4F6",
                    "&:hover": { background: "#E5E7EB", color: COLORS.BLACK },
                  }}
                >
                  <ArrowBack />
                </IconButton>
              )}

              <Typography
                component="h1"
                sx={{
                  fontFamily: outfit.style.fontFamily,
                  fontWeight: 800,
                  fontSize: { xs: "28px", sm: "34px" },
                  color: COLORS.BLACK,
                  letterSpacing: -0.5,
                }}
              >
                {view === "LOGIN"
                  ? "Welcome Back"
                  : view === "FORGOT"
                    ? "Recover Account"
                    : "Create Password"}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mt: 1.5,
                  color: COLORS.TEXT_SECONDARY,
                  fontFamily: poppins.style.fontFamily,
                  fontSize: "15px",
                  lineHeight: 1.6,
                }}
              >
                {view === "LOGIN"
                  ? "Enter your credentials to access the administrative dashboard."
                  : view === "FORGOT"
                    ? "Enter your registered email and we'll send you a 6-digit verification code."
                    : "Enter the verification code sent to your email along with your new password."}
              </Typography>
            </Box>

            {view === "LOGIN" && (
              <LoginForm loginFormik={loginFormik} loading={loading} setView={setView} />
            )}

            {view === "FORGOT" && (
              <ForgotForm
                identifier={identifier}
                setIdentifier={setIdentifier}
                handleForgotSubmit={handleForgotSubmit}
                forgotLoading={forgotLoading}
              />
            )}

            {view === "RESET" && (
              <ResetForm
                otp={otp}
                setOtp={setOtp}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                handleResetSubmit={handleResetSubmit}
                forgotLoading={forgotLoading}
              />
            )}
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default LoginLayout;
