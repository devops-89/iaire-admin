"use client";
import { roboto } from "@/utils/fonts";
import { Autocomplete, Card, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import { RESEARCH_STATUS } from "@/utils/enum";

const ResearchManagement = () => {
  const statusOptions = Object.values(RESEARCH_STATUS).map((status) => ({
    label: status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase()),
    value: status,
  }));

  return (
    <div>
      <Card sx={{ p: 2 }}>
        <Typography
          sx={{
            fontSize: 25,
            fontFamily: roboto.style.fontFamily,
            fontWeight: 600,
          }}
        >
          Research Management
        </Typography>
        <Grid container>
          <Grid size={4}>
            <Autocomplete
              options={statusOptions}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Status" />
              )}
            />
          </Grid>
          <Grid size={8}></Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default ResearchManagement;
