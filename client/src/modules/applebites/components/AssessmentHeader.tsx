import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import MDBox from "../../../components/MD/MDBox";
import MDTypography from "../../../components/MD/MDTypography";
import { 
  Star,
  TrendingUp,
  FileText,
  Calculator,
  CheckCircle,
  Users
} from "lucide-react";

interface AssessmentHeaderProps {
  title: string;
  subtitle: string;
  tier: 'free' | 'premium';
  features: Array<{
    icon: React.ComponentType<{ size: number; color: string }>;
    label: string;
  }>;
}

export default function AssessmentHeader({ title, subtitle, tier, features }: AssessmentHeaderProps) {
  const isPremium = tier === 'premium';
  
  // Fetch Stripe pricing for Growth plan
  const { data: pricingData } = useQuery({
    queryKey: ['/api/products/applebites-growth'],
    enabled: isPremium,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
  
  const formattedPrice = pricingData?.price 
    ? `$${pricingData.price.toFixed(0)}`
    : '$795';
  
  return (
    <MDBox sx={{ 
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e5e7eb',
      mb: 4,
      overflow: 'hidden'
    }}>
      {/* Header Content */}
      <MDBox sx={{ 
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e5e7eb',
        px: 4,
        py: 3
      }}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          {/* Left: Title and Description */}
          <MDBox>
            <MDTypography 
              variant="h4" 
              fontWeight="bold" 
              sx={{ 
                color: '#1e293b',
                mb: 1,
                fontSize: '28px',
                letterSpacing: '-0.5px'
              }}
            >
              {title}
            </MDTypography>
            <MDTypography 
              variant="body1" 
              sx={{ 
                color: '#64748b',
                fontSize: '16px',
                fontWeight: '400'
              }}
            >
              {subtitle}
            </MDTypography>
          </MDBox>

          {/* Right: Tier Badge */}
          {isPremium ? (
            <MDBox
              sx={{
                backgroundColor: '#10b981',
                color: 'white',
                px: 4,
                py: 2,
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                border: '1px solid #059669'
              }}
            >
              {formattedPrice} Premium Tier
            </MDBox>
          ) : (
            <MDBox
              sx={{
                backgroundColor: '#3b82f6',
                color: 'white',
                px: 6,
                py: 2,
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
                border: '1px solid #2563eb',
                minWidth: '160px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Free Assessment
            </MDBox>
          )}
        </MDBox>
      </MDBox>

      {/* Features Row */}
      <MDBox sx={{ 
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        py: 2.5,
        px: 4,
        backgroundColor: '#ffffff'
      }}>
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <MDBox key={index} display="flex" alignItems="center" gap={1}>
              <IconComponent size={16} color={isPremium ? "#10b981" : "#3b82f6"} />
              <MDTypography variant="caption" sx={{ color: '#64748b', fontWeight: '500', fontSize: '13px' }}>
                {feature.label}
              </MDTypography>
            </MDBox>
          );
        })}
      </MDBox>
    </MDBox>
  );
}

// Predefined feature sets
export const FREE_FEATURES = [
  { icon: CheckCircle, label: '10 Value Drivers' },
  { icon: Calculator, label: 'Basic Valuation' },
  { icon: FileText, label: 'Summary Report' },
  { icon: TrendingUp, label: 'Growth Insights' }
];

export const PREMIUM_FEATURES = [
  { icon: Star, label: '20 Value Drivers' },
  { icon: TrendingUp, label: 'AI Analysis' },
  { icon: FileText, label: 'Professional Report' },
  { icon: Calculator, label: 'Industry Benchmarks' }
];