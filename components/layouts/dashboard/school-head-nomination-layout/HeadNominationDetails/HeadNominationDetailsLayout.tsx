"use client";
import { useGetUserDetails } from "@/hooks/common/useSchools";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const HeadNominationDetailsLayout = () => {
  const params = useParams();
  const { userId } = params;

  const { data, loading, fetchUserDetails } = useGetUserDetails();

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId as string);
    }
  }, [userId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No data available</Typography>
      </Box>
    );
  }

  const user = data;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Nomination Details
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={2} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                User Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1">
                    {user.fullName || "N/A"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{user.email}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    {user.countryCode} {user.phone}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Role
                  </Typography>
                  <Chip label={user.role} size="small" color="primary" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={user.status}
                    size="small"
                    color={user.status === "ACTIVE" ? "success" : "default"}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={2} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                School Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {user.school ? (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      School Name
                    </Typography>
                    <Typography variant="body1">{user.school.name}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Board
                    </Typography>
                    <Typography variant="body1">
                      {user.board?.name || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Affiliation Number
                    </Typography>
                    <Typography variant="body1">
                      {user.school.affiliationNumber || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Address
                    </Typography>
                    <Typography variant="body1">
                      {user.school.addressLine1}, {user.school.city},{" "}
                      {user.school.state} - {user.school.zipCode}
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No school details available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Nomination Status
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={user.headNominationStatus || "PENDING"}
                    color={
                      user.headNominationStatus === "APPROVED"
                        ? "success"
                        : user.headNominationStatus === "REJECTED"
                          ? "error"
                          : "warning"
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Category
                  </Typography>
                  <Typography variant="body1">
                    {user.headNominationCategory || "N/A"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Message
                  </Typography>
                  <Typography variant="body1">
                    {user.headNominationMessage || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Teams Section */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h5" sx={{ mt: 2, mb: 2, fontWeight: "bold" }}>
            Teams ({user.teams?.length || 0})
          </Typography>

          <Grid container spacing={3}>
            {user.teams && user.teams.length > 0 ? (
              user.teams.map((team: any) => (
                <Grid size={{ xs: 12, md: 6 }} key={team.id}>
                  <Card
                    elevation={3}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {team.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Code: {team.teamCode}
                          </Typography>
                        </Box>
                        <Chip
                          label={team.type}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </Box>

                      <Divider sx={{ my: 1 }} />

                      <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="caption" color="textSecondary">
                            Mentor
                          </Typography>
                          <Typography variant="body2">
                            {team.mentor
                              ? `${team.mentor.firstName} ${team.mentor.lastName}`
                              : "N/A"}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="caption" color="textSecondary">
                            Assistant Mentor
                          </Typography>
                          <Typography variant="body2">
                            {team.assistantMentor
                              ? `${team.assistantMentor.firstName} ${team.assistantMentor.lastName}`
                              : "N/A"}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Innovations
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold" }}
                          >
                            {team.innovationsCount}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Research
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold" }}
                          >
                            {team.researchSubmissionsCount}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                        Team Members ({team.members?.length || 0})
                      </Typography>
                      <Paper
                        variant="outlined"
                        sx={{ maxHeight: 150, overflow: "auto" }}
                      >
                        <List dense disablePadding>
                          {team.members?.map((member: any) => (
                            <ListItem key={member.id} divider>
                              <ListItemAvatar>
                                <Avatar
                                  src={member.student?.profileImage}
                                  sx={{ width: 24, height: 24 }}
                                >
                                  {member.student?.firstName?.[0]}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={`${member.student?.firstName} ${member.student?.lastName}`}
                                secondary={member.student?.email}
                                slotProps={{
                                  primary: { variant: "body2" },
                                  secondary: { variant: "caption" },
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid size={{ xs: 12 }}>
                <Typography variant="body1" color="textSecondary">
                  No teams available for this user.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HeadNominationDetailsLayout;
