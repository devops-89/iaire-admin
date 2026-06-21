"use client";
import { useGetResources } from "@/hooks/common/useResources";
import { COLORS, FILE_TYPE, RESOURCES_TYPE } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import { ResourceItem } from "@/utils/type";
import {
  Box,
  Button,
  Card,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  InputBase,
  alpha,
} from "@mui/material";
import { Folder, Search } from "@mui/icons-material";
import Link from "next/link";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";

const FS = { fontFamily: poppins.style.fontFamily };

const FILE_TYPE_COLORS: Record<string, string> = {
  PDF: "#E53935",
  PPT: "#FB8C00",
  VIDEO: "#1E88E5",
  IMAGE: "#43A047",
};

const SECTION_OPTIONS = [
  { label: "All Sections", value: "ALL" },
  { label: "Curriculum", value: RESOURCES_TYPE.CURRICULUM },
  { label: "Modules", value: RESOURCES_TYPE.MODULES },
  { label: "Document Templates", value: RESOURCES_TYPE.DOCUMENT_TEMPLATE },
  { label: "Training Videos", value: RESOURCES_TYPE.TRAINING_VIDEOS },
  { label: "Case Studies", value: RESOURCES_TYPE.CASE_STUDIES },
  { label: "Template", value: RESOURCES_TYPE.TEMPLATE },
];

const FILE_TYPE_OPTIONS = [
  { label: "All File Types", value: "ALL" },
  { label: "PDF", value: FILE_TYPE.PDF },
  { label: "PPT", value: FILE_TYPE.PPT },
  { label: "Videos", value: FILE_TYPE.VIDEOS },
  { label: "Images", value: FILE_TYPE.IMAGES },
];

const ResourceManagement = () => {
  const { getResources, loading, data, pagination } = useGetResources();
  const [searchTerm, setSearchTerm] = useState("");
  const [sectionFilter, setSectionFilter] = useState("ALL");
  const [fileTypeFilter, setFileTypeFilter] = useState("ALL");

  const fetchResources = useCallback(
    (page = 1, limit = pagination.limit) => {
      getResources(
        page,
        limit,
        sectionFilter !== "ALL" ? sectionFilter : undefined,
        fileTypeFilter !== "ALL" ? fileTypeFilter : undefined,
      );
    },
    [sectionFilter, fileTypeFilter, pagination.limit],
  );

  // Initial fetch
  useEffect(() => {
    fetchResources();
  }, []);

  // Re-fetch when filters change
  useEffect(() => {
    fetchResources(1);
  }, [sectionFilter, fileTypeFilter]);

  // Client-side search on the current page data
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    if (!searchTerm) return data;
    const search = searchTerm.toLowerCase();
    return data.filter((item: ResourceItem) => {
      const titleMatch = item.title?.toLowerCase().includes(search);
      const descMatch = item.description?.toLowerCase().includes(search);
      const fileNameMatch = item.fileName?.toLowerCase().includes(search);
      return titleMatch || descMatch || fileNameMatch;
    });
  }, [data, searchTerm]);

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes, 10);
    if (isNaN(size)) return "—";
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 4 }}
    >
      {/* Header */}
      <Stack
        direction={"row"}
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 20,
              fontFamily: poppins.style.fontFamily,
              fontWeight: 800,
              color: COLORS.TEXT_PRIMARY,
              letterSpacing: -0.5,
            }}
          >
            Resource Management
          </Typography>
          <Typography
            sx={{
              ...FS,
              color: COLORS.TEXT_SECONDARY,
              fontSize: 14,
              mt: 0.5,
            }}
          >
            Manage curriculum documents, training videos, templates, and more.
          </Typography>
        </Box>
        <Link href="/dashboard/resources/add-resources">
          <Button
            sx={{
              fontSize: 14,
              fontFamily: poppins.style.fontFamily,
              background: `linear-gradient(135deg, ${COLORS.PRIMARY_NAVY} 0%, #1A293D 100%)`,
              color: COLORS.WHITE,
              padding: "10px 24px",
              borderRadius: "14px",
              fontWeight: 600,
              cursor: "pointer",
              textTransform: "none",
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
        </Link>
      </Stack>

      {/* Search & Filters */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        {/* Search */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: COLORS.INPUT_BG,
            borderRadius: "14px",
            px: 2,
            py: 0.8,
            flex: 1,
            border: "1px solid rgba(0,0,0,0.03)",
          }}
        >
          <Search sx={{ color: COLORS.TEXT_SECONDARY, mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="Search by title, description, or file name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              ...FS,
              fontSize: "0.9rem",
              width: "100%",
            }}
          />
        </Box>

        {/* Section Filter */}
        <FormControl
          size="small"
          sx={{
            minWidth: 180,
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              backgroundColor: COLORS.INPUT_BG,
              ...FS,
              fontSize: 14,
              "& fieldset": { borderColor: "rgba(0,0,0,0.03)" },
              "&:hover fieldset": { borderColor: "rgba(0,0,0,0.1)" },
            },
            "& .MuiInputLabel-root": { ...FS, fontSize: 14 },
          }}
        >
          <InputLabel>Section</InputLabel>
          <Select
            value={sectionFilter}
            label="Section"
            onChange={(e) => setSectionFilter(e.target.value)}
          >
            {SECTION_OPTIONS.map((opt) => (
              <MenuItem
                key={opt.value}
                value={opt.value}
                sx={{ ...FS, fontSize: 14 }}
              >
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* File Type Filter */}
        <FormControl
          size="small"
          sx={{
            minWidth: 170,
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              backgroundColor: COLORS.INPUT_BG,
              ...FS,
              fontSize: 14,
              "& fieldset": { borderColor: "rgba(0,0,0,0.03)" },
              "&:hover fieldset": { borderColor: "rgba(0,0,0,0.1)" },
            },
            "& .MuiInputLabel-root": { ...FS, fontSize: 14 },
          }}
        >
          <InputLabel>File Type</InputLabel>
          <Select
            value={fileTypeFilter}
            label="File Type"
            onChange={(e) => setFileTypeFilter(e.target.value)}
          >
            {FILE_TYPE_OPTIONS.map((opt) => (
              <MenuItem
                key={opt.value}
                value={opt.value}
                sx={{ ...FS, fontSize: 14 }}
              >
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Table Card */}
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
            py: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              ...FS,
              fontSize: 15,
              fontWeight: 700,
              color: COLORS.TEXT_PRIMARY,
            }}
          >
            All Resources
          </Typography>
          <Typography
            sx={{
              ...FS,
              fontSize: 13,
              color: COLORS.TEXT_SECONDARY,
              fontWeight: 500,
            }}
          >
            Total:{" "}
            <strong style={{ color: COLORS.PRIMARY_NAVY }}>
              {pagination.total}
            </strong>
          </Typography>
        </Box>

        <TableContainer sx={{ minWidth: 900 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "rgba(11, 23, 39, 0.02)" }}>
              <TableRow>
                <TableCell
                  sx={{
                    ...FS,
                    fontWeight: 700,
                    color: COLORS.PRIMARY_NAVY,
                    pl: 4,
                  }}
                >
                  ID
                </TableCell>
                <TableCell
                  sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}
                >
                  Title
                </TableCell>
                <TableCell
                  sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}
                >
                  Section
                </TableCell>
                <TableCell
                  sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}
                >
                  File Type
                </TableCell>
                <TableCell
                  sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}
                >
                  File Size
                </TableCell>
                <TableCell
                  sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{ ...FS, fontWeight: 700, color: COLORS.PRIMARY_NAVY }}
                >
                  Created At
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ pl: 4 }}>
                      <Skeleton width="30px" height="24px" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="200px" height="24px" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="100px" height="24px" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="60px" height="24px" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="70px" height="24px" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="80px" height="24px" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="100px" height="24px" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Stack
                      spacing={1}
                      sx={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Folder
                        sx={{
                          fontSize: 48,
                          color: alpha(COLORS.PRIMARY_NAVY, 0.2),
                          mb: 1,
                        }}
                      />
                      <Typography
                        sx={{
                          ...FS,
                          fontWeight: 700,
                          color: COLORS.TEXT_PRIMARY,
                        }}
                      >
                        No Resources Found
                      </Typography>
                      <Typography
                        sx={{
                          ...FS,
                          fontSize: 13,
                          color: COLORS.TEXT_SECONDARY,
                        }}
                      >
                        {searchTerm ||
                        sectionFilter !== "ALL" ||
                        fileTypeFilter !== "ALL"
                          ? "No records match the selected filters or search."
                          : "Start by adding your first resource."}
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row: ResourceItem) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ ...FS, pl: 4, fontWeight: 600 }}>
                      {row.id}
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          ...FS,
                          fontWeight: 700,
                          fontSize: 14,
                          color: COLORS.TEXT_PRIMARY,
                          maxWidth: 280,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.title}
                      </Typography>
                      {row.description && (
                        <Typography
                          sx={{
                            ...FS,
                            fontSize: 12,
                            color: COLORS.TEXT_SECONDARY,
                            maxWidth: 280,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            mt: 0.25,
                          }}
                        >
                          {row.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.section}
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
                    <TableCell>
                      <Chip
                        label={row.fileType}
                        size="small"
                        sx={{
                          ...FS,
                          fontWeight: 700,
                          fontSize: 10,
                          height: 24,
                          bgcolor: alpha(
                            FILE_TYPE_COLORS[row.fileType] ||
                              COLORS.TEXT_SECONDARY,
                            0.1,
                          ),
                          color:
                            FILE_TYPE_COLORS[row.fileType] ||
                            COLORS.TEXT_SECONDARY,
                          border: `1px solid ${
                            FILE_TYPE_COLORS[row.fileType] ||
                            COLORS.TEXT_SECONDARY
                          }`,
                          borderRadius: "6px",
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY }}
                    >
                      {formatFileSize(row.fileSize)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          ...FS,
                          fontWeight: 700,
                          fontSize: 10,
                          height: 24,
                          bgcolor:
                            row.status === "ACTIVE"
                              ? alpha(COLORS.SUCCESS, 0.1)
                              : alpha(COLORS.ERROR, 0.1),
                          color:
                            row.status === "ACTIVE"
                              ? COLORS.SUCCESS
                              : COLORS.ERROR,
                          border: `1px solid ${
                            row.status === "ACTIVE"
                              ? COLORS.SUCCESS
                              : COLORS.ERROR
                          }`,
                          borderRadius: "6px",
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ ...FS, fontSize: 13, color: COLORS.TEXT_SECONDARY }}
                    >
                      {moment(row.createdAt).format("MMM DD, YYYY")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1}
          rowsPerPage={pagination.limit}
          onPageChange={(_, newPage) => {
            fetchResources(newPage + 1, pagination.limit);
          }}
          onRowsPerPageChange={(event) => {
            fetchResources(1, parseInt(event.target.value, 10));
          }}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
        />
      </Card>
    </Box>
  );
};

export default ResourceManagement;
