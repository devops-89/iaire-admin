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
                  <Email sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 20 }} />
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
                  <Lock sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
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
              color: COLORS.TEXT_SECONDARY,
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: poppins.style.fontFamily,
              transition: "color 0.2s",
              "&:hover": { color: COLORS.PRIMARY_NAVY },
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
            textTransform: "none",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s ease",
            boxShadow: "0 10px 20px rgba(11, 23, 39, 0.15)",
            "&:hover": {
              background: "#1A293D",
              transform: "translateY(-3px)",
              boxShadow: "0 15px 30px rgba(11, 23, 39, 0.2)",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "50%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              transform: "skewX(-20deg)",
              transition: "all 0.5s",
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
