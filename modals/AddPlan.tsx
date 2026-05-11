import { usePlans } from "@/hooks/common/usePlans";
import { useModal } from "@/store/useModal";
import { CURRENCIES, ROLES } from "@/utils/constant";
import { BILLING_CYCLE, COLORS, PLAN_TARGET } from "@/utils/enum";
import { poppins, roboto } from "@/utils/fonts";
import { Autocomplete, Box, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Plan name is required"),
  code: Yup.string().required("Plan code is required"),
  target: Yup.string()
    .oneOf(Object.values(PLAN_TARGET))
    .required("Target is required"),
  price: Yup.number()
    .min(0, "Price cannot be negative")
    .required("Price is required"),
  currency: Yup.string()
    .min(3, "Currency must be at least 3 characters")
    .required("Currency is required"),
  billingCycle: Yup.string()
    .oneOf(Object.values(BILLING_CYCLE))
    .required("Billing cycle is required"),
  trialDays: Yup.number().min(0).required("Trial days is required"),
  isActive: Yup.boolean(),
});

const FS = { fontFamily: poppins.style.fontFamily };

interface AddPlanProps {
  selectedPlan?: any;
  onSuccess: () => void;
}

const customFieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    backgroundColor: "#F9FAFB",
    transition: "all 0.3s ease",
    "& fieldset": {
      border: "1px solid transparent",
      transition: "all 0.3s ease",
    },
    "&:hover fieldset": {
      border: "1px solid #E5E7EB",
    },
    "&.Mui-focused": {
      backgroundColor: "#FFFFFF",
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      "& fieldset": {
        border: `2px solid ${COLORS.PRIMARY_NAVY}`,
      },
    },
  },
  "& .MuiInputBase-input": {
    padding: "16px 14px",
    fontSize: "15px",
    fontFamily: poppins.style.fontFamily,
    fontWeight: 500,
  },
};

const AddPlan: React.FC<AddPlanProps> = ({ selectedPlan, onSuccess }) => {
  const { createPlan, updatePlan, creating, updating } = usePlans();
  const { hideModal } = useModal();

  return (
    <Box>
      <Typography
        sx={{
          fontFamily: roboto.style.fontFamily,
          color: COLORS.PRIMARY_NAVY,
          fontWeight: 600,
          fontSize: 20,
        }}
      >
        {" "}
        Add Plans
      </Typography>

      <form>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={12}>
            <TextField label="Plan Name" fullWidth />
          </Grid>
          <Grid size={12}>
            <Autocomplete
              renderInput={(params) => (
                <TextField {...params} label="Select Target" />
              )}
              options={ROLES}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Price"
              type="number"
              sx={{
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
              }}
              fullWidth
            />
          </Grid>
          <Grid size={6}>
            <Autocomplete
              renderInput={(params) => (
                <TextField {...params} label="Select Currency" />
              )}
              options={CURRENCIES}
            />
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddPlan;
