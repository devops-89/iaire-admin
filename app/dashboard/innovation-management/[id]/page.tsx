import React from "react";
import InnovationDetails from "@/components/layouts/dashboard/innovation/Innovation-details";
import { Box } from "@mui/material";

export default async function InnovationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <Box>
      <InnovationDetails id={resolvedParams.id} />
    </Box>
  );
}
