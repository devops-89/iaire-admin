"use client";

import { useInnovations } from "@/hooks/common/useInnovations";
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Tab,
  Tabs,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Skeleton,
  InputBase,
  Avatar,
  Stack,
  alpha,
} from "@mui/material";
import { Search, RocketLaunch, Assignment, Person } from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";
import dayjs from "dayjs";

// Types
import { INNOVATION_RESPONSE_DATA_PROPS } from "@/utils/type";

const FS = { fontFamily: poppins.style.fontFamily };

const STATUS_TABS = [
  { label: "All Proposals", value: "ALL" },
  { label: "Pending", value: "IAIRE_PENDING" },
  { label: "Approved", value: "IAIRE_APPROVED" },
  { label: "Attorney Review", value: "ATTORNEY_REVIEW" },
  { label: "Attorney Rejected", value: "ATTORNEY_REJECTED" },
];

const InnovationList = () => {
  const { innovationData, loading, fetchData } = useInnovations();
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchData(value);
  };

  // Filter local records by status (if tab is not ALL)
  const filteredData = (innovationData || []).filter((item: INNOVATION_RESPONSE_DATA_PROPS) => {
    if (activeTab === "ALL") return true;
    return item.status === activeTab;
  });

  const getStatusChip = (status: string) => {
    switch (status) {
      case "IAIRE_APPROVED":
        return (
          <Chip
            label="Approved"
            size="small"
            sx={{
              ...FS,
              fontWeight: 700,
              fontSize: 10,
              height: 24,
              bgcolor: alpha(COLORS.SUCCESS, 0.1),
              color: COLORS.SUCCESS,
              border: `1px solid ${COLORS.SUCCESS}`,
              borderRadius: "6px",
            }}
          />
        );
      case "IAIRE_PENDING":
        return (
          <Chip
            label="Pending Review"
            size="small"
            sx={{
              ...FS,
              fontWeight: 700,
              fontSize: 10,
              height: 24,
              bgcolor: alpha(COLORS.WARNING, 0.1),
              color: COLORS.WARNING,
              border: `1px solid ${COLORS.WARNING}`,
              borderRadius: "6px",
            }}
          />
        );
      case "ATTORNEY_REVIEW":
        return (
          <Chip
            label="Attorney Review"
            size="small"
            sx={{
              ...FS,
              fontWeight: 700,
              fontSize: 10,
              height: 24,
              bgcolor: alpha(COLORS.INFO, 0.1),
              color: COLORS.INFO,
              border: `1px solid ${COLORS.INFO}`,
              borderRadius: "6px",
            }}
          />
        );
      case "ATTORNEY_REJECTED":
        return (
          <Chip
            label="Attorney Rejected"
            size="small"
            sx={{
              ...FS,
              fontWeight: 700,
              fontSize: 10,
              height: 24,
              bgcolor: alpha(COLORS.ERROR, 0.1),
              color: COLORS.ERROR,
              border: `1px solid ${COLORS.ERROR}`,
              borderRadius: "6px",
            }}
          />
        );
      default:
        return (
          <Chip
            label={status}
            size="small"
            sx={{
              ...FS,
              fontWeight: 700,
              fontSize: 10,
              height: 24,
              bgcolor: "rgba(0,0,0,0.05)",
              color: COLORS.TEXT_SECONDARY,
              borderRadius: "6px",
            }}
          />
        );
    }
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Welcome & Overview Header */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2 }}>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: poppins.style.fontFamily,
              fontWeight: 800,
              color: COLORS.TEXT_PRIMARY,
              letterSpacing: -0.5,
            }}
          >
            Innovation Management
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: poppins.style.fontFamily,
              color: COLORS.TEXT_SECONDARY,
              mt: 0.5,
            }}
          >
            Review and evaluate student startup proposals and intellectual property.
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: COLORS.INPUT_BG,
            borderRadius: "14px",
            px: 2,
            py: 0.8,
            width: { xs: "100%", sm: "320px" },
            border: "1px solid rgba(0,0,0,0.03)",
          }}
        >
          <Search sx={{ color: COLORS.TEXT_SECONDARY, mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="Search by country or term..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              fontFamily: poppins.style.fontFamily,
              fontSize: "0.9rem",
              width: "100%",
            }}
          />
        </Box>
      </Box>

      {/* Tabs & Table Card */}
      <Card
        sx={{
          borderRadius: "28px",
          boxShadow: "0px 15px 50px rgba(0,0,0,0.02)",
          border: "1px solid rgba(0,0,0,0.04)",
          bgcolor: COLORS.WHITE,
          overflow: "hidden",
        }}
      >
        <Box sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)", px: 3, pt: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "3px 3px 0 0",
                bgcolor: COLORS.PRIMARY_NAVY,
              },
              "& .MuiTab-root": {
                ...FS,
                textTransform: "none",
                fontSize: 14,
                fontWeight: 600,
                minWidth: 100,
                color: COLORS.TEXT_SECONDARY,
                py: 2,
                "&.Mui-selected": {
                  color: COLORS.PRIMARY_NAVY,
                },
              },
            }}
          >
            {STATUS_TABS.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
          
          <Typography sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY, fontWeight: 500, display: { xs: "none", md: "block" } }}>
            Total: <strong style={{ color: COLORS.PRIMARY_NAVY }}>{filteredData.length}</strong> Submissions
          </Typography>
        </Box>

        <TableContainer sx={{ minWidth: 900 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "rgba(1, 90, 80, 0.02)" }}>
              <TableRow>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY, pl: 4 }}>Proposal Details</TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Creator / Student</TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Team & School</TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Date Submitted</TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ pl: 4 }}><Skeleton width="200px" height="24px" /><Skeleton width="140px" height="16px" sx={{ mt: 0.5 }} /></TableCell>
                    <TableCell><Skeleton variant="circular" width={32} height={32} sx={{ display: "inline-block", mr: 1, verticalAlign: "middle" }} /><Skeleton width="100px" height="20px" sx={{ display: "inline-block", verticalAlign: "middle" }} /></TableCell>
                    <TableCell><Skeleton width="120px" height="20px" /></TableCell>
                    <TableCell><Skeleton width="100px" height="20px" /></TableCell>
                    <TableCell><Skeleton width="80px" height="24px" /></TableCell>
                  </TableRow>
                ))
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Stack spacing={1} sx={{ alignItems: "center", justifyContent: "center" }}>
                      <RocketLaunch sx={{ fontSize: 48, color: alpha(COLORS.PRIMARY_NAVY, 0.2), mb: 1 }} />
                      <Typography sx={{ ...FS, fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>
                        No Innovations Found
                      </Typography>
                      <Typography sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY }}>
                        No records match the selected status or search filter.
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row) => (
                  <TableRow key={row.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    {/* Proposal Details */}
                    <TableCell sx={{ pl: 4 }}>
                      <Typography sx={{ ...FS, fontWeight: 700, color: COLORS.TEXT_PRIMARY, fontSize: 14 }}>
                        {row.title}
                      </Typography>
                      <Typography
                        sx={{
                          ...FS,
                          fontSize: 12,
                          color: COLORS.TEXT_SECONDARY,
                          maxWidth: "360px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          mt: 0.5,
                        }}
                        title={row.problemDescription}
                      >
                        {row.problemDescription}
                      </Typography>
                    </TableCell>

                    {/* Student Creator */}
                    <TableCell>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(COLORS.PRIMARY_NAVY, 0.1), color: COLORS.PRIMARY_NAVY }}>
                          <Person sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Box>
                          <Typography sx={{ ...FS, fontWeight: 600, fontSize: 13, color: COLORS.TEXT_PRIMARY }}>
                            {row.creator?.fullName || row.creator?.username || "N/A"}
                          </Typography>
                          <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                            {row.creator?.email || "No email"}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* Team & School */}
                    <TableCell>
                      <Typography sx={{ ...FS, fontWeight: 600, fontSize: 13, color: COLORS.TEXT_PRIMARY }}>
                        {row.team?.title || "N/A"}
                      </Typography>
                      <Typography sx={{ ...FS, fontSize: 12, color: COLORS.TEXT_SECONDARY }}>
                        {row.school?.name || "Independent"}
                      </Typography>
                    </TableCell>

                    {/* Date Submitted */}
                    <TableCell sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY }}>
                      {dayjs(row.createdAt).format("MMM DD, YYYY")}
                    </TableCell>

                    {/* Status */}
                    <TableCell>{getStatusChip(row.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default InnovationList;
