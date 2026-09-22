"use client";
import { useLogin } from "@/hooks/common/useLogin";
import { COLORS, FONT_SIZE } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import {
  Dashboard,
  EventAvailable,
  Groups,
  AccountBalance,
  Lightbulb,
  Science,
  RocketLaunch,
  CardMembership,
  Public,
  Folder,
  KeyboardArrowDown,
  QuestionMark,
  Person,
  MenuOpen,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 80;

interface MenuFlatItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const MENU_ITEMS: MenuFlatItem[] = [
  { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
  {
    text: "Training Management",
    icon: <EventAvailable />,
    path: "/dashboard/interviews",
  },
  { text: "Batch Management", icon: <Groups />, path: "/dashboard/batches" },
  {
    text: "Board Management",
    icon: <AccountBalance />,
    path: "/dashboard/boards",
  },
  {
    text: "Innovation Management",
    icon: <Lightbulb />,
    path: "/dashboard/innovation-management",
  },
  {
    text: "Research Management",
    icon: <Science />,
    path: "/dashboard/research",
  },
  {
    text: "Startup Management",
    icon: <RocketLaunch />,
    path: "/dashboard/startups",
  },
  {
    text: "Plan Management",
    icon: <CardMembership />,
    path: "/dashboard/plans",
  },
  {
    text: "Country Management",
    icon: <Public />,
    path: "/dashboard/countries",
  },
  {
    text: "Resource Management",
    icon: <Folder />,
    path: "/dashboard/resources",
  },
  {
    text: "Support Tickets",
    icon: <QuestionMark />,
    path: "/dashboard/support-tickets",
  },
  {
    text: "School Head Boy/Girl Nomination",
    icon: <Person />,
    path: "/dashboard/school-head-nomination",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useLogin();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const currentWidth = isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

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
    <Drawer
      variant="permanent"
      sx={{
        width: currentWidth,
        flexShrink: 0,
        transition: "width 0.3s ease",
        "& .MuiDrawer-paper": {
          width: currentWidth,
          transition: "width 0.3s ease",
          height: "100vh",
          top: 0,
          left: 0,
          boxSizing: "border-box",
          backgroundColor: COLORS.PRIMARY_NAVY,
          color: COLORS.WHITE,
          borderRadius: 0,
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          minHeight: 70,
        }}
      >
        {!isCollapsed && (
          <Box
            component="img"
            src="/logo.png"
            alt="IAIRE Logo"
            sx={{
              maxHeight: 40,
              maxWidth: "70%",
              objectFit: "contain",
            }}
          />
        )}
        <IconButton
          onClick={() => setIsCollapsed(!isCollapsed)}
          sx={{ color: COLORS.WHITE }}
        >
          {isCollapsed ? <MenuIcon /> : <MenuOpen />}
        </IconButton>
      </Box>

      <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.08)", mb: 2 }} />

      <List sx={{ px: 2, flexGrow: 1, overflowY: "auto" }}>
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => router.push(item.path)}
                sx={{
                  borderRadius: "12px",
                  justifyContent: isCollapsed ? "center" : "initial",
                  backgroundColor: isActive ? COLORS.WHITE : "transparent",
                  color: isActive ? COLORS.PRIMARY_NAVY : COLORS.WHITE,
                  "&:hover": {
                    backgroundColor: isActive
                      ? COLORS.WHITE
                      : "rgba(255, 255, 255, 0.04)",
                    color: isActive ? COLORS.PRIMARY_NAVY : COLORS.WHITE,
                  },
                  py: 1,
                  px: isCollapsed ? 1 : 2,
                  transition: "all 0.2s ease",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? COLORS.PRIMARY_NAVY : COLORS.WHITE,
                    minWidth: isCollapsed ? 0 : 40,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!isCollapsed && (
                  <ListItemText
                    primary={item.text}
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontSize: FONT_SIZE.FS14,
                        fontWeight: isActive ? 600 : 400,
                        fontFamily: poppins.style.fontFamily,
                        color: "inherit",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box
        sx={{
          mt: "auto",
          p: 2,
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Box
          onClick={handleProfileMenuOpen}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "space-between",
            gap: 1.5,
            cursor: "pointer",
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            p: 1.2,
            borderRadius: "14px",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" },
            transition: "all 0.2s ease",
          }}
        >
          <Avatar
            sx={{
              width: 35,
              height: 35,
              bgcolor: "white",
              color: COLORS.PRIMARY_NAVY,
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            AD
          </Avatar>
          {!isCollapsed && (
            <>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 600,
                    fontFamily: poppins.style.fontFamily,
                    lineHeight: 1.2,
                    color: COLORS.WHITE,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Admin User
                </Typography>
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "rgba(255, 255, 255, 0.4)",
                    fontFamily: poppins.style.fontFamily,
                    mt: 0.2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Super Admin
                </Typography>
              </Box>
              <KeyboardArrowDown
                sx={{ color: "rgba(255, 255, 255, 0.4)", fontSize: 18 }}
              />
            </>
          )}
        </Box>
        {!isCollapsed && (
          <Typography
            sx={{
              fontSize: "15px",
              color: "rgba(255, 255, 255, 0.3)",
              fontFamily: poppins.style.fontFamily,
              textAlign: "right",
              mt: 1.5,
              letterSpacing: "1px",
            }}
          >
            v1
          </Typography>
        )}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "left", vertical: "bottom" }}
        anchorOrigin={{ horizontal: "left", vertical: "top" }}
        slotProps={{
          paper: {
            sx: {
              mb: 1.5,
              borderRadius: "12px",
              boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              minWidth: 150,
              backgroundColor: COLORS.PRIMARY_NAVY,
              color: COLORS.WHITE,
              "& .MuiMenuItem-root": {
                fontFamily: poppins.style.fontFamily,
                fontSize: "13px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                },
              },
            },
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }} />
        <MenuItem onClick={handleLogout} sx={{ color: COLORS.ERROR }}>
          Logout
        </MenuItem>
      </Menu>
    </Drawer>
  );
};

export default Sidebar;
