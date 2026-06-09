import { useCreatePlans } from "@/hooks/common/usePlans";
import { useCountries } from "@/hooks/country/getCountries";
import { useModal } from "@/store/useModal";
import {
  BILLING_CYCLE_DATA,
  CURRENCIES,
  INDIVIDUAL_PLANS_DATA,
  INSTITUTIONAL_PLANS_DATA,
  MENTOR_PLANS_DATA,
  ROLES,
} from "@/utils/constant";
import { BILLING_CYCLE, COLORS, PLAN_TARGET, USER_ROLES } from "@/utils/enum";
import { poppins, roboto } from "@/utils/fonts";
import { COUNTRYDATAPROPS, CREATE_PLAN_REQUEST } from "@/utils/type";
import { planValidationSchema } from "@/utils/validation";
import { Add, Delete } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";

interface AddPlanProps {
  selectedPlan?: any;
  onSuccess?: () => void;
}

interface PlanFormValues {
  name: string;
  role: string;
  country: COUNTRYDATAPROPS | null;
  price: string;
  currency: string;
  billingCycle: string;
  benefits: { key: string; value: string; hasLimit?: boolean }[];
}

const AddPlan: React.FC<AddPlanProps> = ({ selectedPlan, onSuccess }) => {
  const { hideModal } = useModal();
  const { createPlan, loading } = useCreatePlans(onSuccess);

  const countryParams = {
    status: true,
    limit: 100,
    page: 1,
    search: "",
  };

  const formik = useFormik<PlanFormValues>({
    initialValues: {
      name: "",
      role: "",
      country: null,
      price: "",
      currency: "",
      billingCycle: "",
      benefits: [{ key: "", value: "0", hasLimit: false }],
    },
    validationSchema: planValidationSchema,
    onSubmit: (values) => {
      const payload = {
        name: values?.name,
        target:
          values?.role === USER_ROLES.SCHOOL_ADMIN || values?.role === USER_ROLES.INSTITUTION || values?.role === USER_ROLES.SCHOOL
            ? "SCHOOL"
            : values?.role === USER_ROLES.MENTOR || values?.role === USER_ROLES.TEACHER
              ? "TEACHER"
              : values?.role,
        countryId: values?.country?.id,
        billingCycle: values?.billingCycle,
        price: values?.price,
        currency: values?.country?.currencyCode,
        limits: values?.benefits.map((b) => ({
          key: b.key.trim().toUpperCase().replace(/\s+/g, "_").replace(/TEACHER/g, "TECHER"),
          value: b.hasLimit ? b.value : "0",
        })),
        isActive: true,
      };
      createPlan(payload as unknown as CREATE_PLAN_REQUEST);
    },
  });
  const addBenefit = () => {
    formik.setFieldValue("benefits", [
      ...formik.values.benefits,
      { key: "", value: "0", hasLimit: false },
    ]);
  };
  const removeBenefit = (index: number) => {
    const newBenefits = [...formik.values.benefits];
    newBenefits.splice(index, 1);
    formik.setFieldValue("benefits", newBenefits);
  };
  const { countryData } = useCountries(countryParams);

  const [country, setCountry] = useState<COUNTRYDATAPROPS>();

  const [role, setRole] = useState<{ label: string; value: string } | null>(
    null,
  );

  const countryChangeHandler = (
    event: React.SyntheticEvent,
    value: COUNTRYDATAPROPS | null,
  ) => {
    setCountry(value || undefined);

    formik.setFieldValue("country", value as COUNTRYDATAPROPS);
  };

  const [existingBenefits, setExistingBenefits] = useState([
    {
      label: "",
      value: "",
    },
  ]);

  const handleRoleChangeHandler = (
    e: React.SyntheticEvent,
    newValue: { label: string; value: string } | null,
  ) => {
    setRole(newValue);
    if (newValue?.value === USER_ROLES.SCHOOL_ADMIN) {
      setExistingBenefits(INSTITUTIONAL_PLANS_DATA);
    } else if (newValue?.value === USER_ROLES.TEACHER) {
      setExistingBenefits(MENTOR_PLANS_DATA);
    } else if (newValue?.value === USER_ROLES.STUDENT) {
      setExistingBenefits(INDIVIDUAL_PLANS_DATA);
    } else {
      setExistingBenefits([]);
    }

    if (newValue?.value) {
      formik.setFieldValue("role", newValue.value);
    } else {
      formik.setFieldValue("role", "");
    }
  };

  const [billingCycle, setBillingCycle] = useState(null);

  const billingCycleChangeHandler = (
    e: React.SyntheticEvent,
    newValue: any,
  ) => {
    setBillingCycle(newValue);

    if (newValue?.label) {
      formik.setFieldValue("billingCycle", newValue.label);
    }
  };

  return (
    <Box>
      <Typography
        sx={{
          fontFamily: roboto.style.fontFamily,
          color: COLORS.PRIMARY_NAVY,
          fontWeight: 600,
          fontSize: 30,
        }}
      >
        {" "}
        Create Plan
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={12}>
            <TextField
              label="Plan Name"
              fullWidth
              id="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && !!formik.errors.name}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid size={12}>
            <Autocomplete
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Role"
                  error={formik.touched.role && !!formik.errors.role}
                  helperText={formik.touched.role && formik.errors.role}
                />
              )}
              options={ROLES}
              onChange={handleRoleChangeHandler}
              getOptionLabel={(option) => option.label}
              value={role}
            />
          </Grid>
          <Grid size={6}>
            <Autocomplete
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Country"
                  error={formik.touched.country && !!formik.errors.country}
                  helperText={formik.touched.country && formik.errors.country}
                />
              )}
              options={countryData}
              getOptionLabel={(option: COUNTRYDATAPROPS) => option.name}
              renderOption={(props, option: COUNTRYDATAPROPS) => (
                <Box component={"li"} {...props}>
                  <Typography>{option.name}</Typography>
                </Box>
              )}
              onChange={countryChangeHandler}
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
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography>
                        {
                          CURRENCIES.find(
                            (item: any) => item.code === country?.currencyCode,
                          )?.symbol
                        }
                      </Typography>
                    </InputAdornment>
                  ),
                },
              }}
              error={formik.touched.price && !!formik.errors.price}
              helperText={formik.touched.price && formik.errors.price}
              id="price"
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={12}>
            <Autocomplete
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Billing Cycle"
                  error={
                    formik.touched.billingCycle && !!formik.errors.billingCycle
                  }
                  helperText={
                    formik.touched.billingCycle && formik.errors.billingCycle
                  }
                />
              )}
              options={BILLING_CYCLE_DATA}
              getOptionLabel={(option) => option.label}
              onChange={billingCycleChangeHandler}
            />
          </Grid>
          <Grid size={12} sx={{ textAlign: "right" }}>
            <Button startIcon={<Add />} onClick={addBenefit}>
              Add Benefits
            </Button>
          </Grid>
        </Grid>
        {formik.values.benefits.map((val, i) => (
          <Grid
            container
            spacing={3}
            sx={{ mt: 3, alignItems: "flex-start" }}
            key={i}
          >
            <Grid size={val.hasLimit ? 5 : 8}>
              <TextField
                label="Benefit Point / Name"
                fullWidth
                name={`benefits[${i}].key`}
                value={val.key}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.benefits?.[i]?.key &&
                  !!(formik.errors.benefits as any)?.[i]?.key
                }
                helperText={
                  formik.touched.benefits?.[i]?.key &&
                  (formik.errors.benefits as any)?.[i]?.key
                }
              />
            </Grid>
            <Grid size={3} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!val.hasLimit}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      formik.setFieldValue(`benefits[${i}].hasLimit`, checked);
                      if (checked) {
                        formik.setFieldValue(`benefits[${i}].value`, "");
                      } else {
                        formik.setFieldValue(`benefits[${i}].value`, "0");
                      }
                    }}
                  />
                }
                label="Add Limit"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontFamily: poppins.style.fontFamily,
                    fontSize: 13,
                    color: COLORS.TEXT_PRIMARY,
                  },
                }}
              />
            </Grid>
            {val.hasLimit && (
              <Grid size={3}>
                <TextField
                  label="Enter Limit"
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
                  name={`benefits[${i}].value`}
                  value={val.value}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.benefits?.[i]?.value &&
                    !!(formik.errors.benefits as any)?.[i]?.value
                  }
                  helperText={
                    formik.touched.benefits?.[i]?.value &&
                    (formik.errors.benefits as any)?.[i]?.value
                  }
                />
              </Grid>
            )}
            <Grid size={1} sx={{ display: "flex", justifyContent: "center" }}>
              <IconButton
                onClick={() => removeBenefit(i)}
                color="error"
                size="small"
                disabled={formik.values.benefits.length === 1}
                sx={{ mt: 1.5 }}
              >
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button
          sx={{
            mt: 2,
            fontFamily: roboto.style.fontFamily,
            fontSize: 15,
            fontWeight: 600,
            backgroundColor: COLORS.PRIMARY_NAVY,
            color: "#fff",
            // width: "100%",
            borderRadius: 2,
            p: 1,
            textTransform: "none",
            width: 150,
          }}
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress sx={{ fontSize: 15, color: COLORS.WHITE }} />
          ) : (
            "Add Plan"
          )}
        </Button>
      </form>
    </Box>
  );
};

export default AddPlan;
