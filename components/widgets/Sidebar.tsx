"use client";
import { useLogin } from "@/hooks/common/useLogin";
import { COLORS, FONT_SIZE } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import {
  Dashboard,
  EventAvailable,
  ExpandLess,
  ExpandMore,
  KeyboardArrowDown,
  Public,
  RocketLaunch
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Collapse,
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
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const DRAWER_WIDTH = 280;

interface SubMenuItem {
  text: string;
  path: string;
}

interface MenuGroupItem {
  type: "group";
  id: string;
  text: string;
  icon: React.ReactNode;
  subItems: SubMenuItem[];
}

interface MenuFlatItem {
  type: "item";
  text: string;
  icon: React.ReactNode;
  path: string;
}

type MenuItemType = MenuFlatItem | MenuGroupItem;

const MENU_ITEMS: MenuItemType[] = [
  {
    type: "item",
    text: "Dashboard",
    icon: <Dashboard />,
    path: "/dashboard",
  },
  {
    type: "group",
    id: "programs",
    text: "Programs & Training",
    icon: <EventAvailable />,
    subItems: [
      { text: "Training Management", path: "/dashboard/interviews" },
      { text: "Batch Management", path: "/dashboard/batches" },
      { text: "Board Management", path: "/dashboard/schools" },
    ],
  },
  {
    type: "group",
    id: "innovation",
    text: "Innovation & Research",
    icon: <RocketLaunch />,
    subItems: [
      { text: "Innovation Management", path: "/dashboard/innovation-management" },
      { text: "Research Management", path: "/dashboard/research" },
      { text: "Startup Management", path: "/dashboard/startups" },
    ],
  },
  {
    type: "group",
    id: "system",
    text: "System Admin",
    icon: <Public />,
    subItems: [
      { text: "Plan Management", path: "/dashboard/plans" },
      { text: "Country Management", path: "/dashboard/countries" },
      { text: "Resource Management", path: "/dashboard/resources" },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useLogin();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

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

  // Pre-expand group if current path matches one of its sub-items
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(() => {
    const activeGroup = MENU_ITEMS.find(
      (item) => item.type === "group" && item.subItems.some((sub) => sub.path === pathname)
    );
    return activeGroup && activeGroup.type === "group" ? { [activeGroup.id]: true } : {};
  });

  const handleGroupToggle = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
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
        },
      }}
    >
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Box
          component="img"
          src="/logo.png"
          alt="IAIRE Logo"
          sx={{
            maxHeight: 45,
            maxWidth: "80%",
            objectFit: "contain",
          }}
        />
      </Box>

      <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.08)", mb: 2 }} />

      <List sx={{ px: 2, flexGrow: 1, overflowY: "auto" }}>
        {MENU_ITEMS.map((item) => {
          if (item.type === "item") {
            const isActive = pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => router.push(item.path)}
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: isActive
                      ? COLORS.WHITE
                      : "transparent",
                    color: isActive
                      ? COLORS.PRIMARY_NAVY
                      : COLORS.WHITE,
                    "&:hover": {
                      backgroundColor: isActive ? COLORS.WHITE : "rgba(255, 255, 255, 0.04)",
                      color: isActive ? COLORS.PRIMARY_NAVY : COLORS.WHITE,
                    },
                    py: 1,
                    transition: "all 0.2s ease",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive
                        ? COLORS.PRIMARY_NAVY
                        : COLORS.WHITE,
                      minWidth: 40,
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
                        color: "inherit",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          } else {
            const isOpen = !!openGroups[item.id];
            const isAnySubActive = item.subItems.some((sub) => sub.path === pathname);

            return (
              <Box key={item.text} sx={{ mb: 0.5 }}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleGroupToggle(item.id)}
                    sx={{
                      borderRadius: "12px",
                      color: COLORS.WHITE,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                        color: COLORS.WHITE,
                      },
                      py: 1,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: COLORS.WHITE,
                        minWidth: 40,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontSize: FONT_SIZE.FS14,
                          fontWeight: isAnySubActive ? 600 : 400,
                          fontFamily: poppins.style.fontFamily,
                          color: "inherit",
                        },
                      }}
                    />
                    {isOpen ? (
                      <ExpandLess sx={{ fontSize: 18 }} />
                    ) : (
                      <ExpandMore sx={{ fontSize: 18 }} />
                    )}
                  </ListItemButton>
                </ListItem>
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List
                    component="div"
                    disablePadding
                    sx={{
                      pl: 3.5,
                      mt: 0.5,
                      borderLeft: "1px solid rgba(255, 255, 255, 0.06)",
                      ml: 2.5,
                    }}
                  >
                    {item.subItems.map((sub) => {
                      const isSubActive = pathname === sub.path;
                      return (
                        <ListItem key={sub.text} disablePadding sx={{ mb: 0.5 }}>
                          <ListItemButton
                            onClick={() => router.push(sub.path)}
                            sx={{
                              borderRadius: "8px",
                              backgroundColor: isSubActive
                                ? COLORS.WHITE
                                : "transparent",
                              color: isSubActive
                                ? COLORS.PRIMARY_NAVY
                                : COLORS.WHITE,
                              "&:hover": {
                                color: isSubActive ? COLORS.PRIMARY_NAVY : COLORS.WHITE,
                                backgroundColor: isSubActive ? COLORS.WHITE : "rgba(255, 255, 255, 0.02)",
                              },
                              py: 0.6,
                              transition: "all 0.2s ease",
                            }}
                          >
                            <ListItemText
                              primary={sub.text}
                              sx={{
                                "& .MuiListItemText-primary": {
                                  fontSize: "13px",
                                  fontWeight: isSubActive ? 500 : 400,
                                  fontFamily: poppins.style.fontFamily,
                                  color: "inherit",
                                },
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          }
        })}
      </List>

      <Box sx={{ mt: "auto", p: 2, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <Box
          onClick={handleProfileMenuOpen}
          sx={{
            display: "flex",
            alignItems: "center",
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
            sx={{ width: 35, height: 35, bgcolor: "white", color: COLORS.PRIMARY_NAVY, fontWeight: 700, fontSize: "14px" }}
          >
            AD
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: poppins.style.fontFamily,
                lineHeight: 1.2,
                color: COLORS.WHITE,
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
              }}
            >
              Super Admin
            </Typography>
          </Box>
          <KeyboardArrowDown sx={{ color: "rgba(255, 255, 255, 0.4)", fontSize: 18 }} />
        </Box>
        <Typography 
          sx={{ 
            fontSize: "15px", 
            color: "rgba(255, 255, 255, 0.3)", 
            fontFamily: poppins.style.fontFamily, 
            textAlign: "right", 
            mt: 1.5,
            letterSpacing: "1px"
          }}
        >
          v1
        </Typography>
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
        <MenuItem onClick={handleLogout} sx={{ color: COLORS.ERROR }}>Logout</MenuItem>
      </Menu>
    </Drawer>
  );
};

export default Sidebar;
