import { HEADBOYNOMINATIONHEADER } from "@/utils/constant";
import { roboto } from "@/utils/fonts";
import {
  Box,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

const HeadBoyorGirlNomination = () => {
  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {HEADBOYNOMINATIONHEADER.map((val, i) => (
                <TableCell
                  key={i}
                  sx={{ fontFamily: roboto.style.fontFamily, fontSize: 18 }}
                >
                  {val}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HeadBoyorGirlNomination;
