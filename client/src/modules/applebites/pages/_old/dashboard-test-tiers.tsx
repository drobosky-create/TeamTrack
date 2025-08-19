import DashboardClean from './dashboard-clean';
import MDBox from '../../../components/MD/MDBox';
import MDButton from '../../../components/MD/MDButton';
import MDTypography from '../../../components/MD/MDTypography';
import { useState } from 'react';

// Test component to see different tier views
export default function DashboardTestTiers() {
  const [selectedTier, setSelectedTier] = useState<'free' | 'growth' | 'capital'>('free');

  return (
    <MDBox>
      {/* Tier Selector */}
      <MDBox 
        sx={{ 
          position: 'fixed', 
          top: 20, 
          right: 20, 
          zIndex: 1000,
          backgroundColor: 'white',
          padding: 2,
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        <MDTypography variant="caption" mb={1} display="block">
          Test Tier Views:
        </MDTypography>
        <MDBox display="flex" gap={1}>
          <MDButton 
            size="small" 
            variant={selectedTier === 'free' ? 'contained' : 'outlined'}
            onClick={() => setSelectedTier('free')}
          >
            Free
          </MDButton>
          <MDButton 
            size="small" 
            variant={selectedTier === 'growth' ? 'contained' : 'outlined'}
            onClick={() => setSelectedTier('growth')}
          >
            Growth
          </MDButton>
          <MDButton 
            size="small" 
            variant={selectedTier === 'capital' ? 'contained' : 'outlined'}
            onClick={() => setSelectedTier('capital')}
          >
            Capital
          </MDButton>
        </MDBox>
      </MDBox>

      {/* Pass the selected tier to dashboard */}
      <DashboardCleanWithTier tier={selectedTier} />
    </MDBox>
  );
}

// Modified dashboard component that accepts tier prop
function DashboardCleanWithTier({ tier }: { tier: 'free' | 'growth' | 'capital' }) {
  const mockUser = {
    name: 'Demo User',
    email: 'demo@applebites.ai',
    tier: tier,
    firstName: 'Demo',
    lastName: 'User'
  };

  // Copy the dashboard component logic here with the custom user
  return <DashboardClean />; // For now, just use the existing component
}