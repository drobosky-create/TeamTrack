import { UseFormReturn } from "react-hook-form";
import { AdjustmentsData } from "@shared/schema";
import { Typography, Card, CardContent, TextField, InputAdornment, TextareaAutosize } from '@mui/material';
import { ArrowLeft, ArrowRight, Settings } from "lucide-react";
import MDBox from "../../../components/MD/MDBox";
import MDTypography from "../../../components/MD/MDTypography";
import MDButton from "../../../components/MD/MDButton";


interface AdjustmentsFormProps {
  form: UseFormReturn<AdjustmentsData>;
  onNext: () => void;
  onPrev: () => void;
  onDataChange: (data: AdjustmentsData) => void;
  calculateAdjustedEbitda: () => number;
  baseEbitda: number;
  isLocked?: boolean;

}

export default function AdjustmentsForm({ 
  form, 
  onNext, 
  onPrev, 
  onDataChange, 
  calculateAdjustedEbitda,
  baseEbitda,
  isLocked = false,
}: AdjustmentsFormProps) {



  const watchedValues = form.watch();
  const adjustedEbitda = calculateAdjustedEbitda();
  
  const totalAdjustments = 
    parseFloat(watchedValues.ownerSalary || "0") +
    parseFloat(watchedValues.personalExpenses || "0") +
    parseFloat(watchedValues.oneTimeExpenses || "0") +
    parseFloat(watchedValues.otherAdjustments || "0");

  const onSubmit = (data: AdjustmentsData) => {
    onDataChange(data);
    onNext();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleFieldChange = (fieldName: keyof AdjustmentsData, value: string) => {
    const numValue = Number(value) || 0;
    form.setValue(fieldName, numValue.toString());
    onDataChange(form.getValues());
  };

  return (
    <MDBox>
      {/* Executive Header Section */}
      <MDBox mb={2} display="flex" alignItems="center" justifyContent="space-between">
        <MDBox display="flex" alignItems="center">
          <MDBox
            sx={{
              backgroundColor: '#1B2C4F',
              borderRadius: '8px',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
            }}
          >
            <Settings style={{ color: '#ffffff', fontSize: 28 }} />
          </MDBox>

          <MDBox>
            <MDTypography variant="h4" fontWeight="bold" color="dark" mb={1}>
              EBITDA Adjustments
            </MDTypography>
            <MDTypography variant="body1" color="text">
              Add back one-time, non-recurring, or personal expenses to calculate adjusted EBITDA.
            </MDTypography>
          </MDBox>
        </MDBox>


      </MDBox>

      {/* Form Container */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <CardContent sx={{ p: 3 }}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Adjustment Categories Section */}
            <MDBox mb={3}>
              <MDTypography variant="h6" fontWeight="medium" color="dark" mb={2}>
                Adjustment Categories
              </MDTypography>
              
              <MDBox mb={2}>
                <TextField
                  label="Excess Owner Compensation"
                  type="number"
                  placeholder="0"
                  fullWidth
                  variant="outlined"
                  disabled={isLocked}
                  {...form.register("ownerSalary")}
                  onChange={(e) => handleFieldChange("ownerSalary", e.target.value)}
                  helperText="Amount paid to owner above market rate for the position"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
              </MDBox>

              <MDBox mb={2}>
                <TextField
                  label="Personal Expenses"
                  type="number"
                  placeholder="0"
                  fullWidth
                  variant="outlined"
                  disabled={isLocked}
                  {...form.register("personalExpenses")}
                  onChange={(e) => handleFieldChange("personalExpenses", e.target.value)}
                  helperText="Personal expenses run through business (travel, meals, etc.)"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
              </MDBox>

              <MDBox mb={2}>
                <TextField
                  label="One-Time Expenses"
                  type="number"
                  placeholder="0"
                  fullWidth
                  variant="outlined"
                  disabled={isLocked}
                  {...form.register("oneTimeExpenses")}
                  onChange={(e) => handleFieldChange("oneTimeExpenses", e.target.value)}
                  helperText="Non-recurring expenses (legal fees, moving costs, etc.)"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
              </MDBox>

              <MDBox mb={2}>
                <TextField
                  label="Other Adjustments"
                  type="number"
                  placeholder="0"
                  fullWidth
                  variant="outlined"
                  disabled={isLocked}
                  {...form.register("otherAdjustments")}
                  onChange={(e) => handleFieldChange("otherAdjustments", e.target.value)}
                  helperText="Other legitimate business adjustments"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
              </MDBox>

              <MDBox mb={2}>
                <TextField
                  label="Notes (Optional)"
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                  disabled={isLocked}
                  {...form.register("adjustmentNotes")}
                  onChange={(e) => {
                    form.setValue("adjustmentNotes", e.target.value);
                    onDataChange(form.getValues());
                  }}
                  helperText="Additional context for your adjustments"
                  placeholder="Describe any additional context for these adjustments..."
                />
              </MDBox>
            </MDBox>

            {/* Adjusted EBITDA Summary Card */}
            <MDBox mb={4}>
              <Card
                sx={{
                  background: '#1B2C4F',
                  color: 'white',
                  borderRadius: 2,
                  p: 3
                }}
              >
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <MDTypography variant="h6" fontWeight="medium" sx={{ color: '#ebfafb' }}>
                    Adjusted EBITDA Calculation
                  </MDTypography>
                </MDBox>
                
                <MDBox>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Base EBITDA:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#F9FAFB' }}>
                      {formatCurrency(baseEbitda || 0)}
                    </Typography>
                  </MDBox>
                  
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Owner Compensation:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#F9FAFB' }}>
                      {formatCurrency(parseFloat(watchedValues.ownerSalary || "0"))}
                    </Typography>
                  </MDBox>
                  
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Personal Expenses:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#F9FAFB' }}>
                      {formatCurrency(parseFloat(watchedValues.personalExpenses || "0"))}
                    </Typography>
                  </MDBox>
                  
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      One-Time Expenses:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#F9FAFB' }}>
                      {formatCurrency(parseFloat(watchedValues.oneTimeExpenses || "0"))}
                    </Typography>
                  </MDBox>
                  
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Other Adjustments:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#F9FAFB' }}>
                      {formatCurrency(parseFloat(watchedValues.otherAdjustments || "0"))}
                    </Typography>
                  </MDBox>
                  
                  <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.2)', margin: '12px 0' }} />
                  
                  <MDBox display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                      Adjusted EBITDA:
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                      {formatCurrency(adjustedEbitda)}
                    </Typography>
                  </MDBox>
                </MDBox>
              </Card>
            </MDBox>

            {/* Navigation Buttons */}
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDButton
                variant="outlined"
                color="dark"
                onClick={onPrev}
                sx={{
                  color: '#0b2147',
                  borderColor: '#0b2147',
                  '&:hover': {
                    backgroundColor: '#0b2147',
                    color: '#ffffff',
                  },
                }}
              >
                <ArrowLeft size={16} style={{ marginRight: '8px' }} />
                Previous
              </MDButton>

              <MDButton
                type="submit"
                variant="gradient"
                color="info"
                sx={{
                  background: 'linear-gradient(135deg, #0b2147 0%, #1a365d 100%)',
                  color: '#ffffff',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1a365d 0%, #2d4a75 100%)',
                  },
                }}
              >
                Continue
                <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </MDButton>
            </MDBox>
          </form>
        </CardContent>
      </Card>
    </MDBox>
  );
}