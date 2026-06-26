"use client";
import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, Fade } from "@mui/material";
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
        backgroundColor: "#050B14",
        overflow: "hidden",
      }}
    >
      {/* Decorative Grid Pattern Overlay Across Whole Page */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          zIndex: 0,
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: "45px 45px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 90%)",
        }}
      />

      {/* Brand Panel - Left Side (Visible only on md and up) */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          width: "55%",
          position: "relative",
          overflow: "hidden",
          borderRight: "1px solid rgba(255, 255, 255, 0.05)",
          padding: 8,
          justifyContent: "space-between",
          zIndex: 1,
        }}
      >
        {/* Animated Mesh Gradients Background specifically for brand side */}
        <Box
          sx={{
            position: "absolute",
            top: "-15%",
            left: "-10%",
            width: "45vw",
            height: "45vw",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(1, 90, 80, 0.25) 0%, transparent 70%)`,
            filter: "blur(100px)",
            zIndex: 0,
            animation: "drift1 15s ease-in-out infinite alternate",
            "@keyframes drift1": {
              "0%": { transform: "translate(0, 0) scale(1)" },
              "100%": { transform: "translate(5%, 10%) scale(1.1)" },
            },
          }}
        />

        {/* Brand Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, zIndex: 1 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              background: `linear-gradient(135deg, ${COLORS.PRIMARY_NAVY} 0%, #00E5C9 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(0, 229, 201, 0.2)",
              fontWeight: 800,
              color: COLORS.WHITE,
              fontFamily: outfit.style.fontFamily,
              fontSize: "20px",
            }}
          >
            I
          </Box>
          <Typography
            sx={{
              fontFamily: outfit.style.fontFamily,
              fontWeight: 800,
              fontSize: "22px",
              color: COLORS.WHITE,
              letterSpacing: 0.5,
            }}
          >
            IAIRE
          </Typography>
        </Box>

        {/* Brand Core Content */}
        <Box sx={{ my: "auto", position: "relative", zIndex: 1 }}>
          <Typography
            sx={{
              fontFamily: outfit.style.fontFamily,
              fontWeight: 900,
              fontSize: { md: "38px", lg: "46px" },
              lineHeight: 1.25,
              color: COLORS.WHITE,
              letterSpacing: -1,
              mb: 2,
            }}
          >
            Empowering Academic <br />
            <span
              style={{
                background: "linear-gradient(135deg, #00E5C9 0%, #015A50 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Innovation & Research
            </span>
          </Typography>
          <Typography
            sx={{
              fontFamily: poppins.style.fontFamily,
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.6)",
              lineHeight: 1.7,
              maxWidth: "480px",
              mb: 6,
            }}
          >
            Access the administrative suite to manage schools, evaluate research patents, track innovation batches, and foster entrepreneurship.
          </Typography>


        </Box>

        {/* Brand Footer */}
        <Box sx={{ zIndex: 1 }}>
          <Typography
            sx={{
              fontFamily: poppins.style.fontFamily,
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.4)",
            }}
          >
            &copy; {new Date().getFullYear()} IAIRE. All rights reserved. v1.0.0
          </Typography>
        </Box>
      </Box>

      {/* Form Panel - Right Side */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
          padding: { xs: 3, sm: 6 },
        }}
      >
        {/* Subtle mesh background for form side on mobile */}
        <Box
          sx={{
            position: "absolute",
            bottom: "-10%",
            right: "-10%",
            width: "50vw",
            height: "50vw",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(1, 90, 80, 0.15) 0%, transparent 65%)`,
            filter: "blur(120px)",
            zIndex: 0,
            animation: "drift2 18s ease-in-out infinite alternate",
            "@keyframes drift2": {
              "0%": { transform: "translate(0, 0) scale(1)" },
              "100%": { transform: "translate(-5%, -5%) scale(1.15)" },
            },
          }}
        />

        {/* Form Container Card */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "460px",
            background: "rgba(10, 22, 40, 0.65)",
            backdropFilter: "blur(24px)",
            borderRadius: "32px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            padding: { xs: 4, sm: 6 },
            boxShadow:
              "0 24px 48px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.05)",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Logo on Mobile only */}
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1, mb: 4 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                background: `linear-gradient(135deg, ${COLORS.PRIMARY_NAVY} 0%, #00E5C9 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                color: COLORS.WHITE,
                fontFamily: outfit.style.fontFamily,
                fontSize: "15px",
              }}
            >
              I
            </Box>
            <Typography
              sx={{
                fontFamily: outfit.style.fontFamily,
                fontWeight: 800,
                fontSize: "18px",
                color: COLORS.WHITE,
              }}
            >
              IAIRE
            </Typography>
          </Box>

          <Fade in={mounted} key={view} timeout={400}>
            <Box>
              {/* Header */}
              <Box sx={{ mb: 4.5, position: "relative" }}>
                {view !== "LOGIN" && (
                  <IconButton
                    onClick={() => setView(view === "RESET" ? "FORGOT" : "LOGIN")}
                    sx={{
                      mb: 2.5,
                      ml: -0.5,
                      color: "rgba(255, 255, 255, 0.7)",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.08)",
                        color: COLORS.WHITE,
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                      },
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
                    fontSize: { xs: "28px", sm: "32px" },
                    color: COLORS.WHITE,
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
                    color: "rgba(255, 255, 255, 0.6)",
                    fontFamily: poppins.style.fontFamily,
                    fontSize: "14.5px",
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
                <LoginForm
                  loginFormik={loginFormik}
                  loading={loading}
                  setView={setView}
                />
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
    </Box>
  );
};

export default LoginLayout;

