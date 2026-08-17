import { Box, Button, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";

const FS = { fontFamily: poppins.style.fontFamily };

interface BatchesHeaderProps {
  onCreateBatch: () => void;
}

const BatchesHeader = ({ onCreateBatch }: BatchesHeaderProps) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      justifyContent: "space-between",
      alignItems: { xs: "flex-start", sm: "center" },
      gap: 2,
    }}
  >
    <Typography
      variant="h4"
      sx={{
        fontFamily: poppins.style.fontFamily,
        fontWeight: 800,
        color: COLORS.TEXT_PRIMARY,
        letterSpacing: -0.5,
      }}
    >
      Batch Management
    </Typography>

    <Button
      variant="contained"
      startIcon={<Add />}
      onClick={onCreateBatch}
      sx={{
        background: `linear-gradient(135deg, ${COLORS.PRIMARY_NAVY} 0%, #1A293D 100%)`,
        borderRadius: "14px",
        textTransform: "none",
        ...FS,
        px: 3,
        py: 1.5,
        fontWeight: 600,
        boxShadow: "0 8px 20px 0 rgba(11, 23, 39, 0.15)",
        transition: "all 0.3s",
        "&:hover": {
          boxShadow: "0 10px 24px 0 rgba(11, 23, 39, 0.25)",
          transform: "translateY(-2px)",
        },
      }}
    >
      Create Batch
    </Button>
  </Box>
);

export default BatchesHeader;
