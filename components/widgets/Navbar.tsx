"use client";
import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  InputBase,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Search,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { COLORS, FONT_SIZE } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import { useLogin } from "@/hooks/common/useLogin";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { logout } = useLogin();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        color: COLORS.BLACK,
        boxShadow: "none",
        borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Search Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: COLORS.INPUT_BG,
            borderRadius: "12px",
            px: 2,
            py: 0.5,
            width: "300px",
          }}
        >
          <Search sx={{ color: COLORS.TEXT_SECONDARY, mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="Search anything..."
            sx={{
              fontFamily: poppins.style.fontFamily,
              fontSize: FONT_SIZE.FS14,
              width: "100%",
            }}
          />
        </Box>

        {/* Right Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

          <Box
            onClick={handleProfileMenuOpen}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              backgroundColor: "rgba(0,0,0,0.03)",
              px: 1.5,
              py: 0.5,
              borderRadius: "50px",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" },
            }}
          >
            <Avatar
              sx={{ width: 35, height: 35, bgcolor: COLORS.PRIMARY_NAVY }}
            >
              AD
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                sx={{
                  fontSize: FONT_SIZE.FS14,
                  fontWeight: 600,
                  fontFamily: poppins.style.fontFamily,
                  lineHeight: 1.2,
                }}
              >
                Admin User
              </Typography>
              <Typography
                sx={{
                  fontSize: FONT_SIZE.FS12,
                  color: COLORS.TEXT_SECONDARY,
                  fontFamily: poppins.style.fontFamily,
                }}
              >
                Super Admin
              </Typography>
            </Box>
            <KeyboardArrowDown sx={{ color: COLORS.TEXT_SECONDARY }} />
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          slotProps={{
            paper: {
              sx: {
                mt: 1.5,
                borderRadius: "12px",
                boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
                border: "1px solid rgba(0,0,0,0.05)",
                minWidth: 150,
              },
            },
          }}
        >
          <MenuItem onClick={handleMenuClose} sx={{ fontFamily: poppins.style.fontFamily }}>Profile</MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: COLORS.ERROR, fontFamily: poppins.style.fontFamily }}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
