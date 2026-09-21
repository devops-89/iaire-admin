"use client";
import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  IconButton,
  Chip,
  Skeleton,
} from "@mui/material";
import { 
  ArrowBack, 
  Email, 
  Phone, 
  BusinessCenter, 
  CardMembership, 
  Wc, 
  School as SchoolIcon, 
  AccountBalance,
  WorkspacePremium
} from "@mui/icons-material";
import { poppins } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";
import { useRouter } from "next/navigation";
import { useGetUserDetails } from "@/hooks/common/useSchools";

interface UserDetailsProps {
  userId: string;
}

const UserDetails: React.FC<UserDetailsProps> = ({ userId }) => {
  const router = useRouter();
  const { data, loading, fetchUserDetails } = useGetUserDetails();

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
    }
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  const user = data || {};

  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton onClick={() => router.back()} sx={{ bgcolor: "rgba(0,0,0,0.04)" }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ fontFamily: poppins.style.fontFamily, fontWeight: 700, color: COLORS.BLACK }}>
          User Details
        </Typography>
      </Box>

      <Card sx={{ borderRadius: "16px", boxShadow: "0px 4px 20px rgba(0,0,0,0.05)", border: "1px solid #d7d7d7", mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 3 }} sx={{ display: "flex", flexDirection: "column", alignItems: "center", borderRight: { md: "1px solid #eee" } }}>
              <Avatar src={user.profileImageDownloadUrl || user.profileImage} sx={{ width: 120, height: 120, mb: 2 }} />
              <Typography variant="h6" sx={{ fontFamily: poppins.style.fontFamily, fontWeight: 600, color: COLORS.PRIMARY_NAVY, textTransform: "capitalize", textAlign: "center" }}>
                {`${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username}
              </Typography>
              {user.userId && (
                <Typography sx={{ fontFamily: poppins.style.fontFamily, fontSize: 12, color: COLORS.TEXT_SECONDARY, mt: 0.5, mb: 1 }}>
                  ID: <strong>{user.userId}</strong>
                </Typography>
              )}
              <Chip
                label={user.role || "N/A"}
                size="small"
                sx={{ mt: 1, bgcolor: "rgba(0,0,0,0.05)", fontFamily: poppins.style.fontFamily, fontSize: 11, fontWeight: 600 }}
              />
              <Chip
                label={user.status || "N/A"}
                size="small"
                sx={{
                  mt: 1,
                  bgcolor: user.status === "ACTIVE" ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)",
                  color: user.status === "ACTIVE" ? "#4CAF50" : "#F44336",
                  fontWeight: 600,
                  fontSize: 11,
                }}
              />
              {user.approvalStatus && (
                <Chip
                  label={user.approvalStatus}
                  size="small"
                  sx={{
                    mt: 1,
                    bgcolor: user.approvalStatus === "APPROVED" ? "rgba(33, 150, 243, 0.1)" : "rgba(255, 152, 0, 0.1)",
                    color: user.approvalStatus === "APPROVED" ? "#2196F3" : "#FF9800",
                    fontWeight: 600,
                    fontSize: 11,
                  }}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 9 }}>
              <Typography variant="h6" sx={{ fontFamily: poppins.style.fontFamily, fontWeight: 600, color: COLORS.PRIMARY_NAVY, mb: 3 }}>
                Information
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ p: 1, borderRadius: 1, bgcolor: "rgba(33, 150, 243, 0.1)", color: "#2196F3" }}>
                      <Email fontSize="small" />
                    </Box>
                    <Box>
                      <Typography sx={{ fontFamily: poppins.style.fontFamily, fontSize: 12, color: COLORS.TEXT_SECONDARY }}>
                        Email
                      </Typography>
                      <Typography sx={{ fontFamily: poppins.style.fontFamily, fontWeight: 500, color: COLORS.PRIMARY_NAVY, display: "flex", alignItems: "center", gap: 1 }}>
                        {user.email || "N/A"} 
                        {user.isEmailVerified && <Chip label="Verified" size="small" sx={{ height: 16, fontSize: 10, bgcolor: "rgba(76, 175, 80, 0.1)", color: "#4CAF50" }}/>}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ p: 1, borderRadius: 1, bgcolor: "rgba(76, 175, 80, 0.1)", color: "#4CAF50" }}>
                      <Phone fontSize="small" />
                    </Box>
                    <Box>
                      <Typography sx={{ fontFamily: poppins.style.fontFamily, fontSize: 12, color: COLORS.TEXT_SECONDARY }}>
                        Phone
                      </Typography>
                      <Typography sx={{ fontFamily: poppins.style.fontFamily, fontWeight: 500, color: COLORS.PRIMARY_NAVY, display: "flex", alignItems: "center", gap: 1 }}>
                        {user.phone || "N/A"} 
                        {user.isPhoneVerified && <Chip label="Verified" size="small" sx={{ height: 16, fontSize: 10, bgcolor: "rgba(76, 175, 80, 0.1)", color: "#4CAF50" }}/>}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ p: 1, borderRadius: 1, bgcolor: "rgba(156, 39, 176, 0.1)", color: "#9c27b0" }}>
                      <Wc fontSize="small" />
                    </Box>
                    <Box>
                      <Typography sx={{ fontFamily: poppins.style.fontFamily, fontSize: 12, color: COLORS.TEXT_SECONDARY }}>
                        Gender
                      </Typography>
                      <Typography sx={{ fontFamily: poppins.style.fontFamily, fontWeight: 500, color: COLORS.PRIMARY_NAVY, textTransform: "capitalize" }}>
                        {user.gender?.toLowerCase() || "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>



                {user.school?.name && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{ p: 1, borderRadius: 1, bgcolor: "rgba(0, 188, 212, 0.1)", color: "#00BCD4" }}>
                        <SchoolIcon fontSize="small" />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: poppins.style.fontFamily, fontSize: 12, color: COLORS.TEXT_SECONDARY }}>
                          School
                        </Typography>
                        <Typography sx={{ fontFamily: poppins.style.fontFamily, fontWeight: 500, color: COLORS.PRIMARY_NAVY, textTransform: "capitalize" }}>
                          {user.school.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {user.board?.name && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{ p: 1, borderRadius: 1, bgcolor: "rgba(96, 125, 139, 0.1)", color: "#607D8B" }}>
                        <AccountBalance fontSize="small" />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: poppins.style.fontFamily, fontSize: 12, color: COLORS.TEXT_SECONDARY }}>
                          Board
                        </Typography>
                        <Typography sx={{ fontFamily: poppins.style.fontFamily, fontWeight: 500, color: COLORS.PRIMARY_NAVY }}>
                          {user.board.name} ({user.board.code})
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {user.plan && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{ p: 1, borderRadius: 1, bgcolor: "rgba(233, 30, 99, 0.1)", color: "#E91E63" }}>
                        <WorkspacePremium fontSize="small" />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: poppins.style.fontFamily, fontSize: 12, color: COLORS.TEXT_SECONDARY }}>
                          Subscription Plan
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography sx={{ fontFamily: poppins.style.fontFamily, fontWeight: 500, color: COLORS.PRIMARY_NAVY }}>
                            {user.plan.name}
                          </Typography>
                          {user.plan.isActive && (
                            <Chip label="Active" size="small" sx={{ height: 16, fontSize: 10, bgcolor: "rgba(76, 175, 80, 0.1)", color: "#4CAF50" }} />
                          )}
                        </Box>
                        <Typography sx={{ fontFamily: poppins.style.fontFamily, fontSize: 11, color: COLORS.TEXT_SECONDARY }}>
                          {user.plan.price} {user.plan.currency} / {user.plan.billingCycle?.toLowerCase()}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {/* Tier Progress Section */}
                {user.tierProgressDetails && user.role && user.tierProgressDetails[user.role] && (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid #f0f0f0" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Typography variant="h6" sx={{ fontFamily: poppins.style.fontFamily, fontWeight: 600, color: COLORS.PRIMARY_NAVY }}>
                          Membership Progression
                        </Typography>
                        <Typography sx={{ fontFamily: poppins.style.fontFamily, fontSize: 14, fontWeight: 600, color: COLORS.PRIMARY_NAVY }}>
                          Overall: {user.tierProgress || 0}%
                        </Typography>
                      </Box>
                      
                      <Grid container spacing={2}>
                        {user.tierProgressDetails[user.role].map((tier: any, index: number) => {
                          const isCompleted = tier.requirements.every((req: any) => req.current >= req.required);
                          const isActive = tier.membershipTier === user.membershipTier;
                          
                          return (
                            <Grid size={{ xs: 12, sm: 4 }} key={index}>
                              <Card sx={{ 
                                bgcolor: isActive ? "rgba(33, 150, 243, 0.05)" : isCompleted ? "rgba(76, 175, 80, 0.05)" : "transparent",
                                border: `1px solid ${isActive ? "#2196F3" : isCompleted ? "#4CAF50" : "#d7d7d7"}`,
                                boxShadow: "none",
                                height: "100%"
                              }}>
                                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                                  <Typography sx={{ fontFamily: poppins.style.fontFamily, fontSize: 13, fontWeight: 600, color: isActive ? "#2196F3" : isCompleted ? "#4CAF50" : COLORS.PRIMARY_NAVY, mb: 1, textTransform: "capitalize" }}>
                                    {tier.membershipTier.replace(/_/g, " ").toLowerCase()}
                                    {isActive && " (Current)"}
                                  </Typography>
                                  {tier.requirements.map((req: any, reqIndex: number) => (
                                    <Box key={reqIndex} sx={{ mt: 1 }}>
                                      <Typography sx={{ fontFamily: poppins.style.fontFamily, fontSize: 11, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>
                                        {req.description}
                                      </Typography>
                                      <Typography sx={{ fontFamily: poppins.style.fontFamily, fontSize: 12, fontWeight: 600, color: COLORS.PRIMARY_NAVY }}>
                                        {req.current} / {req.required} Completed
                                      </Typography>
                                    </Box>
                                  ))}
                                </CardContent>
                              </Card>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Teams Grid */}
      {user.teams && user.teams.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontFamily: poppins.style.fontFamily, fontWeight: 600, color: COLORS.PRIMARY_NAVY, mb: 2 }}>
            Teams ({user.teams.length})
          </Typography>
          <Grid container spacing={3}>
            {user.teams.map((team: any) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={team.id}>
                <Card sx={{ borderRadius: "12px", boxShadow: "0px 4px 12px rgba(0,0,0,0.05)", border: "1px solid #d7d7d7" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Typography sx={{ fontFamily: poppins.style.fontFamily, fontWeight: 600, color: COLORS.PRIMARY_NAVY }}>
                        {team.title}
                      </Typography>
                      <Chip label={team.type} size="small" sx={{ bgcolor: "rgba(33, 150, 243, 0.1)", color: "#2196F3", fontSize: 10, fontWeight: 600 }} />
                    </Box>
                    <Typography sx={{ fontFamily: poppins.style.fontFamily, fontSize: 12, color: COLORS.TEXT_SECONDARY, mb: 1 }}>
                      Code: <Box component="span" sx={{ color: COLORS.PRIMARY_NAVY, fontWeight: 500 }}>{team.teamCode}</Box>
                    </Typography>
                    <Typography sx={{ fontFamily: poppins.style.fontFamily, fontSize: 12, color: COLORS.TEXT_SECONDARY }}>
                      Members: <Box component="span" sx={{ color: COLORS.PRIMARY_NAVY, fontWeight: 500 }}>{team.members?.length || 0}</Box>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default UserDetails;
