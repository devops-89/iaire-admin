"use client";
import React from "react";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "@/components/widgets/Sidebar";
import Navbar from "@/components/widgets/Navbar";
import { COLORS } from "@/utils/enum";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: "flex", backgroundColor: COLORS.BG_LIGHT, minHeight: "100vh" }}>
      <CssBaseline />
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0, // Prevent flex items from overflowing
        }}
      >
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <Box sx={{ p: { xs: 2, md: 4 }, flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
