"use client";
import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import {
  Dashboard,
  People,
  School,
  AccountBalance,
  CardMembership,
  Public,
  Description,
  RocketLaunch,
  EventAvailable,
  BatchPrediction,
  FolderOpen,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { COLORS, FONT_SIZE } from "@/utils/enum";
import { poppins } from "@/utils/fonts";

const DRAWER_WIDTH = 280;

const MENU_ITEMS = [
  { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
  { text: "Board Management", icon: <School />, path: "/dashboard/schools" },
  {
    text: "Plan Management",
    icon: <CardMembership />,
    path: "/dashboard/plans",
  },
  {
    text: "Training Management",
    icon: <EventAvailable />,
    path: "/dashboard/interviews",
  },
  {
    text: "Batch Management",
    icon: <BatchPrediction />,
    path: "/dashboard/batches",
  },
  {
    text: "Country Management",
    icon: <Public />,
    path: "/dashboard/countries",
  },
  {
    text: "Research Management",
    icon: <Description />,
    path: "/dashboard/research",
  },
  {
    text: "Innovation Management",
    icon: <Description />,
    path: "/dashboard/innovation-management",
  },
  {
    text: "Resource Management",
    icon: <FolderOpen />,
    path: "/dashboard/resources",
  },
  {
    text: "Startup Management",
    icon: <RocketLaunch />,
    path: "/dashboard/startups",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          backgroundColor: COLORS.PRIMARY_NAVY,
          // backgroundImage: `linear-gradient(180deg, ${COLORS.NAVY_GRADIENT_START} 0%, ${COLORS.NAVY_GRADIENT_END} 100%)`,
          color: COLORS.WHITE,
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        },
      }}
    >
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: poppins.style.fontFamily,
            fontWeight: 800,
            letterSpacing: 2,
            color: COLORS.ACCENT_TAN,
            textTransform: "uppercase",
          }}
        >
          IAIRE
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "rgba(255, 255, 255, 0.5)", letterSpacing: 1 }}
        >
          ADMIN PANEL
        </Typography>
      </Box>

      <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)", mb: 2 }} />

      <List sx={{ px: 2 }}>
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => router.push(item.path)}
                sx={{
                  borderRadius: "12px",
                  backgroundColor: isActive
                    ? "rgba(209, 160, 84, 0.15)"
                    : "transparent",
                  color: isActive
                    ? COLORS.ACCENT_TAN
                    : "rgba(255, 255, 255, 0.7)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: COLORS.WHITE,
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive
                      ? COLORS.ACCENT_TAN
                      : "rgba(255, 255, 255, 0.7)",
                    minWidth: 45,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontSize: FONT_SIZE.FS14,
                      fontWeight: isActive ? 600 : 400,
                      fontFamily: poppins.style.fontFamily,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
