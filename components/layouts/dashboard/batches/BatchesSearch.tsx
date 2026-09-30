import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { Search, Close, FilterList } from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { CATEGORY, COLORS } from "@/utils/enum";
import { ROLES } from "@/utils/constant";

const FS = { fontFamily: poppins.style.fontFamily };

interface BatchesSearchProps {
  value: string;
  onChange: (value: string) => void;
  categoryValue: string;
  onCategoryChange: (value: string) => void;
  roleValue: string;
  onRoleChange: (value: string) => void;
}

const BatchesSearch = ({
  value,
  onChange,
  categoryValue,
  onCategoryChange,
  roleValue,
  onRoleChange,
}: BatchesSearchProps) => (
  <Box
    sx={{
      p: 2,
      bgcolor: COLORS.WHITE,
      borderRadius: "14px",
      border: `1px solid ${COLORS.BORDER_GRAY}`,
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      alignItems: { xs: "stretch", md: "center" },
      justifyContent: "space-between",
      gap: 2,
    }}
  >
    {/* Search Field on one side */}
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by batch title, attendees, or categories..."
      size="small"
      fullWidth
      sx={{
        flex: { xs: "1 1 100%", md: "1 1 auto" },
        maxWidth: { md: "460px" },
        "& .MuiOutlinedInput-root": {
          borderRadius: "10px",
          fontFamily: poppins.style.fontFamily,
          fontSize: "13.5px",
          bgcolor: COLORS.BG_LIGHT,
          "& fieldset": { borderColor: COLORS.BORDER_GRAY },
          "&:hover fieldset": { borderColor: COLORS.PRIMARY_NAVY },
          "&.Mui-focused fieldset": { borderColor: COLORS.PRIMARY_NAVY },
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 20 }} />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => onChange("")} edge="end">
                <Close sx={{ fontSize: 16 }} />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />

    {/* Filter Dropdowns on the other side */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        flexWrap: "wrap",
        width: { xs: "100%", md: "auto" },
      }}
    >
      {/* Category Dropdown */}
      <FormControl
        size="small"
        sx={{
          minWidth: { xs: "100%", sm: "180px" },
        }}
      >
        <Select
          value={categoryValue}
          onChange={(e) => onCategoryChange(e.target.value as string)}
          displayEmpty
          startAdornment={
            <InputAdornment position="start">
              <FilterList sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 18 }} />
            </InputAdornment>
          }
          sx={{
            borderRadius: "10px",
            fontFamily: poppins.style.fontFamily,
            fontSize: "13.5px",
            bgcolor: COLORS.BG_LIGHT,
            "& fieldset": { borderColor: COLORS.BORDER_GRAY },
            "&:hover fieldset": { borderColor: COLORS.PRIMARY_NAVY },
            "&.Mui-focused fieldset": { borderColor: COLORS.PRIMARY_NAVY },
          }}
        >
          <MenuItem value="ALL" sx={{ ...FS, fontSize: "13px" }}>
            All Categories
          </MenuItem>
          <MenuItem value={CATEGORY.RESEARCH} sx={{ ...FS, fontSize: "13px" }}>
            Research
          </MenuItem>
          <MenuItem value={CATEGORY.INNOVATION} sx={{ ...FS, fontSize: "13px" }}>
            Innovation
          </MenuItem>
          <MenuItem
            value={CATEGORY.ENTREPRENEURSHIP}
            sx={{ ...FS, fontSize: "13px" }}
          >
            Entrepreneurship
          </MenuItem>
        </Select>
      </FormControl>

      {/* Role Dropdown */}
      <FormControl
        size="small"
        sx={{
          minWidth: { xs: "100%", sm: "170px" },
        }}
      >
        <Select
          value={roleValue}
          onChange={(e) => onRoleChange(e.target.value as string)}
          displayEmpty
          startAdornment={
            <InputAdornment position="start">
              <FilterList sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 18 }} />
            </InputAdornment>
          }
          sx={{
            borderRadius: "10px",
            fontFamily: poppins.style.fontFamily,
            fontSize: "13.5px",
            bgcolor: COLORS.BG_LIGHT,
            "& fieldset": { borderColor: COLORS.BORDER_GRAY },
            "&:hover fieldset": { borderColor: COLORS.PRIMARY_NAVY },
            "&.Mui-focused fieldset": { borderColor: COLORS.PRIMARY_NAVY },
          }}
        >
          <MenuItem value="" sx={{ ...FS, fontSize: "13px" }}>
            All Roles
          </MenuItem>
          {ROLES.map((r) => (
            <MenuItem
              key={r.value}
              value={r.value}
              sx={{ ...FS, fontSize: "13px" }}
            >
              {r.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  </Box>
);

export default BatchesSearch;
