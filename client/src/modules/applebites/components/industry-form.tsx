import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Button,
  Grid
} from '@mui/material';
import { Building2, TrendingUp } from 'lucide-react';
import MDBox from '../../../components/MD/MDBox';
import MDTypography from '../../../components/MD/MDTypography';
import MDButton from '../../../components/MD/MDButton';
import { useQuery } from '@tanstack/react-query';

// NAICS Industry data types
interface NAICSIndustry {
  code: string;
  title: string;
  label: string;
  multiplier: {
    min: number;
    avg: number;
    max: number;
  };
  level: number;
  sectorCode: string;
}

interface NAICSSector {
  code: string;
  title: string;
}

export default function IndustryForm() {
  const [formData, setFormData] = useState({
    primarySector: '',
    specificIndustry: '',
    naicsCode: '',
    sectorCode: '',
    businessDescription: '',
    yearsInBusiness: '',
    numberOfEmployees: ''
  });

  // Fetch NAICS sectors
  const { data: sectors, isLoading: sectorsLoading } = useQuery<NAICSSector[]>({
    queryKey: ['/api/naics/sectors'],
  });

  // Fetch industries for selected sector
  const { data: sectorIndustries, isLoading: industriesLoading } = useQuery<NAICSIndustry[]>({
    queryKey: ['/api/naics/industries', formData.sectorCode],
    enabled: !!formData.sectorCode,
  });

  const handleSectorChange = (sectorCode: string) => {
    const selectedSector = sectors?.find(s => s.code === sectorCode);
    setFormData(prev => ({
      ...prev,
      sectorCode,
      primarySector: selectedSector?.title || '',
      specificIndustry: '',
      naicsCode: ''
    }));
  };

  const handleIndustryChange = (naicsCode: string) => {
    const selectedIndustry = sectorIndustries?.find(i => i.code === naicsCode);
    setFormData(prev => ({
      ...prev,
      naicsCode,
      specificIndustry: selectedIndustry?.title || ''
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <MDBox>
      {/* Header */}
      <MDBox display="flex" alignItems="center" mb={3}>
        <MDBox
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00718d 0%, #005b8c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2
          }}
        >
          <Building2 size={24} color="white" />
        </MDBox>
        <MDBox>
          <MDTypography variant="h5" fontWeight="medium" sx={{ color: '#344767', mb: 0.5 }}>
            Industry Classification
          </MDTypography>
          <MDTypography variant="body2" sx={{ color: '#67748e' }}>
            Select your industry for accurate valuation benchmarks
          </MDTypography>
        </MDBox>
      </MDBox>

      {/* Industry Selection */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Primary Industry Sector</InputLabel>
            <Select
              value={formData.sectorCode}
              onChange={(e) => handleSectorChange(e.target.value)}
              label="Primary Industry Sector"
              disabled={sectorsLoading}
            >
              {sectors?.map((sector) => (
                <MenuItem key={sector.code} value={sector.code}>
                  {sector.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Specific Industry</InputLabel>
            <Select
              value={formData.naicsCode}
              onChange={(e) => handleIndustryChange(e.target.value)}
              label="Specific Industry"
              disabled={!formData.sectorCode || industriesLoading}
            >
              {sectorIndustries?.map((industry) => (
                <MenuItem key={industry.code} value={industry.code}>
                  {industry.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Business Details */}
      <MDBox mt={4}>
        <MDTypography variant="h6" fontWeight="medium" sx={{ color: '#344767', mb: 2 }}>
          Business Details
        </MDTypography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Business Description"
              multiline
              rows={3}
              value={formData.businessDescription}
              onChange={(e) => handleInputChange('businessDescription', e.target.value)}
              placeholder="Briefly describe your business operations..."
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Years in Business"
              type="number"
              value={formData.yearsInBusiness}
              onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
              placeholder="e.g., 5"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Number of Employees"
              type="number"
              value={formData.numberOfEmployees}
              onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
              placeholder="e.g., 25"
            />
          </Grid>
        </Grid>
      </MDBox>

      {/* Selected Industry Info */}
      {formData.naicsCode && (
        <MDBox mt={4}>
          <Card sx={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
            <CardContent>
              <MDBox display="flex" alignItems="center" mb={2}>
                <TrendingUp size={20} color="#00718d" />
                <MDTypography variant="h6" fontWeight="medium" sx={{ color: '#344767', ml: 1 }}>
                  Industry Valuation Benchmarks
                </MDTypography>
              </MDBox>
              
              <MDTypography variant="body2" sx={{ color: '#67748e', mb: 2 }}>
                Selected: {formData.specificIndustry}
              </MDTypography>
              
              <MDBox display="flex" gap={3}>
                <MDBox textAlign="center">
                  <MDTypography variant="caption" sx={{ color: '#67748e' }}>
                    NAICS Code
                  </MDTypography>
                  <MDTypography variant="h6" fontWeight="medium" sx={{ color: '#344767' }}>
                    {formData.naicsCode}
                  </MDTypography>
                </MDBox>
                
                {sectorIndustries?.find(i => i.code === formData.naicsCode) && (
                  <>
                    <MDBox textAlign="center">
                      <MDTypography variant="caption" sx={{ color: '#67748e' }}>
                        Avg Multiple
                      </MDTypography>
                      <MDTypography variant="h6" fontWeight="medium" sx={{ color: '#00718d' }}>
                        {sectorIndustries.find(i => i.code === formData.naicsCode)?.multiplier.avg.toFixed(1)}x
                      </MDTypography>
                    </MDBox>
                    
                    <MDBox textAlign="center">
                      <MDTypography variant="caption" sx={{ color: '#67748e' }}>
                        Range
                      </MDTypography>
                      <MDTypography variant="h6" fontWeight="medium" sx={{ color: '#344767' }}>
                        {sectorIndustries.find(i => i.code === formData.naicsCode)?.multiplier.min.toFixed(1)}x - {sectorIndustries.find(i => i.code === formData.naicsCode)?.multiplier.max.toFixed(1)}x
                      </MDTypography>
                    </MDBox>
                  </>
                )}
              </MDBox>
            </CardContent>
          </Card>
        </MDBox>
      )}

      {/* Navigation */}
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mt={4}>
        <MDButton
          variant="outlined"
          sx={{
            color: '#67748e',
            borderColor: '#dee2e6',
            '&:hover': {
              backgroundColor: '#f8f9fa',
              borderColor: '#adb5bd'
            }
          }}
          onClick={() => window.history.back()}
        >
          Back to Dashboard
        </MDButton>

        <MDButton
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #00718d 0%, #005b8c 100%)',
            color: 'white',
            px: 4,
            '&:hover': {
              background: 'linear-gradient(135deg, #005b8c 0%, #004a73 100%)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
          disabled={!formData.naicsCode || !formData.businessDescription}
        >
          Continue to Financials
        </MDButton>
      </MDBox>
    </MDBox>
  );
}