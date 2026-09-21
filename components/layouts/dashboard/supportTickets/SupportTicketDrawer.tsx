import React from "react";
import { Box, Drawer, Typography, IconButton, Divider, Chip } from "@mui/material";
import { Close } from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS, PRIORITY } from "@/utils/enum";
import { NEED_ASSISTANCE_RESPONSE } from "@/utils/type";
import moment from "moment";

interface SupportTicketDrawerProps {
  open: boolean;
  onClose: () => void;
  ticket: NEED_ASSISTANCE_RESPONSE | null;
}

const SupportTicketDrawer = ({ open, onClose, ticket }: SupportTicketDrawerProps) => {
  if (!ticket) return null;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography
            sx={{
              fontFamily: poppins.style.fontFamily,
              fontSize: 18,
              fontWeight: 600,
              color: COLORS.PRIMARY_NAVY,
            }}
          >
            Ticket Details
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: 12, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>
            Ticket ID
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            TKT - {ticket.id}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: 12, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>
            Subject
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            {ticket.subject}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: 12, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>
            Description
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            {ticket.description}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
          <Box>
            <Typography sx={{ fontSize: 12, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>
              Category
            </Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
              {ticket.category.replace("_", " ")}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>
              Priority
            </Typography>
            <Chip
              label={ticket.priority}
              size="small"
              sx={{
                backgroundColor:
                  ticket.priority === PRIORITY.HIGH
                    ? "#00800030"
                    : ticket.priority === PRIORITY.MEDIUM
                      ? "#FFA50030"
                      : "#EB575730",
                color:
                  ticket.priority === PRIORITY.HIGH
                    ? "#008000"
                    : ticket.priority === PRIORITY.MEDIUM
                      ? "#FFA500"
                      : "#EB5757",
              }}
            />
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: 12, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>
            Created By
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            {ticket.addedByUser.fullName || ticket.addedByUser.firstName + " " + ticket.addedByUser.lastName}
          </Typography>
          <Typography sx={{ fontSize: 12, color: COLORS.TEXT_SECONDARY }}>
            {ticket.addedByUser.email}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: 12, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>
            Created At
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            {moment(ticket.createdAt).format("MMM Do, YYYY hh:mm A")}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: 12, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>
            Status
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 500, textTransform: "capitalize" }}>
            {ticket.status.toLowerCase().replace("_", " ")}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SupportTicketDrawer;
