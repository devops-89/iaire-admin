"use client";
import React from "react";
import { Box, Typography, Grid, Card, Avatar, LinearProgress, Stack, Button, Dialog, IconButton, Chip, Paper, alpha, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, CircularProgress, Tabs, Tab, Menu, MenuItem } from "@mui/material";
import { RocketLaunch, EmojiObjects, Paid, TrendingUp, Close, Info, School as SchoolIcon, Work, People, Person, PictureAsPdf, OpenInNew, MoreVert, Visibility } from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";
import dayjs from "dayjs";

const STARTUP_STAGES = [
  { stage: "Ideation", count: 145, icon: <EmojiObjects />, color: "#FF9800", percentage: 40 },
  { stage: "Seed Funded", count: 86, icon: <Paid />, color: "#4CAF50", percentage: 25 },
  { stage: "Series A+", count: 32, icon: <TrendingUp />, color: "#2196F3", percentage: 15 },
  { stage: "Exited", count: 12, icon: <RocketLaunch />, color: "#9C27B0", percentage: 5 },
];

const STATUS_TABS = [
  { label: "All Startups", value: "ALL" },
  { label: "Draft", value: "DRAFT" },
  { label: "Funded", value: "FUNDED" },
  { label: "Archived", value: "ARCHIVED" },
];

const StartupsManagement = () => {
  const [startups, setStartups] = React.useState<any[]>([]);
  const [openDetailsModal, setOpenDetailsModal] = React.useState(false);
  const [activeStartup, setActiveStartup] = React.useState<any>(null);
  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("ALL");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuStartup, setMenuStartup] = React.useState<any>(null);

  React.useEffect(() => {
    setLoading(true);
    import('@/app/api/startupControllers').then(({ StartupControllers }) => {
      StartupControllers.getAllStartups(page + 1, rowsPerPage, activeTab)
        .then((res: any) => {
          if (res?.data?.data?.data && Array.isArray(res.data.data.data)) {
            setStartups(res.data.data.data);
            setTotalCount(res.data.data.pagination?.total || res.data.data.data.length);
          } else if (res?.data?.data && Array.isArray(res.data.data)) {
            setStartups(res.data.data);
            setTotalCount(res.data.pagination?.total || res.data.data.length);
          }
          setLoading(false);
        })
        .catch((err: any) => {
          console.log('Error fetching startups', err);
          setLoading(false);
        });
    });
  }, [page, rowsPerPage, activeTab]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, startup: any) => {
    setAnchorEl(event.currentTarget);
    setMenuStartup(startup);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuStartup(null);
  };

  const handleOpenDetails = (startup: any) => {
    setActiveStartup(startup);
    setOpenDetailsModal(true);
    handleMenuClose();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    setPage(0); // Reset page when tab changes
  };

  const FS = { fontFamily: poppins.style.fontFamily };

  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: poppins.style.fontFamily, fontWeight: 700, color: COLORS.BLACK }}>
            Startup Management
          </Typography>
          <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 14, mt: 1 }}>
            Manage and view all registered startups.
          </Typography>
        </Box>
      </Box>

      <Card sx={{ borderRadius: "24px", boxShadow: "0px 10px 30px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.04)", overflow: "hidden" }}>
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
            Total: <strong style={{ color: COLORS.PRIMARY_NAVY }}>{totalCount}</strong> Startups
          </Typography>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: 13, color: COLORS.TEXT_SECONDARY, py: 2, pl: 4 }}>Startup Details</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13, color: COLORS.TEXT_SECONDARY, py: 2 }}>Sector</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13, color: COLORS.TEXT_SECONDARY, py: 2 }}>School / Team</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13, color: COLORS.TEXT_SECONDARY, py: 2 }}>Stage</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13, color: COLORS.TEXT_SECONDARY, py: 2 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13, color: COLORS.TEXT_SECONDARY, py: 2, pr: 4, textAlign: "right" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={30} sx={{ color: COLORS.PRIMARY_NAVY }} />
                  </TableCell>
                </TableRow>
              ) : startups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ color: COLORS.TEXT_SECONDARY }}>No Startups Found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                startups.map((startup) => (
                  <TableRow key={startup.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                    <TableCell sx={{ pl: 4 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar 
                          src={startup.creator?.profileImageDownloadUrl}
                          sx={{ width: 45, height: 45, bgcolor: COLORS.PRIMARY_NAVY, borderRadius: "12px", fontSize: 16, fontWeight: 700 }}
                        >
                          {!startup.creator?.profileImageDownloadUrl && (startup.startupName ? startup.startupName.substring(0, 2).toUpperCase() : 'ST')}
                        </Avatar>
                        <Box>
                          <Typography sx={{ ...FS, fontSize: 14, fontWeight: 700, color: COLORS.BLACK }}>
                            {startup.startupName}
                          </Typography>
                          <Typography sx={{ ...FS, fontSize: 12, color: COLORS.TEXT_SECONDARY }}>
                            {startup.creator?.fullName || startup.creator?.username || "Unknown"}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ ...FS, fontSize: 13, fontWeight: 600 }}>{startup.sector || "N/A"}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ ...FS, fontSize: 13, fontWeight: 600 }}>{startup.school?.name || "Independent"}</Typography>
                      {startup.team?.title && (
                         <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>{startup.team.title}</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={startup.stage || "IDEA"} 
                        size="small" 
                        sx={{ bgcolor: alpha(COLORS.PRIMARY_NAVY, 0.1), color: COLORS.PRIMARY_NAVY, fontWeight: 700, fontSize: 11, borderRadius: "6px" }} 
                      />
                    </TableCell>
                    <TableCell>
                       <Chip 
                        label={startup.status || "DRAFT"} 
                        size="small" 
                        sx={{ bgcolor: startup.status === 'ARCHIVED' ? "rgba(239, 68, 68, 0.12)" : "rgba(16, 185, 129, 0.12)", color: startup.status === 'ARCHIVED' ? "#DC2626" : "#059669", fontWeight: 700, fontSize: 11, borderRadius: "6px" }} 
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 4 }}>
                       <IconButton 
                          onClick={(e) => handleMenuOpen(e, startup)}
                          sx={{ color: COLORS.PRIMARY_NAVY, bgcolor: "rgba(0,0,0,0.03)", "&:hover": { bgcolor: "rgba(0,0,0,0.08)" } }}
                       >
                         <MoreVert />
                       </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
        />
      </Card>

      {/* Startup Details Dialog */}
      <Dialog
        fullWidth
        maxWidth="md"
        open={openDetailsModal}
        onClose={() => { setOpenDetailsModal(false); setActiveStartup(null); }}
        slotProps={{
          paper: { sx: { borderRadius: "28px", p: 0, maxHeight: "90vh", overflowY: "auto" } },
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(8px)",
            },
          },
        }}
      >
        {activeStartup && (
          <Box>
            {/* Header Section */}
            <Box sx={{ p: 4, bgcolor: COLORS.PRIMARY_NAVY, color: "white", position: "relative" }}>
              <IconButton
                onClick={() => { setOpenDetailsModal(false); setActiveStartup(null); }}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: 16,
                  color: "rgba(255,255,255,0.7)",
                  "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.1)" }
                }}
              >
                <Close />
              </IconButton>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Avatar 
                  src={activeStartup.creator?.profileImageDownloadUrl}
                  sx={{ 
                    width: 72, 
                    height: 72, 
                    bgcolor: "rgba(255,255,255,0.2)", 
                    color: "white",
                    borderRadius: "18px",
                  }}
                >
                  {!activeStartup.creator?.profileImageDownloadUrl && (activeStartup.startupName ? activeStartup.startupName.substring(0, 2).toUpperCase() : 'ST')}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ ...FS, fontSize: 22, fontWeight: 800 }}>
                    {activeStartup.startupName}
                  </Typography>
                  <Typography sx={{ ...FS, fontSize: 13, color: "rgba(255,255,255,0.8)", mt: 0.5 }}>
                    Submitted by {activeStartup.creator?.fullName || activeStartup.creator?.username || "Founder"} • {dayjs(activeStartup.createdAt).format("MMM DD, YYYY")}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                    <Chip label={activeStartup.status || "DRAFT"} size="small" sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", fontWeight: 700, fontSize: 10, height: 24 }} />
                    <Chip label={activeStartup.stage || "IDEA"} size="small" sx={{ bgcolor: "rgba(255,255,255,0.25)", color: "white", fontWeight: 700, fontSize: 10, height: 24 }} />
                  </Stack>
                </Box>
              </Box>
            </Box>

            {/* Content Section */}
            <Box sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {/* Left Column: Concept details */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <Stack spacing={3}>
                    {/* Problem Statement */}
                    <Box>
                      <Typography sx={{ ...FS, fontSize: 15, fontWeight: 800, mb: 1, color: COLORS.PRIMARY_NAVY, display: "flex", alignItems: "center", gap: 1 }}>
                        <Info sx={{ fontSize: 18 }} /> Problem Statement
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "16px", bgcolor: "rgba(0,0,0,0.01)" }}>
                        <Typography sx={{ ...FS, fontSize: 14, color: COLORS.TEXT_PRIMARY, lineHeight: 1.6 }}>
                          {activeStartup.problemStatement || "No description provided."}
                        </Typography>
                      </Paper>
                    </Box>

                    {/* Business Idea */}
                    <Box>
                      <Typography sx={{ ...FS, fontSize: 15, fontWeight: 800, mb: 1, color: COLORS.PRIMARY_NAVY, display: "flex", alignItems: "center", gap: 1 }}>
                        <RocketLaunch sx={{ fontSize: 18 }} /> Business Idea
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "16px", bgcolor: "rgba(0,0,0,0.01)" }}>
                        <Typography sx={{ ...FS, fontSize: 14, color: COLORS.TEXT_PRIMARY, lineHeight: 1.6 }}>
                          {activeStartup.businessIdea || "No solution provided."}
                        </Typography>
                      </Paper>
                    </Box>

                    {/* Team & School Info */}
                    <Box>
                      <Typography sx={{ ...FS, fontSize: 15, fontWeight: 800, mb: 2, color: COLORS.PRIMARY_NAVY, display: "flex", alignItems: "center", gap: 1 }}>
                        <SchoolIcon sx={{ fontSize: 18 }} /> School & Team
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "16px", bgcolor: "rgba(0,0,0,0.01)" }}>
                        <Stack spacing={2.5}>
                          {/* School details */}
                          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                            <Work sx={{ fontSize: 16, color: COLORS.TEXT_SECONDARY, mt: 0.5 }} />
                            <Box>
                              <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY }}>Nominated School</Typography>
                              <Typography sx={{ ...FS, fontSize: 13, fontWeight: 700 }}>
                                {activeStartup.school?.name || "Independent"}
                              </Typography>
                              {activeStartup.school?.city && (
                                <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                                  {activeStartup.school.city}, {activeStartup.school.state}
                                </Typography>
                              )}
                            </Box>
                          </Box>

                          {/* Team Code */}
                          {activeStartup.team && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <People sx={{ fontSize: 16, color: COLORS.TEXT_SECONDARY }} />
                              <Box>
                                <Typography sx={{ ...FS, fontSize: 10, color: COLORS.TEXT_SECONDARY }}>Team Title (Code)</Typography>
                                <Typography sx={{ ...FS, fontSize: 13, fontWeight: 600 }}>
                                  {activeStartup.team.title} ({activeStartup.team.teamCode})
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </Stack>
                      </Paper>
                    </Box>
                  </Stack>
                </Grid>

                {/* Right Column: Files & Actions */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <Stack spacing={3}>
                    {/* Media / Documents */}
                    <Box>
                      <Typography sx={{ ...FS, fontSize: 15, fontWeight: 800, mb: 2, color: COLORS.PRIMARY_NAVY }}>
                        Supporting Documents
                      </Typography>

                      <Stack spacing={2}>
                        {activeStartup.videoUrl && (
                          <Paper 
                            variant="outlined" 
                            component="a"
                            href={activeStartup.videoUrl}
                            target="_blank"
                            sx={{ 
                              p: 2, 
                              borderRadius: "16px", 
                              display: "flex", 
                              alignItems: "center", 
                              gap: 2,
                              cursor: "pointer",
                              textDecoration: "none",
                              color: "inherit",
                              "&:hover": { bgcolor: "rgba(0,0,0,0.02)" }
                            }}
                          >
                            <Box sx={{ width: 40, height: 40, borderRadius: "10px", bgcolor: alpha(COLORS.PRIMARY_NAVY, 0.1), display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.PRIMARY_NAVY }}>
                              <OpenInNew />
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography sx={{ ...FS, fontSize: 13, fontWeight: 600, color: COLORS.PRIMARY_NAVY }}>Demo Video</Typography>
                              <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>External Link</Typography>
                            </Box>
                          </Paper>
                        )}
                        {activeStartup.documents && activeStartup.documents.length > 0 ? (
                          activeStartup.documents.map((doc: any) => (
                            <Paper 
                              key={doc.id}
                              variant="outlined" 
                              component="a"
                              href={doc.downloadUrl || "#"}
                              target="_blank"
                              sx={{ 
                                p: 2, 
                                borderRadius: "16px", 
                                display: "flex", 
                                alignItems: "center", 
                                gap: 2,
                                cursor: "pointer",
                                textDecoration: "none",
                                color: "inherit",
                                "&:hover": { bgcolor: "rgba(0,0,0,0.02)" }
                              }}
                            >
                              <Box sx={{ width: 40, height: 40, borderRadius: "10px", bgcolor: "rgba(211, 47, 47, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#d32f2f" }}>
                                <PictureAsPdf />
                              </Box>
                              <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                                <Typography sx={{ ...FS, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                                  {doc.type.replace("_", " ")}
                                </Typography>
                                <Typography sx={{ ...FS, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                                  {doc.originalFileName} ({(doc.fileSize / 1024).toFixed(0)} KB)
                                </Typography>
                              </Box>
                            </Paper>
                          ))
                        ) : (
                          <Typography sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY }}>
                            No documents attached.
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
              mt: 1.5,
              borderRadius: '12px',
              minWidth: 160,
            },
          }
        }}
      >
        <MenuItem onClick={() => handleOpenDetails(menuStartup)} sx={{ py: 1.2, gap: 1.5 }}>
          <Visibility sx={{ fontSize: 18, color: COLORS.PRIMARY_NAVY }} />
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>View Details</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default StartupsManagement;
