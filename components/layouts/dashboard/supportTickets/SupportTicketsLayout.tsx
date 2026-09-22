"use client";
import { useDeleteSupportTickets } from "@/hooks/school/useDeleteSupportTickets";
import { useGetAllNeedAssistance } from "@/hooks/school/useNeedAssistance";
import { useUpdateTicketStatus } from "@/hooks/school/useUpdateTicketStatus";
import DeleteSupportTickets from "@/modals/needAssistance/DeleteSupportTickets";
import { useModal } from "@/store/useModal";
import {
  SUPPORT_TICKET_STATUS_DATA,
  SUPPORT_TICKETS_HEADER_DATA,
} from "@/utils/constant";
import { COLORS, FONT_SIZE, PRIORITY } from "@/utils/enum";
import { poppins } from "@/utils/fonts";
import { NEED_ASSISTANCE_RESPONSE } from "@/utils/type";
import { Delete, DeleteOutlined, Visibility } from "@mui/icons-material";
import {
  Box,
  Card,
  Chip,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import SupportTicketDrawer from "./SupportTicketDrawer";

const SupportTicketsLayout = () => {
  const { data, loading, getAllSupportTickets } = useGetAllNeedAssistance();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] =
    useState<NEED_ASSISTANCE_RESPONSE | null>(null);

  useEffect(() => {
    getAllSupportTickets();
  }, []);

  const { showModal } = useModal();
  const { deleteSupportTickets, loading: deleteLoading } =
    useDeleteSupportTickets();

  const handleDeleteSupportTicket = async (id: string | number) => {
    await deleteSupportTickets(id);
    getAllSupportTickets();
  };

  const deleteModal = (id: string | number) => {
    showModal(
      <DeleteSupportTickets onDelete={() => handleDeleteSupportTicket(id)} />,
    );
  };

  const { updateTicketStatus } = useUpdateTicketStatus();

  const handleUpdateStatus = async (id: string | number, status: string) => {
    await updateTicketStatus(id.toString(), status);
    getAllSupportTickets();
  };

  return (
    <Box>
      <Card
        sx={{
          p: 2,
          border: "1px solid #E4E7ED",
          boxShadow: "0px 0px 2px 2px #00000020",
        }}
      >
        <Typography
          sx={{
            fontFamily: poppins.style.fontFamily,
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          Support Tickets
        </Typography>

        <TableContainer sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                {SUPPORT_TICKETS_HEADER_DATA.map((val, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      fontFamily: poppins.style.fontFamily,
                    }}
                  >
                    {val}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from(new Array(5)).map((_, i) => (
                    <TableRow key={i}>
                      {SUPPORT_TICKETS_HEADER_DATA.map((_, index) => (
                        <TableCell key={index}>
                          <Skeleton animation="wave" height={30} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : data?.data.map((val: NEED_ASSISTANCE_RESPONSE, i: number) => (
                    <TableRow key={i}>
                      <TableCell>TKT - {val.id}</TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: 15 }}>
                          {val.addedByUser.fullName ||
                            val.addedByUser.firstName +
                              " " +
                              val.addedByUser.lastName}
                        </Typography>
                        <Typography sx={{ fontSize: 12 }}>
                          {val.addedByUser.email}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: 12 }}>
                        {val.category.replace("_", " ")}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12 }}>
                        <Chip
                          label={val.priority}
                          size="small"
                          sx={{
                            backgroundColor:
                              val.priority === PRIORITY.HIGH
                                ? "#00800030"
                                : val.priority === PRIORITY.MEDIUM
                                  ? "#FFA50030"
                                  : "#EB575730",
                            color:
                              val.priority === PRIORITY.HIGH
                                ? "#008000"
                                : val.priority === PRIORITY.MEDIUM
                                  ? "#FFA500"
                                  : "#EB5757",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: 12 }}>
                        {moment(val.createdAt).format("MMM Do, YYYY")}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={val.status}
                          onChange={(e) =>
                            handleUpdateStatus(val.id, e.target.value as string)
                          }
                          sx={{
                            height: 30,
                            fontSize: 12,
                            fontFamily: poppins.style.fontFamily,
                            borderRadius: "20px",
                          }}
                        >
                          {SUPPORT_TICKET_STATUS_DATA.map((status, index) => (
                            <MenuItem
                              key={index}
                              value={status.value}
                              sx={{ fontSize: 12 }}
                            >
                              {status.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            setSelectedTicket(val);
                            setIsDrawerOpen(true);
                          }}
                        >
                          <Visibility
                            sx={{ width: 15, color: COLORS.TEXT_PRIMARY }}
                          />
                        </IconButton>
                        <IconButton onClick={() => deleteModal(val.id)}>
                          <DeleteOutlined
                            sx={{ width: 15, color: COLORS.ERROR }}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <SupportTicketDrawer
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
      />
    </Box>
  );
};

export default SupportTicketsLayout;
