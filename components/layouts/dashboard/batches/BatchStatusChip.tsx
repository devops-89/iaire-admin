import { Chip } from "@mui/material";
import { alpha } from "@mui/material";
import { poppins } from "@/utils/fonts";
import { BATCH_STATUS, COLORS } from "@/utils/enum";

const FS = { fontFamily: poppins.style.fontFamily };

const AMBER = "#F59E0B";

const statusConfig: Record<
  string,
  { bgcolor: string; color: string; border: string }
> = {
  [BATCH_STATUS.ONGOING]: {
    bgcolor: alpha(COLORS.SUCCESS, 0.1),
    color: COLORS.SUCCESS,
    border: `1px solid ${COLORS.SUCCESS}`,
  },
  [BATCH_STATUS.UPCOMING]: {
    bgcolor: alpha(AMBER, 0.1),
    color: AMBER,
    border: `1px solid ${AMBER}`,
  },
  [BATCH_STATUS.COMPLETED]: {
    bgcolor: alpha(COLORS.ERROR, 0.1),
    color: COLORS.ERROR,
    border: `1px solid ${COLORS.ERROR}`,
  },
};

interface BatchStatusChipProps {
  status?: string;
}

const BatchStatusChip = ({ status }: BatchStatusChipProps) => {
  const resolved = status ?? BATCH_STATUS.UPCOMING;
  const config = statusConfig[resolved] ?? statusConfig[BATCH_STATUS.COMPLETED];

  return (
    <Chip
      label={resolved}
      size="small"
      sx={{
        ...FS,
        fontWeight: 700,
        fontSize: 10,
        height: 24,
        borderRadius: "6px",
        ...config,
      }}
    />
  );
};

export default BatchStatusChip;
