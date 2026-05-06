"use client";

import dynamic from "next/dynamic";
import { Box, CircularProgress } from "@mui/material";
import { COLORS } from "@/utils/enum";

const Interviews = dynamic(() => import("@/components/layouts/dashboard/Interviews"), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <CircularProgress sx={{ color: COLORS.PRIMARY_NAVY }} />
    </Box>
  ),
});

export default function InterviewsPage() {
  return <Interviews />;
}
