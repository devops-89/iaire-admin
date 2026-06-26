import React, { useState } from "react";
import { Box, Button, IconButton, InputAdornment, Link, CircularProgress } from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { COLORS } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import { CustomTextField } from "./CustomTextField";
import { FormikProps } from "formik";

interface LoginFormProps {
  loginFormik: FormikProps<any>;
  loading: boolean;
  setView: (view: "LOGIN" | "FORGOT" | "RESET") => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ loginFormik, loading, setView }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <form onSubmit={loginFormik.handleSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <CustomTextField
          fullWidth
          name="identifier"
          placeholder="Email address"
          value={loginFormik.values.identifier}
          onChange={loginFormik.handleChange}
          onBlur={loginFormik.handleBlur}
          error={loginFormik.touched.identifier && Boolean(loginFormik.errors.identifier)}
          helperText={(loginFormik.touched.identifier && loginFormik.errors.identifier) as string}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: "rgba(255, 255, 255, 0.4)", fontSize: 20, ml: 0.5 }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <CustomTextField
          fullWidth
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={loginFormik.values.password}
          onChange={loginFormik.handleChange}
          onBlur={loginFormik.handleBlur}
          error={loginFormik.touched.password && Boolean(loginFormik.errors.password)}
          helperText={(loginFormik.touched.password && loginFormik.errors.password) as string}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "rgba(255, 255, 255, 0.4)", fontSize: 20, ml: 0.5 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end" sx={{ color: "rgba(255, 255, 255, 0.4)", mr: 0.5 }}>
                    {showPassword ? (
                      <VisibilityOff sx={{ fontSize: 20 }} />
                    ) : (
                      <Visibility sx={{ fontSize: 20 }} />
                    )}
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
            underline="none"
            sx={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: poppins.style.fontFamily,
              transition: "color 0.2s ease-in-out",
              "&:hover": { color: "#00E5C9" },
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
          sx={{
            mt: 1,
            padding: "16px",
            fontSize: "16px",
            fontWeight: 600,
            fontFamily: poppins.style.fontFamily,
            borderRadius: "16px",
            background: COLORS.PRIMARY_NAVY,
            color: COLORS.WHITE,
            textTransform: "none",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 8px 24px rgba(1, 90, 80, 0.3)",
            "&:hover": {
              background: "#017a6d",
              transform: "translateY(-2px)",
              boxShadow: "0 12px 32px rgba(1, 90, 80, 0.45)",
            },
            "&:disabled": {
              background: "rgba(255, 255, 255, 0.12)",
              color: "rgba(255, 255, 255, 0.3)",
              boxShadow: "none",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "50%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
              transform: "skewX(-20deg)",
              transition: "all 0.6s ease",
            },
            "&:hover::after": {
              left: "200%",
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
        </Button>
      </Box>
    </form>
  );
};

