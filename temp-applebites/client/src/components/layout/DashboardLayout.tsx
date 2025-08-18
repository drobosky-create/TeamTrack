import { useEffect } from "react";
import { useLocation } from "wouter";
import { Box } from "@mui/material";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [pathname] = useLocation();

  return (
    <Box
      sx={{
        p: 3,
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        // Remove sidebar margins completely to avoid conflicts
      }}
    >
      {children}
    </Box>
  );
}