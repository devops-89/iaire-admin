"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  InputBase,
  Menu,
  MenuItem,
  Dialog,
  CircularProgress,
  Grid,
  Avatar,
  Divider,
  Paper,
  Chip,
  Skeleton,
  alpha,
} from "@mui/material";
import {
  Add,
  MoreVert,
  Search,
  Visibility,
  Edit,
  Delete,
  Close,
  FolderOpen,
  CalendarMonth,
  Tag,
  Category,
} from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";
import { useResources, Resource } from "@/hooks/common/useResources";
import { useModal } from "@/store/useModal";
import AddResource from "@/modals/AddResource";
import moment from "moment";

const FS = { fontFamily: poppins.style.fontFamily };

const TABS = [
  { label: "All Resources", value: "ALL" },
  { label: "Playbooks", value: "Playbooks" },
  { label: "Modules", value: "Modules" },
  { label: "Templates", value: "Templates" },
];

const ResourcesManagement = () => {
  const { resources, loading, fetchResources, deleteResource } = useResources();
  const { showModal } = useModal();

  const [activeTab, setActiveTab] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeRecord, setActiveRecord] = useState<Resource | null>(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const handleOpenAddModal = () => {
    showModal(<AddResource onSuccess={fetchResources} />);
  };

  const handleOpenEditModal = () => {
    if (activeRecord) {
      showModal(<AddResource resourceToEdit={activeRecord} onSuccess={fetchResources} />);
      setAnchorEl(null);
    }
  };

  const handleDelete = async () => {
    if (activeRecord) {
      if (confirm("Are you sure you want to delete this resource?")) {
        await deleteResource(activeRecord.id);
      }
      setAnchorEl(null);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, record: Resource) => {
    setAnchorEl(event.currentTarget);
    setActiveRecord(record);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveRecord(null);
  };

  const handleViewDetails = () => {
    if (activeRecord) {
      setOpenDetailsModal(true);
      setAnchorEl(null);
    }
  };

  // Filter resources based on tab and search query
  const filteredResources = (resources || []).filter((item) => {
    // Category Filter
    if (activeTab !== "ALL" && item.category !== activeTab) {
      return false;
    }

    // Search Query
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const titleMatch = item.title?.toLowerCase().includes(q);
      const descMatch = item.description?.toLowerCase().includes(q);
      const tagMatch = item.tags?.some((t) => t.toLowerCase().includes(q));
      if (!titleMatch && !descMatch && !tagMatch) {
        return false;
      }
    }

    return true;
  });

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Header section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
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
            Resource Management
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: poppins.style.fontFamily,
              color: COLORS.TEXT_SECONDARY,
              mt: 0.5,
            }}
          >
            Access, view, search, and update playbooks, training modules, and standard template materials.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAddModal}
          sx={{
            background: `linear-gradient(135deg, ${COLORS.PRIMARY_NAVY} 0%, #1A293D 100%)`,
            borderRadius: "14px",
            textTransform: "none",
            ...FS,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            boxShadow: "0 8px 20px 0 rgba(11, 23, 39, 0.15)",
            transition: "all 0.3s",
            "&:hover": {
              boxShadow: "0 10px 24px 0 rgba(11, 23, 39, 0.25)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Add Resource
        </Button>
      </Box>

      {/* Search Input */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: COLORS.INPUT_BG,
          borderRadius: "14px",
          px: 2,
          py: 0.8,
          width: "100%",
          border: "1px solid rgba(0,0,0,0.03)",
        }}
      >
        <Search sx={{ color: COLORS.TEXT_SECONDARY, mr: 1, fontSize: 20 }} />
        <InputBase
          placeholder="Search by title, description, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            fontFamily: poppins.style.fontFamily,
            fontSize: "0.9rem",
            width: "100%",
          }}
        />
      </Box>

      {/* Resources Table Card */}
      <Card
        sx={{
          borderRadius: "28px",
          boxShadow: "0px 15px 50px rgba(0,0,0,0.02)",
          border: "1px solid rgba(0,0,0,0.04)",
          bgcolor: COLORS.WHITE,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            px: 3,
            pt: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
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
            {TABS.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>

          <Typography
            sx={{
              ...FS,
              fontSize: 13,
              color: COLORS.TEXT_SECONDARY,
              fontWeight: 500,
              display: { xs: "none", md: "block" },
            }}
          >
            Total Items: <strong style={{ color: COLORS.PRIMARY_NAVY }}>{filteredResources.length}</strong>
          </Typography>
        </Box>

        <TableContainer sx={{ minWidth: 900 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "rgba(11, 23, 39, 0.02)" }}>
              <TableRow>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY, pl: 4 }}>
                  Resource details
                </TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>
                  Category
                </TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>
                  Tags
                </TableCell>
                <TableCell sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}>
                  Date Created
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY, pr: 4 }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ pl: 4 }}>
                      <Skeleton width="180px" height="24px" />
                      <Skeleton width="280px" height="16px" sx={{ mt: 0.5 }} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="90px" height="24px" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="150px" height="24px" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="100px" height="20px" />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 4 }}>
                      <Skeleton variant="circular" width={30} height={30} sx={{ ml: "auto" }} />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredResources.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Stack spacing={1} sx={{ alignItems: "center", justifyContent: "center" }}>
                      <FolderOpen sx={{ fontSize: 48, color: alpha(COLORS.PRIMARY_NAVY, 0.2), mb: 1 }} />
                      <Typography sx={{ ...FS, fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>
                        No Resources Found
                      </Typography>
                      <Typography sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY }}>
                        No items match the selected category or search filters.
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                filteredResources.map((row) => (
                  <TableRow key={row.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    {/* Details */}
                    <TableCell sx={{ pl: 4, maxWidth: "350px" }}>
                      <Typography sx={{ ...FS, fontWeight: 700, color: COLORS.TEXT_PRIMARY, fontSize: 14 }}>
                        {row.title}
                      </Typography>
                      <Typography
                        sx={{
                          ...FS,
                          fontSize: 12,
                          color: COLORS.TEXT_SECONDARY,
                          mt: 0.5,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.description}
                      </Typography>
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <Chip
                        label={row.category}
                        size="small"
                        sx={{
                          ...FS,
                          fontWeight: 700,
                          fontSize: 10,
                          height: 24,
                          bgcolor: alpha(COLORS.PRIMARY_NAVY, 0.08),
                          color: COLORS.PRIMARY_NAVY,
                          borderRadius: "6px",
                        }}
                      />
                    </TableCell>

                    {/* Tags */}
                    <TableCell sx={{ maxWidth: "250px" }}>
                      <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: "wrap" }}>
                        {row.tags?.map((t) => (
                          <Chip
                            key={t}
                            label={t}
                            size="small"
                            sx={{
                              ...FS,
                              fontWeight: 600,
                              fontSize: 9,
                              height: 18,
                              bgcolor: "rgba(0,0,0,0.04)",
                              color: COLORS.TEXT_SECONDARY,
                            }}
                          />
                        ))}
                      </Stack>
                    </TableCell>

                    {/* Created At */}
                    <TableCell sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY }}>
                      {moment(row.createdAt).format("MMM DD, YYYY")}
                    </TableCell>

                    {/* Action button */}
                    <TableCell align="right" sx={{ pr: 4 }}>
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, row)}
                        sx={{
                          bgcolor: "rgba(0,0,0,0.03)",
                          "&:hover": { bgcolor: "rgba(0,0,0,0.08)" },
                        }}
                      >
                        <MoreVert sx={{ color: COLORS.PRIMARY_NAVY }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
              border: "1px solid rgba(0,0,0,0.05)",
              mt: 1,
              minWidth: 160,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={handleViewDetails}
          sx={{
            ...FS,
            fontSize: 13,
            fontWeight: 600,
            py: 1,
            color: COLORS.BLACK,
            display: "flex",
            gap: 1.5,
            "&:hover": { bgcolor: "rgba(1, 90, 80, 0.04)" },
          }}
        >
          <Visibility sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
          View Details
        </MenuItem>
        <MenuItem
          onClick={handleOpenEditModal}
          sx={{
            ...FS,
            fontSize: 13,
            fontWeight: 600,
            py: 1,
            color: COLORS.BLACK,
            display: "flex",
            gap: 1.5,
            "&:hover": { bgcolor: "rgba(1, 90, 80, 0.04)" },
          }}
        >
          <Edit sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
          Edit
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={handleDelete}
          sx={{
            ...FS,
            fontSize: 13,
            fontWeight: 600,
            py: 1,
            color: COLORS.ERROR,
            display: "flex",
            gap: 1.5,
            "&:hover": { bgcolor: alpha(COLORS.ERROR, 0.04) },
          }}
        >
          <Delete sx={{ fontSize: 18, color: COLORS.ERROR }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Details Dialog */}
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openDetailsModal}
        onClose={() => {
          setOpenDetailsModal(false);
          setActiveRecord(null);
        }}
        slotProps={{
          paper: { sx: { borderRadius: "28px", p: 0, overflow: "hidden" } },
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(8px)",
            },
          },
        }}
      >
        {activeRecord && (
          <Box>
            {/* Dialog Header Banner */}
            <Box sx={{ p: 4, bgcolor: COLORS.PRIMARY_NAVY, color: "white", position: "relative" }}>
              <IconButton
                onClick={() => {
                  setOpenDetailsModal(false);
                  setActiveRecord(null);
                }}
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                  },
                }}
              >
                <Close sx={{ fontSize: 20 }} />
              </IconButton>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3, pr: 4 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    borderRadius: "16px",
                  }}
                >
                  <FolderOpen sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography sx={{ ...FS, fontSize: 20, fontWeight: 800, lineHeight: 1.2 }}>
                    {activeRecord.title}
                  </Typography>
                  <Typography sx={{ ...FS, fontSize: 13, color: "rgba(255,255,255,0.8)", mt: 0.8 }}>
                    Category: {activeRecord.category}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Dialog Content */}
            <Box sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <Typography
                    sx={{
                      ...FS,
                      fontSize: 12,
                      color: COLORS.TEXT_SECONDARY,
                      fontWeight: 600,
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Category sx={{ fontSize: 14 }} /> Description
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2.5, borderRadius: "16px", bgcolor: "rgba(0,0,0,0.01)" }}
                  >
                    <Typography
                      sx={{
                        ...FS,
                        fontSize: 14,
                        color: COLORS.TEXT_PRIMARY,
                        lineHeight: 1.6,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {activeRecord.description}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={12}>
                  <Typography
                    sx={{
                      ...FS,
                      fontSize: 12,
                      color: COLORS.TEXT_SECONDARY,
                      fontWeight: 600,
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Tag sx={{ fontSize: 14 }} /> Resource Tags
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                    {activeRecord.tags?.length === 0 ? (
                      <Typography
                        variant="caption"
                        sx={{ ...FS, color: COLORS.TEXT_SECONDARY, fontStyle: "italic" }}
                      >
                        No tags assigned to this resource.
                      </Typography>
                    ) : (
                      activeRecord.tags?.map((t) => (
                        <Chip
                          key={t}
                          label={t}
                          sx={{
                            ...FS,
                            fontWeight: 600,
                            fontSize: 11,
                            bgcolor: "rgba(1, 90, 80, 0.08)",
                            color: COLORS.PRIMARY_NAVY,
                            borderRadius: "8px",
                          }}
                        />
                      ))
                    )}
                  </Box>
                </Grid>

                <Grid size={12}>
                  <Divider sx={{ my: 1 }} />
                  <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                    <Box>
                      <Typography
                        sx={{
                          ...FS,
                          fontSize: 11,
                          color: COLORS.TEXT_SECONDARY,
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <CalendarMonth sx={{ fontSize: 14 }} /> Date Added
                      </Typography>
                      <Typography sx={{ ...FS, fontSize: 13, fontWeight: 700, mt: 0.5 }}>
                        {moment(activeRecord.createdAt).format("MMMM DD, YYYY")}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3, borderStyle: "dashed" }} />

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={() => {
                    setOpenDetailsModal(false);
                    setActiveRecord(null);
                  }}
                  variant="outlined"
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    px: 4,
                    color: COLORS.TEXT_SECONDARY,
                    borderColor: "rgba(0,0,0,0.15)",
                  }}
                >
                  Close Details
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default ResourcesManagement;
