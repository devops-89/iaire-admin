import { Menu, MenuItem } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";

const FS = { fontFamily: poppins.style.fontFamily };

interface BatchActionsMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onViewDetails: () => void;
}

const BatchActionsMenu = ({
  anchorEl,
  onClose,
  onViewDetails,
}: BatchActionsMenuProps) => (
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={onClose}
    slotProps={{
      paper: {
        sx: {
          borderRadius: "10px",
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
          border: `1px solid ${COLORS.BORDER_GRAY}`,
          p: 0.75,
          minWidth: 180,
        },
      },
    }}
    transformOrigin={{ horizontal: "right", vertical: "top" }}
    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
  >
    <MenuItem
      onClick={onViewDetails}
      sx={{
        ...FS,
        fontSize: "13px",
        fontWeight: 500,
        py: 1,
        px: 1.5,
        borderRadius: "6px",
        color: COLORS.TEXT_PRIMARY,
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        "&:hover": { bgcolor: COLORS.HOVER_BG },
      }}
    >
      <Visibility sx={{ fontSize: 18, color: COLORS.TEXT_SECONDARY }} />
      View Details
    </MenuItem>
  </Menu>
);

export default BatchActionsMenu;
