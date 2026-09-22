"use client";
import { useSchoolHeadNominationList } from "@/hooks/school/useSchoolHeadNominationList";
import { useUpdateHeadNominationStatus } from "@/hooks/school/useUpdateHeadNominationStatus";
import {
  SCHOOL_HEAD_NOMINATION_STATUS_DATA,
  SCHOOL_HEAD_NOMINATION_TABLE_HEADER_DATA,
} from "@/utils/constant";
import { HEAD_NOMINATION_STATUS } from "@/utils/enum";
import { useModal } from "@/store/useModal";
import RejectHeadNomination from "@/modals/RejectHeadNomination";
import { poppins } from "@/utils/fonts";
import {
  Box,
  Card,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const SchoolHeadNominationLayout = () => {
  const { data, getSchoolHeadNominationList, loading } =
    useSchoolHeadNominationList();
  const { updateHeadNominationStatus } = useUpdateHeadNominationStatus();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const { showModal } = useModal();

  const handleStatusChange = async (id: number | string, status: string) => {
    if (status === HEAD_NOMINATION_STATUS.REJECTED) {
      showModal(
        <RejectHeadNomination
          nominationId={id}
          onSuccess={() =>
            getSchoolHeadNominationList({ page: page + 1, limit })
          }
        />,
      );
      return;
    }
    await updateHeadNominationStatus(id, status);
    getSchoolHeadNominationList({ page: page + 1, limit });
  };
  useEffect(() => {
    getSchoolHeadNominationList({ page: page + 1, limit });
  }, [limit, page]);

  return (
    <div>
      <Box>
        <Card
          sx={{
            p: 2,
            boxShadow: "0px 0px 2px 2px #eeeeee20",
            borderRadius: "20px",
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontFamily: poppins.style.fontFamily,
              fontWeight: 600,
            }}
          >
            School Head Boy/Girl Nomination List
          </Typography>

          <TableContainer sx={{ p: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {SCHOOL_HEAD_NOMINATION_TABLE_HEADER_DATA.map((val, i) => (
                    <TableCell
                      key={i}
                      sx={{
                        fontSize: 16,
                        fontFamily: poppins.style.fontFamily,
                        fontWeight: 600,
                      }}
                    >
                      {val}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data.map((val, i) => (
                  <TableRow>
                    <TableCell>
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                        {val.fullName || val.firstName + " " + val.lastName}
                      </Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
                        {val.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 500,
                          textTransform: "capitalize",
                        }}
                      >
                        {val.school?.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 500,
                          textTransform: "capitalize",
                        }}
                      >
                        {val.headNominationCategory}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={val.headNominationStatus}
                        onChange={(e) =>
                          handleStatusChange(val.id, e.target.value as string)
                        }
                      >
                        {val.headNominationStatus === "PENDING" && (
                          <MenuItem value="PENDING" disabled>
                            Pending
                          </MenuItem>
                        )}
                        {SCHOOL_HEAD_NOMINATION_STATUS_DATA.map(
                          (status, index) => (
                            <MenuItem key={index} value={status.value}>
                              {status.label}
                            </MenuItem>
                          ),
                        )}
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={data?.pagination?.total || 0}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={limit}
            onRowsPerPageChange={(event) => {
              setLimit(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </Card>
      </Box>
    </div>
  );
};

export default SchoolHeadNominationLayout;
