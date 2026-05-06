"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  ArrowBack,
} from "@mui/icons-material";
import { COLORS, FONT_SIZE } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import {
  TEXTFIELD_STYLE_VALIDATION,
  GLASS_CARD_STYLE,
  PRIMARY_BUTTON_STYLE,
} from "@/utils/style";

import { useFormik } from "formik";
import { loginValidationSchema } from "@/utils/validation";

import { useLogin } from "@/hooks/common/useLogin";
import { useForgotPassword } from "@/hooks/common/useForgotPassword";

type LoginView = "LOGIN" | "FORGOT" | "RESET";

const LoginLayout = () => {
  const [view, setView] = useState<LoginView>("LOGIN");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useLogin();
  const { forgotPassword, resetPassword, loading: forgotLoading } = useForgotPassword();

  // Reset states
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);

  // OTP Box Handling
  const otpArray = otp.split("").concat(Array(6).fill("")).slice(0, 6);
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtpArray = [...otpArray];
    newOtpArray[index] = value;
    const newOtp = newOtpArray.join("");
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

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

  // Clear states when view changes
  React.useEffect(() => {
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
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.BG_LIGHT,
        backgroundImage: `linear-gradient(135deg, ${COLORS.BG_LIGHT} 0%, ${COLORS.BG_GRADIENT_END} 100%)`,
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ ...GLASS_CARD_STYLE, mx: "auto" }}>
          
          {/* Back Button for Forgot/Reset views */}
          {view !== "LOGIN" && (
            <IconButton 
              onClick={() => setView(view === "RESET" ? "FORGOT" : "LOGIN")}
              sx={{ position: "absolute", left: 24, top: 24, color: COLORS.BLACK }}
            >
              <ArrowBack />
            </IconButton>
          )}

          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography
              component="h1"
              sx={{
                fontFamily: poppins.style.fontFamily,
                fontWeight: 800,
                fontSize: view === "LOGIN" ? FONT_SIZE.FS28 : "24px",
                color: COLORS.BLACK,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {view === "LOGIN" ? "Admin Dashboard" : view === "FORGOT" ? "Forgot Password" : "Reset Password"}
            </Typography>
            {view !== "LOGIN" && (
              <Typography variant="body2" sx={{ mt: 1, color: COLORS.TEXT_SECONDARY, fontFamily: poppins.style.fontFamily }}>
                {view === "FORGOT" ? "Enter your email to receive an OTP." : "Enter the 6-digit OTP sent to your email."}
              </Typography>
            )}
          </Box>

          {view === "LOGIN" && (
            <form onSubmit={loginFormik.handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="identifier"
                  autoComplete="off"
                  placeholder="Enter your email"
                  value={loginFormik.values.identifier}
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                  error={loginFormik.touched.identifier && Boolean(loginFormik.errors.identifier)}
                  helperText={loginFormik.touched.identifier && loginFormik.errors.identifier}
                  sx={TEXTFIELD_STYLE_VALIDATION}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={loginFormik.values.password}
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                  error={loginFormik.touched.password && Boolean(loginFormik.errors.password)}
                  helperText={loginFormik.touched.password && loginFormik.errors.password}
                  sx={TEXTFIELD_STYLE_VALIDATION}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -1 }}>
                  <Link
                    component="button"
                    type="button"
                    onClick={() => setView("FORGOT")}
                    underline="hover"
                    sx={{
                      color: COLORS.TEXT_SECONDARY,
                      fontSize: FONT_SIZE.FS14,
                      fontFamily: poppins.style.fontFamily,
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      "&:hover": { color: COLORS.BLACK },
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={PRIMARY_BUTTON_STYLE}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
                </Button>
              </Box>
            </form>
          )}

          {view === "FORGOT" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                fullWidth
                label="Email"
                placeholder="Enter your email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                error={!!identifier && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)}
                helperText={!!identifier && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier) ? "Please enter a valid email address" : ""}
                sx={TEXTFIELD_STYLE_VALIDATION}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleForgotSubmit}
                disabled={forgotLoading || !identifier || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)}
                sx={PRIMARY_BUTTON_STYLE}
              >
                {forgotLoading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
              </Button>
              <Button 
                fullWidth
                variant="text"
                onClick={() => setView("LOGIN")}
                sx={{ 
                  color: COLORS.TEXT_SECONDARY, 
                  textTransform: "none", 
                  fontFamily: poppins.style.fontFamily,
                  fontWeight: 600,
                  "&:hover": { color: COLORS.BLACK, background: "none" }
                }}
              >
                Back to Login
              </Button>
            </Box>
          )}

          {view === "RESET" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mb: 1 }}>
                {otpArray.map((digit, index) => (
                  <TextField
                    key={index}
                    id={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    sx={{
                      width: "48px",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: COLORS.INPUT_BG,
                        "& fieldset": { border: "1px solid black" },
                        "& input": { textAlign: "center", padding: "12px 0", fontWeight: 700, fontSize: 20 }
                      }
                    }}
                  />
                ))}
              </Stack>

              <TextField
                fullWidth
                label="New Password"
                name="new-password"
                autoComplete="new-password"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={TEXTFIELD_STYLE_VALIDATION}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowNewPassword} edge="end">
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleResetSubmit}
                disabled={forgotLoading || otp.length < 6 || !newPassword}
                sx={PRIMARY_BUTTON_STYLE}
              >
                {forgotLoading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
              </Button>
            </Box>
          )}
        </Card>
      </Container>
    </Box>
  );
};

export default LoginLayout;
