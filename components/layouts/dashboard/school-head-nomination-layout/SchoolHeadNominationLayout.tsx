"use client";
import { useSchoolHeadNominationList } from "@/hooks/school/useSchoolHeadNominationList";
import { useUpdateHeadNominationStatus } from "@/hooks/school/useUpdateHeadNominationStatus";
import {
  SCHOOL_HEAD_NOMINATION_STATUS_DATA,
  SCHOOL_HEAD_NOMINATION_TABLE_HEADER_DATA,
} from "@/utils/constant";
import { COLORS, HEAD_NOMINATION_STATUS } from "@/utils/enum";
import { useModal } from "@/store/useModal";
import RejectHeadNomination from "@/modals/RejectHeadNomination";
import { poppins } from "@/utils/fonts";
import {
  Box,
  Card,
  IconButton,
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
import { Visibility } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  const router = useRouter();

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
            variant="h4"
            sx={{
              fontSize: "34px",
              fontFamily: poppins.style.fontFamily,
              fontWeight: 700,
              color: COLORS.PRIMARY_NAVY,
              letterSpacing: -0.5,
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
                  <TableRow
                    key={i}
                    component={Link}
                    href={`/dashboard/school-head-nomination/${val.id}`}
                    sx={{ textDecoration: "none", color: "black" }}
                  >
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
                        sx={{
                          borderRadius: "100px",
                          height: "100%",
                          fontSize: 14,
                        }}
                      >
                        {val.headNominationStatus ===
                          HEAD_NOMINATION_STATUS.PENDING && (
                          <MenuItem
                            value={HEAD_NOMINATION_STATUS.PENDING}
                            disabled
                            sx={{ fontSize: 14, fontWeight: 600 }}
                          >
                            {HEAD_NOMINATION_STATUS.PENDING}
                          </MenuItem>
                        )}
                        {SCHOOL_HEAD_NOMINATION_STATUS_DATA.map(
                          (status, index) => (
                            <MenuItem
                              key={index}
                              value={status.value}
                              sx={{ fontSize: 14, fontWeight: 500 }}
                            >
                              {status.label}
                            </MenuItem>
                          ),
                        )}
                      </Select>
                    </TableCell>
                    {/* <TableCell>
                      <IconButton>
                        <Visibility sx={{ width: 15 }} />
                      </IconButton>
                    </TableCell> */}
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
