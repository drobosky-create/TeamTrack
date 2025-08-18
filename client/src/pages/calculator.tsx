import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import { Calculate as Calculator, TrendingUp } from '@mui/icons-material';

export default function CalculatorPage() {
  const [formData, setFormData] = useState({
    netIncome: '',
    interest: '',
    taxes: '',
    depreciation: '',
    amortization: '',
    ownerSalary: '',
    personalExpenses: '',
    oneTimeExpenses: '',
    otherAdjustments: '',
  });

  const [results, setResults] = useState<{
    baseEbitda: number;
    adjustedEbitda: number;
    lowEstimate: number;
    midEstimate: number;
    highEstimate: number;
  } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateValuation = () => {
    const netIncome = parseFloat(formData.netIncome) || 0;
    const interest = parseFloat(formData.interest) || 0;
    const taxes = parseFloat(formData.taxes) || 0;
    const depreciation = parseFloat(formData.depreciation) || 0;
    const amortization = parseFloat(formData.amortization) || 0;
    
    const ownerSalary = parseFloat(formData.ownerSalary) || 0;
    const personalExpenses = parseFloat(formData.personalExpenses) || 0;
    const oneTimeExpenses = parseFloat(formData.oneTimeExpenses) || 0;
    const otherAdjustments = parseFloat(formData.otherAdjustments) || 0;

    // Calculate base EBITDA
    const baseEbitda = netIncome + interest + taxes + depreciation + amortization;
    
    // Calculate adjusted EBITDA
    const adjustedEbitda = baseEbitda + ownerSalary + personalExpenses + oneTimeExpenses + otherAdjustments;

    // Sample multiples (would typically come from industry data)
    const lowMultiple = 2.5;
    const midMultiple = 3.5;
    const highMultiple = 4.5;

    setResults({
      baseEbitda,
      adjustedEbitda,
      lowEstimate: adjustedEbitda * lowMultiple,
      midEstimate: adjustedEbitda * midMultiple,
      highEstimate: adjustedEbitda * highMultiple,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Calculator sx={{ mr: 2, color: '#667eea', fontSize: 32 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
          Business Valuation Calculator
        </Typography>
      </Box>

      <Typography variant="body1" sx={{ mb: 4, color: '#6B7280' }}>
        Calculate an estimated business valuation using EBITDA-based methodology with owner adjustments.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#667eea' }}>
                Financial Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Net Income"
                    type="number"
                    value={formData.netIncome}
                    onChange={(e) => handleInputChange('netIncome', e.target.value)}
                    InputProps={{ startAdornment: '$' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Interest Expense"
                    type="number"
                    value={formData.interest}
                    onChange={(e) => handleInputChange('interest', e.target.value)}
                    InputProps={{ startAdornment: '$' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Taxes"
                    type="number"
                    value={formData.taxes}
                    onChange={(e) => handleInputChange('taxes', e.target.value)}
                    InputProps={{ startAdornment: '$' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Depreciation"
                    type="number"
                    value={formData.depreciation}
                    onChange={(e) => handleInputChange('depreciation', e.target.value)}
                    InputProps={{ startAdornment: '$' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Amortization"
                    type="number"
                    value={formData.amortization}
                    onChange={(e) => handleInputChange('amortization', e.target.value)}
                    InputProps={{ startAdornment: '$' }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#667eea' }}>
                Owner Adjustments
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Owner Salary Add-Back"
                    type="number"
                    value={formData.ownerSalary}
                    onChange={(e) => handleInputChange('ownerSalary', e.target.value)}
                    InputProps={{ startAdornment: '$' }}
                    helperText="Excess compensation above market rate"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Personal Expenses"
                    type="number"
                    value={formData.personalExpenses}
                    onChange={(e) => handleInputChange('personalExpenses', e.target.value)}
                    InputProps={{ startAdornment: '$' }}
                    helperText="Personal expenses run through business"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="One-Time Expenses"
                    type="number"
                    value={formData.oneTimeExpenses}
                    onChange={(e) => handleInputChange('oneTimeExpenses', e.target.value)}
                    InputProps={{ startAdornment: '$' }}
                    helperText="Non-recurring expenses"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Other Adjustments"
                    type="number"
                    value={formData.otherAdjustments}
                    onChange={(e) => handleInputChange('otherAdjustments', e.target.value)}
                    InputProps={{ startAdornment: '$' }}
                    helperText="Other normalizing adjustments"
                  />
                </Grid>
              </Grid>

              <Button
                variant="contained"
                onClick={calculateValuation}
                sx={{
                  mt: 3,
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  color: 'white',
                  py: 1.5,
                  px: 4,
                }}
                fullWidth
                startIcon={<TrendingUp />}
              >
                Calculate Valuation
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          {results ? (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#10B981' }}>
                  Valuation Results
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Base EBITDA:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(results.baseEbitda)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Adjusted EBITDA:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#10B981' }}>
                      {formatCurrency(results.adjustedEbitda)}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Valuation Range
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip label="Conservative" size="small" color="warning" sx={{ mr: 1 }} />
                      <Typography variant="body2">2.5x Multiple</Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(results.lowEstimate)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip label="Market" size="small" color="info" sx={{ mr: 1 }} />
                      <Typography variant="body2">3.5x Multiple</Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3B82F6' }}>
                      {formatCurrency(results.midEstimate)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip label="Optimistic" size="small" color="success" sx={{ mr: 1 }} />
                      <Typography variant="body2">4.5x Multiple</Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#10B981' }}>
                      {formatCurrency(results.highEstimate)}
                    </Typography>
                  </Box>
                </Box>

                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    This is a preliminary estimate. Actual valuations depend on many factors including 
                    industry conditions, business quality, and market dynamics.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 64, color: '#E5E7EB', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#6B7280', mb: 1 }}>
                  Enter Financial Data
                </Typography>
                <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                  Fill in the financial information to calculate your business valuation estimate.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}