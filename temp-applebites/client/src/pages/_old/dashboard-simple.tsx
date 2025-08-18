import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  Container,
  Card,
  CardContent,
  Avatar,
  Chip,
} from '@mui/material';
import { TrendingUp, Assessment, AccountCircle } from '@mui/icons-material';
// Import Material Dashboard components
import { MDBox, MDTypography, MDButton } from "@/components/MD";

export default function SimpleDashboard() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Mock user data for demonstration
  const userData = {
    firstName: user?.firstName || "Demo",
    lastName: user?.lastName || "User", 
    email: user?.email || "demo@example.com",
    tier: user?.tier || "free"
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <MDTypography variant="h6" color="text">Loading...</MDTypography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header Section with Material Dashboard styling */}
      <MDBox mb={4}>
        <MDTypography variant="h4" fontWeight="bold" color="dark" mb={1}>
          Welcome to Apple Bites
        </MDTypography>
        <MDTypography variant="body1" color="text">
          Professional business valuations powered by AI
        </MDTypography>
      </MDBox>

      {/* User Profile and Assessment Actions */}
      <MDBox display="flex" gap={3} mb={4} flexWrap="wrap">
        {/* User Profile Card */}
        <Card sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <CardContent>
            <MDBox display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                <AccountCircle fontSize="large" />
              </Avatar>
              <MDBox>
                <MDTypography variant="h6" fontWeight="medium" color="dark">
                  {userData.firstName} {userData.lastName}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {userData.email}
                </MDTypography>
              </MDBox>
            </MDBox>
            
            <Chip 
              label={`${userData.tier.charAt(0).toUpperCase() + userData.tier.slice(1)} Tier`}
              color={userData.tier === 'free' ? 'default' : 'primary'}
              size="small"
              sx={{ mb: 2 }}
            />
          </CardContent>
        </Card>

        {/* Assessment Actions */}
        <Card sx={{ flex: '2 1 400px', minWidth: '400px' }}>
          <CardContent>
            <MDBox display="flex" alignItems="center" mb={3}>
              <TrendingUp sx={{ mr: 1, color: '#1A73E8' }} />
              <MDTypography variant="h6" fontWeight="medium" color="dark">
                Start Your Business Assessment
              </MDTypography>
            </MDBox>

            <MDTypography variant="body1" color="text" mb={3}>
              Get comprehensive insights into your business value with our AI-powered assessment tools.
            </MDTypography>

            <MDBox display="flex" gap={2} flexWrap="wrap">
              {/* Demonstrate Material Dashboard gradient button */}
              <MDButton 
                variant="gradient" 
                color="info"
                size="large"
                onClick={() => setLocation('/assessment/free')}
                startIcon={<Assessment />}
              >
                Start Free Assessment
              </MDButton>

              <MDButton 
                variant="contained"
                color="success"
                onClick={() => setLocation('/value-calculator')}
              >
                Value Calculator
              </MDButton>
            </MDBox>
          </CardContent>
        </Card>
      </MDBox>

      {/* Dashboard Stats with Material Dashboard styling */}
      <MDBox display="flex" gap={3} flexWrap="wrap">
        <Card sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <CardContent>
            <MDBox variant="gradient" bgColor="info" p={2} borderRadius="lg" shadow="md" mb={2}>
              <Assessment sx={{ color: 'white', fontSize: 24 }} />
            </MDBox>
            <MDTypography variant="h6" fontWeight="medium" color="dark">
              Assessments
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Complete business evaluations
            </MDTypography>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <CardContent>
            <MDBox variant="gradient" bgColor="success" p={2} borderRadius="lg" shadow="md" mb={2}>
              <TrendingUp sx={{ color: 'white', fontSize: 24 }} />
            </MDBox>
            <MDTypography variant="h6" fontWeight="medium" color="dark">
              Analytics
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Track your business metrics
            </MDTypography>
          </CardContent>
        </Card>
      </MDBox>
    </Container>
  );
}