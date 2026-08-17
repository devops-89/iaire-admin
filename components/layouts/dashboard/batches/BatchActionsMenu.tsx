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
          borderRadius: "16px",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
          border: "1px solid rgba(0,0,0,0.05)",
          mt: 1,
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
        fontSize: 14,
        fontWeight: 600,
        py: 1.5,
        color: COLORS.BLACK,
        display: "flex",
        gap: 1.5,
        "&:hover": { bgcolor: "rgba(11, 23, 39, 0.04)" },
      }}
    >
      <Visibility sx={{ fontSize: 20, color: COLORS.TEXT_SECONDARY }} />
      View Details
    </MenuItem>
  </Menu>
);

export default BatchActionsMenu;
