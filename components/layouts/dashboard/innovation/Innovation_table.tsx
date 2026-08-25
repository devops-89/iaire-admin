import {
  INNOVATION_STATUS_DATA,
  INNOVATION_TABLE_HEADER,
} from "@/utils/constant";
import { roboto } from "@/utils/fonts";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
} from "@mui/material";
import React from "react";
import dayjs from "dayjs";
import { INNOVATION_RESPONSE_DATA_PROPS } from "@/utils/type";

interface InnovationTableProps {
  innovationData?: {
    data?: INNOVATION_RESPONSE_DATA_PROPS[];
  };
  onStatusChange?: (id: number | string, status: string) => void;
}

const InnovationTable = ({ innovationData, onStatusChange }: InnovationTableProps) => {
  const data = innovationData?.data || [];

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {INNOVATION_TABLE_HEADER.map((val, i) => (
                <TableCell
                  key={i}
                  sx={{
                    fontSize: 16,
                    fontFamily: roboto.style.fontFamily,
                    fontWeight: 600,
                  }}
                >
                  {val}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={item.id || index}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.title || "N/A"}</TableCell>
                  <TableCell>{item.school?.board?.name || "N/A"}</TableCell>
                  <TableCell>{item.school?.name || "N/A"}</TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={item.status || ""}
                      fullWidth
                      displayEmpty
                      onChange={(e) => {
                        if (onStatusChange) {
                          onStatusChange(item.id, e.target.value);
                        }
                      }}
                      sx={{
                        borderRadius: "16px",
                        backgroundColor: "#F9FAFB",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#E5E7EB",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#D1D5DB",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#9CA3AF",
                          borderWidth: "1px",
                        },
                        "& .MuiSelect-select": {
                          py: 1,
                          px: 2,
                        },
                        fontFamily: roboto.style.fontFamily,
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#374151",
                        minWidth: "160px",
                        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select Status
                      </MenuItem>
                      {INNOVATION_STATUS_DATA.map((status) => (
                        <MenuItem 
                          key={status.value} 
                          value={status.value}
                          sx={{ 
                            fontFamily: roboto.style.fontFamily,
                            fontSize: "14px" 
                          }}
                        >
                          {status.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    {item.createdAt ? dayjs(item.createdAt).format("DD MMM YYYY") : "N/A"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No Innovation Data Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default InnovationTable;
