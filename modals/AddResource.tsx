import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Grid,
  Autocomplete,
  Chip,
} from "@mui/material";
import { Close, Add, Edit } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useModal } from "@/store/useModal";
import { COLORS } from "@/utils/enum";
import { poppins, roboto } from "@/utils/fonts";
interface Resource {
  id: string | number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  createdAt: string;
}

const CATEGORY_OPTIONS = [
  { label: "Playbooks", value: "Playbooks" },
  { label: "Modules", value: "Modules" },
  { label: "Templates", value: "Templates" },
];

interface AddResourceProps {
  resourceToEdit?: Resource | null;
  onSuccess?: () => void;
}

const FS = { fontFamily: poppins.style.fontFamily };

export const resourceValidationSchema = Yup.object({
  title: Yup.string().required("Please Enter Resource Title").trim(),
  category: Yup.object().nullable().required("Please Select Category"),
  description: Yup.string().required("Please Enter Description").trim(),
});

const AddResource: React.FC<AddResourceProps> = ({ resourceToEdit, onSuccess }) => {
  const { hideModal } = useModal();
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(resourceToEdit?.tags || []);
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: resourceToEdit?.title || "",
      category: resourceToEdit
        ? CATEGORY_OPTIONS.find((opt) => opt.value === resourceToEdit.category) || null
        : null,
      description: resourceToEdit?.description || "",
    },
    validationSchema: resourceValidationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        // Dynamically import useResources or pass actions from parent. Since we want a robust modal, we can directly manipulate localStorage or import the helper.
        // Let's modify localStorage directly or perform the state update.
        // Since useResources hook has custom state, let's load resources, update it, and write back. This ensures consistency.
        const stored = localStorage.getItem("iaire_resources");
        let currentList: Resource[] = stored ? JSON.parse(stored) : [];

        if (resourceToEdit) {
          currentList = currentList.map((item) =>
            item.id === resourceToEdit.id
              ? {
                  ...item,
                  title: values.title,
                  category: values.category?.value || "Playbooks",
                  description: values.description,
                  tags: tags,
                }
              : item
          );
        } else {
          const newResource: Resource = {
            id: `res-${Date.now()}`,
            title: values.title,
            category: values.category?.value || "Playbooks",
            description: values.description,
            tags: tags,
            createdAt: new Date().toISOString(),
          };
          currentList = [newResource, ...currentList];
        }

        localStorage.setItem("iaire_resources", JSON.stringify(currentList));
        
        if (onSuccess) {
          onSuccess();
        }
        hideModal();
      } catch (error) {
        console.error("Failed to save resource", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      {/* Close button */}
      <IconButton
        onClick={hideModal}
        sx={{
          position: "absolute",
          top: -8,
          right: -8,
          color: COLORS.TEXT_SECONDARY,
          "&:hover": { color: COLORS.BLACK, bgcolor: "rgba(0,0,0,0.05)" },
        }}
      >
        <Close />
      </IconButton>

      <Typography
        sx={{
          fontFamily: roboto.style.fontFamily,
          fontSize: 26,
          fontWeight: 800,
          textAlign: "left",
          mb: 3,
          color: COLORS.PRIMARY_NAVY,
          letterSpacing: -0.5,
        }}
      >
        {resourceToEdit ? "Edit Resource" : "Add Resource"}
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {/* Title */}
          <Grid size={12}>
            <TextField
              label="Resource Title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && (formik.errors.title as string)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Grid>

          {/* Category */}
          <Grid size={12}>
            <Autocomplete
              options={CATEGORY_OPTIONS}
              getOptionLabel={(option) => option.label}
              value={formik.values.category}
              onChange={(_, newValue) => formik.setFieldValue("category", newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  error={formik.touched.category && Boolean(formik.errors.category)}
                  helperText={formik.touched.category && (formik.errors.category as string)}
                />
              )}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Grid>

          {/* Description */}
          <Grid size={12}>
            <TextField
              label="Description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && (formik.errors.description as string)}
              multiline
              rows={4}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Grid>

          {/* Tags */}
          <Grid size={12}>
            <Stack spacing={1}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  label="Add Tags (press Enter or comma)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  fullWidth
                  placeholder="e.g. fundraising, patent, guide"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddTag}
                  sx={{
                    borderRadius: "12px",
                    borderColor: COLORS.PRIMARY_NAVY,
                    color: COLORS.PRIMARY_NAVY,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    "&:hover": {
                      bgcolor: "rgba(1, 90, 80, 0.05)",
                      borderColor: COLORS.PRIMARY_NAVY,
                    },
                  }}
                >
                  Add
                </Button>
              </Box>

              {/* Tag Chips */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, pt: 1 }}>
                {tags.length === 0 ? (
                  <Typography variant="caption" sx={{ ...FS, color: COLORS.TEXT_SECONDARY, fontStyle: "italic" }}>
                    No tags added yet.
                  </Typography>
                ) : (
                  tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
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
            </Stack>
          </Grid>

          {/* Actions */}
          <Grid size={12} sx={{ mt: 2 }}>
            <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
              <Button
                onClick={hideModal}
                variant="outlined"
                sx={{
                  borderRadius: "12px",
                  borderColor: "rgba(0,0,0,0.15)",
                  color: COLORS.TEXT_SECONDARY,
                  textTransform: "none",
                  ...FS,
                  px: 4,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                startIcon={resourceToEdit ? <Edit /> : <Add />}
                sx={{
                  background: `linear-gradient(135deg, ${COLORS.PRIMARY_NAVY} 0%, #1A293D 100%)`,
                  borderRadius: "12px",
                  textTransform: "none",
                  ...FS,
                  px: 4,
                  fontWeight: 600,
                  boxShadow: "0 6px 15px 0 rgba(11, 23, 39, 0.15)",
                }}
              >
                {submitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : resourceToEdit ? (
                  "Update Resource"
                ) : (
                  "Add Resource"
                )}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddResource;
