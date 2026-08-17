import { Autocomplete, Box, InputBase, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";
import { ROLES } from "@/utils/constant";

interface BatchesSearchProps {
  value: string;
  onChange: (value: string) => void;
  onRoleSelection: (newValue: string) => void;
}

const BatchesSearch = ({
  value,
  onChange,
  onRoleSelection,
}: BatchesSearchProps) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    }}
  >
    <Autocomplete
      sx={{ width: "35%" }}
      renderInput={(params) => (
        <TextField {...params} placeholder="Filter By Role" />
      )}
      options={ROLES}
      onChange={(_event, newValue) => {
        onRoleSelection(newValue?.value || "");
      }}
    />
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        width: "65%",
        border: "1px solid #d7d7d7",
        p: 1.5,
        borderRadius: 1,
        // height: 40,
      }}
    >
      <Search sx={{ color: COLORS.TEXT_SECONDARY, mr: 1, fontSize: 20 }} />
      <InputBase
        placeholder="Search by batch title, attendees, or categories..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          fontFamily: poppins.style.fontFamily,
          fontSize: "0.9rem",
          width: "100%",
        }}
      />
    </Box>
  </Box>
);

export default BatchesSearch;
