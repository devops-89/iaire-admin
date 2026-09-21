import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { COLORS } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import React from "react";
import { useModal } from "@/store/useModal";

interface onDelteProps {
  onDelete: () => void;
  loading?: boolean;
}

const DeleteSupportTickets = ({ onDelete, loading }: onDelteProps) => {
  const { hideModal } = useModal();
  return (
    <div>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            // width: "400px",
            // height: "200px",
            bgcolor: "white",
            borderRadius: "12px",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
            p: "20px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: poppins.style.fontFamily,
              fontWeight: 600,
              color: COLORS.PRIMARY_NAVY,
              textAlign: "center",
            }}
          >
            Do you want to delete this Support Ticket ?
          </Typography>

          <Stack
            direction={"row"}
            spacing={4}
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Button
              sx={{
                fontFamily: poppins.style.fontFamily,
                fontWeight: 500,
                color: COLORS.PRIMARY_NAVY,
                border: "1px solid #d7d7d7",
                borderRadius: "100px",
                px: "20px",
                py: "6px",
                backgroundColor: "#d7d7d730",
              }}
              onClick={hideModal}
            >
              Cancel
            </Button>
            <Button
              sx={{
                fontFamily: poppins.style.fontFamily,
                fontWeight: 500,
                color: "#ff0000",
                backgroundColor: "#ff000030",
                border: "1px solid #ff000030",
                borderRadius: "100px",
                px: "20px",
                py: "6px",
              }}
              onClick={onDelete}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: COLORS.WHITE }} />
              ) : (
                "Delete"
              )}
            </Button>
          </Stack>
        </Box>
      </Box>
    </div>
  );
};

export default DeleteSupportTickets;
