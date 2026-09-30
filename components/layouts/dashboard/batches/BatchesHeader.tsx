import { Box, Button, Chip, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS, TYPOGRAPHY } from "@/utils/enum";

const FS = { fontFamily: poppins.style.fontFamily };

interface BatchesHeaderProps {
  onCreateBatch: () => void;
  totalCount?: number;
}

const BatchesHeader = ({ onCreateBatch, totalCount }: BatchesHeaderProps) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      justifyContent: "space-between",
      alignItems: { xs: "flex-start", sm: "center" },
      gap: 1.5,
    }}
  >
    <Box>
      <Typography
        variant="h4"
        sx={{
          ...TYPOGRAPHY.PAGE_TITLE,
        }}
      >
        Batch Management
      </Typography>
    </Box>

    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      {totalCount !== undefined && (
        <Chip
          label={`${totalCount} Batches`}
          size="small"
          sx={{
            bgcolor: COLORS.WHITE,
            border: `1px solid ${COLORS.BORDER_GRAY}`,
            fontFamily: poppins.style.fontFamily,
            fontWeight: 600,
            color: COLORS.TEXT_PRIMARY,
            height: "32px",
            borderRadius: "8px",
            px: 0.5,
          }}
        />
      )}

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={onCreateBatch}
        sx={{
          bgcolor: COLORS.PRIMARY_NAVY,
          borderRadius: "8px",
          textTransform: "none",
          ...FS,
          px: 2.5,
          py: 1,
          fontSize: "13.5px",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            bgcolor: COLORS.SECONDARY_NAVY,
            boxShadow: "none",
          },
        }}
      >
        Create Batch
      </Button>
    </Box>
  </Box>
);

export default BatchesHeader;
