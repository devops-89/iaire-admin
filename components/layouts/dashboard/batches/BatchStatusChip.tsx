import { Chip } from "@mui/material";
import { poppins } from "@/utils/fonts";
import { BATCH_STATUS, COLORS } from "@/utils/enum";

const FS = { fontFamily: poppins.style.fontFamily };

const statusConfig: Record<
  string,
  { bgcolor: string; color: string; border: string }
> = {
  [BATCH_STATUS.ONGOING]: {
    bgcolor: COLORS.STATUS_SUCCESS_BG,
    color: COLORS.STATUS_SUCCESS_TEXT,
    border: `1px solid ${COLORS.STATUS_SUCCESS_BORDER}`,
  },
  [BATCH_STATUS.UPCOMING]: {
    bgcolor: COLORS.STATUS_WARNING_BG,
    color: COLORS.STATUS_WARNING_TEXT,
    border: `1px solid ${COLORS.STATUS_WARNING_BORDER}`,
  },
  [BATCH_STATUS.COMPLETED]: {
    bgcolor: COLORS.STATUS_ERROR_BG,
    color: COLORS.STATUS_ERROR_TEXT,
    border: `1px solid ${COLORS.STATUS_ERROR_BORDER}`,
  },
};

interface BatchStatusChipProps {
  status?: string;
}

const BatchStatusChip = ({ status }: BatchStatusChipProps) => {
  const resolved = status ?? BATCH_STATUS.UPCOMING;
  const config =
    statusConfig[resolved] ?? {
      bgcolor: COLORS.INPUT_BG,
      color: COLORS.TEXT_SECONDARY,
      border: `1px solid ${COLORS.BORDER_GRAY}`,
    };

  return (
    <Chip
      label={resolved}
      size="small"
      sx={{
        ...FS,
        fontWeight: 600,
        fontSize: "12px",
        height: 24,
        borderRadius: "6px",
        ...config,
        "& .MuiChip-label": {
          px: 1,
        },
      }}
    />
  );
};

export default BatchStatusChip;
