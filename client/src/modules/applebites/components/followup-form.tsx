import { UseFormReturn } from "react-hook-form";
import { FollowUpData } from "@shared/schema";
import { Typography, Card, CardContent, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material';
import { ArrowLeft, Send, MessageSquare } from "lucide-react";
import MDBox from "../../../components/MD/MDBox";
import MDTypography from "../../../components/MD/MDTypography";
import MDButton from "../../../components/MD/MDButton";

interface FollowUpFormProps {
  form: UseFormReturn<FollowUpData>;
  onSubmit: () => void;
  onPrev: () => void;
  onDataChange: (data: FollowUpData) => void;
  isSubmitting: boolean;
}

export default function FollowUpForm({ form, onSubmit, onPrev, onDataChange, isSubmitting }: FollowUpFormProps) {
  const watchedValues = form.watch();

  const handleSubmit = (data: FollowUpData) => {
    onDataChange(data);
    onSubmit();
    // Scroll to top when generating report
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleFieldChange = (fieldName: keyof FollowUpData, value: string) => {
    form.setValue(fieldName, value);
    onDataChange(form.getValues());
  };

  return (
    <MDBox>
      {/* Executive Header Section */}
      <MDBox mb={2} display="flex" alignItems="center">
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
          <MessageSquare style={{ color: '#ffffff', fontSize: 28 }} />
        </MDBox>

        <MDBox>
          <MDTypography variant="h4" fontWeight="bold" color="dark" mb={1}>
            Follow-up Preferences
          </MDTypography>
          <MDTypography variant="body1" color="text">
            Let us know how you'd like to proceed after receiving your valuation report.
          </MDTypography>
        </MDBox>
      </MDBox>

      {/* Form Container */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <CardContent sx={{ p: 3 }}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {/* Follow-up Options Section */}
            <MDBox mb={3}>
              <MDTypography variant="h6" fontWeight="medium" color="dark" mb={2}>
                Consultation Preferences
              </MDTypography>
              
              <MDBox mb={3}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ color: '#0A1F44', fontWeight: 'medium', mb: 2 }}>
                    Would you like to discuss your valuation results with one of our experts?
                  </FormLabel>
                  <RadioGroup
                    value={watchedValues.followUpIntent || ""}
                    onChange={(e) => handleFieldChange("followUpIntent", e.target.value)}
                  >
                    <Card sx={{ mb: 2, border: watchedValues.followUpIntent === "yes" ? '2px solid #0A1F44' : '1px solid #E0E0E0' }}>
                      <CardContent sx={{ p: 2 }}>
                        <FormControlLabel
                          value="yes"
                          control={<Radio sx={{ color: '#0A1F44', '&.Mui-checked': { color: '#0A1F44' } }} />}
                          label={
                            <MDBox>
                              <MDTypography variant="subtitle1" fontWeight="medium" color="dark">
                                Yes, schedule a consultation
                              </MDTypography>
                              <Typography variant="body2" color="textSecondary">
                                I'd like to discuss the results and explore options for improving my business value or preparing for a potential sale.
                              </Typography>
                            </MDBox>
                          }
                        />
                      </CardContent>
                    </Card>

                    <Card sx={{ mb: 2, border: watchedValues.followUpIntent === "maybe" ? '2px solid #0A1F44' : '1px solid #E0E0E0' }}>
                      <CardContent sx={{ p: 2 }}>
                        <FormControlLabel
                          value="maybe"
                          control={<Radio sx={{ color: '#0A1F44', '&.Mui-checked': { color: '#0A1F44' } }} />}
                          label={
                            <MDBox>
                              <MDTypography variant="subtitle1" fontWeight="medium" color="dark">
                                Maybe later
                              </MDTypography>
                              <Typography variant="body2" color="textSecondary">
                                I'd like to review the report first and may be interested in follow-up services in the future.
                              </Typography>
                            </MDBox>
                          }
                        />
                      </CardContent>
                    </Card>

                    <Card sx={{ mb: 2, border: watchedValues.followUpIntent === "no" ? '2px solid #0A1F44' : '1px solid #E0E0E0' }}>
                      <CardContent sx={{ p: 2 }}>
                        <FormControlLabel
                          value="no"
                          control={<Radio sx={{ color: '#0A1F44', '&.Mui-checked': { color: '#0A1F44' } }} />}
                          label={
                            <MDBox>
                              <MDTypography variant="subtitle1" fontWeight="medium" color="dark">
                                No, just the report
                              </MDTypography>
                              <Typography variant="body2" color="textSecondary">
                                I only need the valuation report at this time.
                              </Typography>
                            </MDBox>
                          }
                        />
                      </CardContent>
                    </Card>
                  </RadioGroup>
                </FormControl>
              </MDBox>

              {/* Timeline Section - Only show if they want consultation */}
              {watchedValues.followUpIntent === "yes" && (
                <MDBox mb={3}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend" sx={{ color: '#0A1F44', fontWeight: 'medium', mb: 2 }}>
                      When would you prefer to schedule this consultation?
                    </FormLabel>
                    <RadioGroup
                      value={watchedValues.timeline || ""}
                      onChange={(e) => handleFieldChange("timeline", e.target.value)}
                    >
                      <FormControlLabel
                        value="immediately"
                        control={<Radio sx={{ color: '#0A1F44', '&.Mui-checked': { color: '#0A1F44' } }} />}
                        label="Within the next few days"
                      />
                      <FormControlLabel
                        value="week"
                        control={<Radio sx={{ color: '#0A1F44', '&.Mui-checked': { color: '#0A1F44' } }} />}
                        label="Within the next week"
                      />
                      <FormControlLabel
                        value="month"
                        control={<Radio sx={{ color: '#0A1F44', '&.Mui-checked': { color: '#0A1F44' } }} />}
                        label="Within the next month"
                      />
                      <FormControlLabel
                        value="flexible"
                        control={<Radio sx={{ color: '#0A1F44', '&.Mui-checked': { color: '#0A1F44' } }} />}
                        label="I'm flexible with timing"
                      />
                    </RadioGroup>
                  </FormControl>
                </MDBox>
              )}

              {/* Additional Comments Section */}
              <MDBox mb={3}>
                <TextField
                  label="Additional Comments (Optional)"
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  {...form.register("additionalComments")}
                  onChange={(e) => {
                    form.setValue("additionalComments", e.target.value);
                    onDataChange(form.getValues());
                  }}
                  helperText="Any specific questions or areas you'd like to focus on during the consultation"
                  placeholder="What specific aspects of your business valuation would you like to discuss?"
                />
              </MDBox>
            </MDBox>

            {/* Submit Summary Card */}
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
                    Ready to Generate Report
                  </MDTypography>
                </MDBox>
                
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                  Your comprehensive business valuation report will include:
                </Typography>
                
                <MDBox sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>• Detailed EBITDA calculation and adjustments</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• Value driver analysis and scoring</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• Business valuation range estimate</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>• Recommendations for value improvement</Typography>
                  <Typography variant="body2">• Follow-up consultation scheduling (if requested)</Typography>
                </MDBox>
              </Card>
            </MDBox>

            {/* Navigation Buttons */}
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDButton
                variant="outlined"
                color="dark"
                onClick={onPrev}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                sx={{
                  background: isSubmitting 
                    ? 'linear-gradient(135deg, #666666 0%, #888888 100%)' 
                    : 'linear-gradient(135deg, #0b2147 0%, #1a365d 100%)',
                  color: '#ffffff',
                  minWidth: '160px',
                  '&:hover': {
                    background: isSubmitting 
                      ? 'linear-gradient(135deg, #666666 0%, #888888 100%)'
                      : 'linear-gradient(135deg, #1a365d 0%, #2d4a75 100%)',
                  },
                }}
              >
                {isSubmitting ? (
                  <>Generating Report...</>
                ) : (
                  <>
                    Generate Report
                    <Send size={16} style={{ marginLeft: '8px' }} />
                  </>
                )}
              </MDButton>
            </MDBox>
          </form>
        </CardContent>
      </Card>
    </MDBox>
  );
}