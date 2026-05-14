"use client";
import { useCountries } from "@/hooks/country/getCountries";
import AddPlan from "@/modals/AddPlan";
import { useModal } from "@/store/useModal";
import { CURRENCIES, PLAN_TABLE_HEADER } from "@/utils/constant";
import { COLORS, STATUS } from "@/utils/enum";
import { poppins, roboto } from "@/utils/fonts";
import { Add, MoreVert } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Select,
  MenuItem,
  TablePagination,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { usePlansList } from "@/hooks/common/usePlans";
import { PLAN_DATA_PROPS } from "@/utils/type";

const FS = { fontFamily: poppins.style.fontFamily };

const PlansManagement = () => {
  // const {
  //   plans,
  //   loading,
  //   pagination,
  //   deletePlan,
  //   fetchPlans,
  //   goToPage,
  //   updatePlan,
  // } = usePlans();

  const [search, setSearch] = useState("");

  const { countryData } = useCountries({
    page: 1,
    limit: 100,
    search: "",
    status: true,
  });
  console.log("countryData", countryData);

  const { showModal } = useModal();

  const handleCreate = () => {
    showModal(<AddPlan />);
  };

  const { planList, planLoading, updatePlan, fetchPlans } = usePlansList();
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  console.log("planList", planList);

  return (
    <Box>
      <Card sx={{ p: 2, borderRadius: "10px" }}>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: roboto.style.fontFamily,
                fontWeight: 500,
                color: COLORS.BLACK,
              }}
            >
              Membership Plans
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
            sx={{
              background: `linear-gradient(135deg, ${COLORS.PRIMARY_NAVY} 0%, #1A293D 100%)`,
              borderRadius: "14px",
              textTransform: "none",
              ...FS,
              p: 1.5,
              fontWeight: 600,
              boxShadow: "0 8px 20px 0 rgba(11, 23, 39, 0.25)",
              transition: "all 0.3s",
              "&:hover": {
                boxShadow: "0 10px 24px 0 rgba(11, 23, 39, 0.35)",
                transform: "translateY(-2px)",
              },
              width: 150,
            }}
          >
            Create Plan
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid size={4}>
            <Autocomplete
              renderInput={(params) => (
                <TextField {...params} label="Select Country" />
              )}
              options={countryData}
              getOptionLabel={(option: any) => option.name}
            />
          </Grid>
          <Grid size={8}>
            <TextField label="Search" fullWidth />
          </Grid>
        </Grid>
        <TableContainer sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                {PLAN_TABLE_HEADER.map((val, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      fontWeight: 550,
                      fontFamily: roboto.style.fontFamily,
                      textTransform: "capitalize",
                    }}
                  >
                    {" "}
                    {val}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {planLoading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    <CircularProgress
                      sx={{ fontSize: 20, color: COLORS.PRIMARY_NAVY }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {planList?.data?.map((val, i: number) => (
                  <TableRow key={val.id}>
                    <TableCell>{val.id}</TableCell>
                    <TableCell>{val.name}</TableCell>
                    <TableCell>
                      {
                        CURRENCIES.find((item) => item?.code === val.currency)
                          ?.symbol
                      }
                      {val.price}
                    </TableCell>
                    <TableCell>{val.billingCycle}</TableCell>
                    <TableCell>{val.target}</TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={val.isActive ? "ACTIVE" : "INACTIVE"}
                        disabled={updatingId === val.id}
                        onChange={async (e) => {
                          const newStatus = e.target.value === "ACTIVE";
                          setUpdatingId(val.id);
                          const success = await updatePlan(val.id, {
                            isActive: newStatus,
                          });
                          if (success) {
                            await fetchPlans(
                              planList?.pagination?.page,
                              planList?.pagination?.limit,
                            );
                          }
                          setUpdatingId(null);
                        }}
                        sx={{
                          height: 32,
                          fontSize: 14,
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          bgcolor: val.isActive
                            ? "rgba(76, 175, 80, 0.1)"
                            : "rgba(244, 67, 54, 0.1)",
                          color: val.isActive ? COLORS.SUCCESS : COLORS.ERROR,
                          fontWeight: 600,
                          borderRadius: "8px",
                        }}
                      >
                        <MenuItem
                          value="ACTIVE"
                          sx={{ fontSize: 14, fontWeight: 500 }}
                        >
                          Active
                        </MenuItem>
                        <MenuItem
                          value="INACTIVE"
                          sx={{ fontSize: 14, fontWeight: 500 }}
                        >
                          Inactive
                        </MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <IconButton>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
          <TablePagination
            component="div"
            count={planList?.pagination?.total ?? 0}
            page={(planList?.pagination?.page ?? 1) - 1}
            rowsPerPage={planList?.pagination?.limit ?? 10}
            onPageChange={(_, newPage) => {
              fetchPlans(newPage + 1, planList?.pagination?.limit);
            }}
            onRowsPerPageChange={(event) => {
              fetchPlans(1, parseInt(event.target.value, 10));
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>
      </Card>
    </Box>
  );
};

export default PlansManagement;
