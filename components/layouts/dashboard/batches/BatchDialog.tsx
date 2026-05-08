import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Add, Edit } from "@mui/icons-material";
import { CATEGORY, USER_ROLES, COLORS } from "@/utils/enum";
import SubjectiveQuestions from "./sections/SubjectiveQuestions";
import ObjectiveQuestions from "./sections/ObjectiveQuestions";
import dayjs from "dayjs";

interface BatchDialogProps {
  open: boolean;
  onClose: () => void;
  formik: any;
  selectedBatch: any;
  creating: boolean;
  updating: boolean;
  fontStyle: any;
  poppinsFont: any;
}

const BatchDialog: React.FC<BatchDialogProps> = ({
  open,
  onClose,
  formik,
  selectedBatch,
  creating,
  updating,
  fontStyle,
  poppinsFont,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: "20px", p: 1 } },
      }}
    >
      <DialogTitle sx={{ ...fontStyle, fontWeight: 700, fontSize: 20, pb: 1 }}>
        {selectedBatch ? "Edit Batch" : "Create New Batch"}
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 2 }}>
          <TextField
            label="Batch Name"
            name="name"
            fullWidth
            placeholder="e.g. Summer Research 2024"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", fontFamily: poppinsFont.style.fontFamily } }}
          />

          <TextField
            select
            label="Category"
            name="category"
            fullWidth
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.category && Boolean(formik.errors.category)}
            helperText={formik.touched.category && formik.errors.category}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", fontFamily: poppinsFont.style.fontFamily } }}
          >
            {Object.values(CATEGORY).map((option) => (
              <MenuItem key={option} value={option} sx={fontStyle}>
                {option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="User Role"
            name="userRole"
            fullWidth
            value={formik.values.userRole}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.userRole && Boolean(formik.errors.userRole)}
            helperText={formik.touched.userRole && formik.errors.userRole}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", fontFamily: poppinsFont.style.fontFamily } }}
          >
            {Object.values(USER_ROLES).map((option) => (
              <MenuItem key={option} value={option} sx={fontStyle}>
                {option.replace("_", " ").charAt(0).toUpperCase() + option.replace("_", " ").slice(1).toLowerCase()}
              </MenuItem>
            ))}
          </TextField>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <DatePicker
                label="Start Date"
                value={formik.values.startDate ? dayjs(formik.values.startDate) : null}
                onChange={(val) => formik.setFieldValue("startDate", val)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.startDate && Boolean(formik.errors.startDate),
                    helperText: formik.touched.startDate && (formik.errors.startDate as string),
                    sx: { "& .MuiOutlinedInput-root": { borderRadius: "12px", fontFamily: poppinsFont.style.fontFamily } }
                  }
                }}
              />
              <DatePicker
                label="End Date"
                value={formik.values.endDate ? dayjs(formik.values.endDate) : null}
                onChange={(val) => formik.setFieldValue("endDate", val)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.endDate && Boolean(formik.errors.endDate),
                    helperText: formik.touched.endDate && (formik.errors.endDate as string),
                    sx: { "& .MuiOutlinedInput-root": { borderRadius: "12px", fontFamily: poppinsFont.style.fontFamily } }
                  }
                }}
              />
            </Box>
          </LocalizationProvider>

          <Divider sx={{ my: 2 }} />
          <SubjectiveQuestions formik={formik} fontStyle={fontStyle} />
          <Divider sx={{ my: 2 }} />
          <ObjectiveQuestions formik={formik} fontStyle={fontStyle} />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={onClose}
            sx={{ ...fontStyle, textTransform: "none", color: COLORS.TEXT_SECONDARY, borderRadius: "10px" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={creating || updating}
            startIcon={(creating || updating) ? <CircularProgress size={16} color="inherit" /> : (selectedBatch ? <Edit /> : <Add />)}
            sx={{
              ...fontStyle,
              textTransform: "none",
              backgroundColor: COLORS.PRIMARY_NAVY,
              borderRadius: "10px",
              px: 3,
              "&:hover": { backgroundColor: COLORS.SECONDARY_NAVY },
            }}
          >
            {creating || updating ? (selectedBatch ? "Updating..." : "Creating...") : (selectedBatch ? "Save Changes" : "Create Batch")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BatchDialog;
