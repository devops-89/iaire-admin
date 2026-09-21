import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Skeleton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import {
  ArrowRightAlt,
  ArrowRightAltOutlined,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";

interface UserTableProps {
  title: string;
  users: any[];
  loading: boolean;
  onViewDetails?: (user: any) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  title,
  users,
  loading,
  onViewDetails,
}) => (
  <Box sx={{ mt: 4 }}>
    <Typography
      variant="h6"
      sx={{
        fontFamily: poppins.style.fontFamily,
        fontWeight: 600,
        color: COLORS.PRIMARY_NAVY,
        mb: 2,
      }}
    >
      {title} ({users?.length || 0})
    </Typography>
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "16px",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
        border: "1px solid #d7d7d7",
      }}
    >
      <Table>
        <TableHead sx={{ border: "1px solid #d7d7d7" }}>
          <TableRow
            sx={{
              bgcolor: "rgba(0,0,0,0.02)",
              border: "1px solid #d7d7d7",
            }}
          >
            <TableCell
              sx={{
                fontFamily: poppins.style.fontFamily,
                fontWeight: 600,
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              User
            </TableCell>
            <TableCell
              sx={{
                fontFamily: poppins.style.fontFamily,
                fontWeight: 600,
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              Email
            </TableCell>
            <TableCell
              sx={{
                fontFamily: poppins.style.fontFamily,
                fontWeight: 600,
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              Role
            </TableCell>
            <TableCell
              sx={{
                fontFamily: poppins.style.fontFamily,
                fontWeight: 600,
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              Status
            </TableCell>
            <TableCell
              align="right"
              sx={{
                fontFamily: poppins.style.fontFamily,
                fontWeight: 600,
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width={120} />
                  </Box>
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={150} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={80} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="rounded" width={60} height={24} />
                </TableCell>
                <TableCell align="right">
                  <Skeleton
                    variant="rounded"
                    width={100}
                    height={32}
                    sx={{ ml: "auto" }}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : users && users.length > 0 ? (
            users.map((user: any) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: "rgba(0,0,0,0.01)" },
                }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      src={user.profileImage}
                      alt={user.firstName}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Typography
                      sx={{
                        fontFamily: poppins.style.fontFamily,
                        fontWeight: 500,
                        color: COLORS.PRIMARY_NAVY,
                        textTransform: "capitalize",
                      }}
                    >
                      {user.firstName || user.username} {user.lastName || ""}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: poppins.style.fontFamily,
                    fontWeight: 500,
                  }}
                >
                  {user.email}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: poppins.style.fontFamily,
                    fontWeight: 500,
                  }}
                >
                  <Chip
                    label={user.role}
                    size="small"
                    sx={{
                      bgcolor: "rgba(0,0,0,0.05)",
                      fontFamily: poppins.style.fontFamily,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    size="small"
                    sx={{
                      bgcolor:
                        user.status === "ACTIVE"
                          ? "rgba(76, 175, 80, 0.1)"
                          : "rgba(244, 67, 54, 0.1)",
                      color: user.status === "ACTIVE" ? "#4CAF50" : "#F44336",
                      fontWeight: 600,
                      fontSize: 11,
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    onClick={() => onViewDetails && onViewDetails(user)}
                    sx={{
                      textTransform: "none",
                      fontFamily: poppins.style.fontFamily,
                      fontSize: 12,
                      fontWeight: 500,
                      color: COLORS.PRIMARY_NAVY,
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                    endIcon={<ArrowRightAltOutlined />}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                <Typography
                  sx={{
                    fontFamily: poppins.style.fontFamily,
                    color: COLORS.TEXT_SECONDARY,
                  }}
                >
                  No {title.toLowerCase()} found.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

export default UserTable;
