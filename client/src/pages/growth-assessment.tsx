import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { TrendingUp, Star, Lock, CheckCircle } from '@mui/icons-material';

// Sample NAICS industries (in real app, this would be more comprehensive)
const naicsIndustries = [
  { code: '236115', description: 'New Single-Family Housing Construction', sector: 'Construction' },
  { code: '236220', description: 'Commercial and Institutional Building Construction', sector: 'Construction' },
  { code: '238210', description: 'Electrical Contractors and Other Wiring Installation', sector: 'Construction' },
  { code: '238220', description: 'Plumbing, Heating, and Air-Conditioning Contractors', sector: 'Construction' },
  { code: '238160', description: 'Roofing Contractors', sector: 'Construction' },
  { code: '541211', description: 'Offices of Certified Public Accountants', sector: 'Professional Services' },
  { code: '541330', description: 'Engineering Services', sector: 'Professional Services' },
  { code: '561720', description: 'Janitorial Services', sector: 'Services' },
  { code: '722511', description: 'Full-Service Restaurants', sector: 'Food Service' },
  { code: '722513', description: 'Limited-Service Restaurants', sector: 'Food Service' },
];

export default function GrowthAssessmentPage() {
  const [selectedTier, setSelectedTier] = useState<'free' | 'growth' | 'capital'>('growth');
  const [showUpgrade, setShowUpgrade] = useState(true);
  const [formData, setFormData] = useState({
    companyName: '',
    naicsCode: '',
    industryDescription: '',
    foundingYear: new Date().getFullYear(),
    employeeCount: '',
    annualRevenue: '',
  });

  const tiers = [
    {
      id: 'free',
      name: 'Free Assessment',
      price: 'Free',
      color: 'default',
      description: 'Basic business valuation analysis',
      features: [
        'Basic EBITDA calculation',
        'Simple grade-based multipliers',
        'General value drivers assessment',
        'Basic valuation estimate'
      ],
      limitations: [
        'No industry-specific analysis',
        'Limited reporting',
        'Generic multipliers only'
      ]
    },
    {
      id: 'growth',
      name: 'Growth & Exit Assessment',
      price: '$795',
      color: 'primary',
      description: 'Professional industry-specific analysis with AI insights',
      features: [
        'Industry-specific NAICS multipliers',
        'Comprehensive value drivers analysis',
        'Market comparables and benchmarking',
        'AI-powered strategic recommendations',
        'Professional PDF report',
        'Exit readiness assessment',
        'Growth opportunities identification'
      ],
      popular: true
    },
    {
      id: 'capital',
      name: 'Capital Readiness Assessment',
      price: '$2,500',
      color: 'secondary',
      description: 'Comprehensive capital readiness analysis and strategic planning',
      features: [
        'Everything in Growth Assessment',
        'Due diligence readiness review',
        'Financial model optimization',
        'Capital structure recommendations',
        'Investor presentation materials',
        '1-hour strategy consultation',
        'Priority support'
      ]
    }
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNAICSSelect = (naicsCode: string) => {
    const selectedIndustry = naicsIndustries.find(industry => industry.code === naicsCode);
    setFormData(prev => ({ 
      ...prev, 
      naicsCode,
      industryDescription: selectedIndustry?.description || ''
    }));
  };

  const handleStartAssessment = () => {
    if (selectedTier === 'free') {
      // Redirect to free assessment
      window.location.href = '/free-assessment';
      return;
    }

    // For paid tiers, show upgrade/payment flow
    setShowUpgrade(false);
    // In real app, this would integrate with payment processing
    alert(`Starting ${selectedTier} assessment. Payment integration would go here.`);
  };

  const isFormValid = () => {
    if (selectedTier === 'free') return true;
    return formData.companyName && formData.naicsCode && formData.industryDescription;
  };

  if (showUpgrade) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 2 }}>
          Choose Your Assessment Level
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, color: '#6B7280' }}>
          Select the assessment that best fits your business needs and growth stage.
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {tiers.map((tier) => (
            <Box key={tier.id} sx={{ flex: 1, minWidth: 300 }}>
              <Card 
                sx={{ 
                  position: 'relative',
                  height: '100%',
                  border: selectedTier === tier.id ? '2px solid #667eea' : '1px solid #E5E7EB',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)',
                    transform: 'translateY(-2px)'
                  }
                }}
                onClick={() => setSelectedTier(tier.id as any)}
              >
                {tier.popular && (
                  <Chip 
                    label="Most Popular" 
                    color="primary" 
                    sx={{ 
                      position: 'absolute', 
                      top: -10, 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      fontWeight: 'bold'
                    }} 
                  />
                )}
                
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {tier.name}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#667eea', mb: 1 }}>
                      {tier.price}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      {tier.description}
                    </Typography>
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Features:
                    </Typography>
                    {tier.features.map((feature, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CheckCircle sx={{ color: '#10B981', mr: 1, fontSize: 16 }} />
                        <Typography variant="body2">{feature}</Typography>
                      </Box>
                    ))}

                    {tier.limitations && (
                      <>
                        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold', color: '#EF4444' }}>
                          Limitations:
                        </Typography>
                        {tier.limitations.map((limitation, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Lock sx={{ color: '#EF4444', mr: 1, fontSize: 16 }} />
                            <Typography variant="body2" sx={{ color: '#6B7280' }}>{limitation}</Typography>
                          </Box>
                        ))}
                      </>
                    )}
                  </Box>

                  {selectedTier === tier.id && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        ✓ Selected - Continue below to start your assessment
                      </Typography>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {selectedTier !== 'free' && (
          <Card sx={{ mt: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#667eea' }}>
                Company Information
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: '#6B7280' }}>
                Provide your company details for industry-specific analysis.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <TextField
                    label="Company Name"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    required
                    sx={{ flex: 1, minWidth: 250 }}
                  />
                  
                  <TextField
                    label="Founding Year"
                    type="number"
                    value={formData.foundingYear}
                    onChange={(e) => handleInputChange('foundingYear', parseInt(e.target.value))}
                    sx={{ flex: 1, minWidth: 200 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <FormControl required sx={{ flex: 1, minWidth: 250 }}>
                    <InputLabel>Industry (NAICS Code)</InputLabel>
                    <Select
                      value={formData.naicsCode}
                      label="Industry (NAICS Code)"
                      onChange={(e) => handleNAICSSelect(e.target.value)}
                    >
                      {naicsIndustries.map((industry) => (
                        <MenuItem key={industry.code} value={industry.code}>
                          {industry.code} - {industry.description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Employee Count"
                    type="number"
                    value={formData.employeeCount}
                    onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                    sx={{ flex: 1, minWidth: 200 }}
                  />
                </Box>

                <TextField
                  label="Industry Description"
                  value={formData.industryDescription}
                  onChange={(e) => handleInputChange('industryDescription', e.target.value)}
                  multiline
                  rows={2}
                  disabled
                  helperText="Auto-filled based on NAICS selection"
                />
              </Box>
            </CardContent>
          </Card>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartAssessment}
            disabled={!isFormValid()}
            startIcon={selectedTier === 'free' ? <TrendingUp /> : <Star />}
            sx={{
              background: selectedTier === 'free' 
                ? 'linear-gradient(45deg, #10B981 30%, #059669 90%)'
                : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              color: 'white',
              px: 6,
              py: 2,
              fontSize: '1.1rem',
            }}
          >
            {selectedTier === 'free' 
              ? 'Start Free Assessment' 
              : `Start ${tiers.find(t => t.id === selectedTier)?.name} - ${tiers.find(t => t.id === selectedTier)?.price}`
            }
          </Button>
        </Box>

        {selectedTier !== 'free' && (
          <Alert severity="warning" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Note:</strong> Paid assessments include payment processing and will generate comprehensive 
              industry-specific reports with professional valuation analysis.
            </Typography>
          </Alert>
        )}
      </Box>
    );
  }

  // Assessment form for paid tiers would go here
  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 3 }}>
        {tiers.find(t => t.id === selectedTier)?.name}
      </Typography>
      
      <Alert severity="info">
        <Typography variant="body1">
          Payment integration and comprehensive assessment flow would be implemented here.
          This would include the full strategic assessment with industry-specific analysis.
        </Typography>
      </Alert>

      <Button
        variant="outlined"
        onClick={() => setShowUpgrade(true)}
        sx={{ mt: 3 }}
      >
        Back to Tier Selection
      </Button>
    </Box>
  );
}