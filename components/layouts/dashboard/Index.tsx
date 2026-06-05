"use client";

import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Stack,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { COLORS } from "@/utils/enum";
import { outfit, montserrat } from "@/utils/fonts";

const drawerWidth = 260;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: "100%", backgroundColor: COLORS.PRIMARY_NAVY, color: "white" }}>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            fontFamily: outfit.style.fontFamily,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          ADMIN PANEL
        </Typography>
      </Toolbar>
      <Divider sx={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
      <List sx={{ mt: 2, px: 2 }}>
        {[
          { text: "Dashboard", icon: <DashboardIcon /> },
          { text: "Users", icon: <PeopleIcon /> },
          { text: "Settings", icon: <SettingsIcon /> },
        ].map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              sx={{
                borderRadius: "12px",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" },
                "&.Mui-selected": { backgroundColor: COLORS.ACCENT_TAN },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  "& .MuiTypography-root": {
                    fontFamily: montserrat.style.fontFamily,
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ position: "absolute", bottom: 20, width: "100%", px: 2 }}>
        <ListItemButton
          sx={{
            borderRadius: "12px",
            backgroundColor: "rgba(255,255,255,0.05)",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
          }}
        >
          <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            sx={{
              "& .MuiTypography-root": {
                fontFamily: montserrat.style.fontFamily,
                fontSize: "0.9rem",
              },
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "white",
          color: COLORS.BLACK,
          boxShadow: "none",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontFamily: outfit.style.fontFamily,
              fontWeight: 600,
              fontSize: "1.1rem",
            }}
          >
            Overview
          </Typography>

          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Box sx={{ display: { xs: "none", md: "block" }, textAlign: "right" }}>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                  Admin User
                </Typography>
                <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY }}>
                  Super Admin
                </Typography>
              </Box>
              <Avatar
                sx={{
                  width: 35,
                  height: 35,
                  backgroundColor: COLORS.PRIMARY_NAVY,
                  fontSize: "0.9rem",
                }}
              >
                AD
              </Avatar>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, border: "none" },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: "64px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
