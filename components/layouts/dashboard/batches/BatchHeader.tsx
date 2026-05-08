import React from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { Refresh, Add } from "@mui/icons-material";
import { COLORS } from "@/utils/enum";

interface BatchHeaderProps {
  onRefresh: () => void;
  onCreate: () => void;
  fontStyle: any;
}

const BatchHeader: React.FC<BatchHeaderProps> = ({ onRefresh, onCreate, fontStyle }) => {
  return (
    <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
      <Box>
        <Typography variant="h4" sx={{ ...fontStyle, fontWeight: 700, color: COLORS.BLACK }}>
          Batch Management
        </Typography>
        <Typography variant="body1" sx={{ ...fontStyle, color: COLORS.TEXT_SECONDARY, mt: 0.5 }}>
          Manage training batches, schedules and categories.
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <IconButton
          onClick={onRefresh}
          sx={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: "12px" }}
        >
          <Refresh />
        </IconButton>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onCreate}
          sx={{
            backgroundColor: COLORS.PRIMARY_NAVY,
            borderRadius: "10px",
            textTransform: "none",
            ...fontStyle,
            px: 3,
            "&:hover": { backgroundColor: COLORS.SECONDARY_NAVY },
          }}
        >
          Create Batch
        </Button>
      </Box>
    </Box>
  );
};

export default BatchHeader;
