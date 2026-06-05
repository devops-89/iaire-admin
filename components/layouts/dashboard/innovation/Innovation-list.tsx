"use client";
import { useInnovations } from "@/hooks/common/useInnovations";
import React, { useEffect } from "react";
import { Box, Card, Tab, Tabs, Typography } from "@mui/material";
import { poppins } from "@/utils/fonts";
const InnovationList = () => {
  const { innovationData, loading, fetchData } = useInnovations();

  useEffect(() => {
    fetchData();
  }, []);

  console.log("innovationData", innovationData);

  return (
    <Box>
      <Card sx={{ p: 2, boxShadow: "0px 0px 2px 2px #eeeeee" }}>
        <Typography
          sx={{
            fontSize: 20,
            fontFamily: poppins.style.fontFamily,
            fontWeight: 600,
          }}
        >
          Innovation Management
        </Typography>

        <Tabs>
          <Tab />
        </Tabs>
      </Card>
    </Box>
  );
};

export default InnovationList;
