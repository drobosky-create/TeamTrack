import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Chip,
  Divider,

} from '@mui/material';
import { 
  Phone as PhoneIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  BusinessCenter as BusinessIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

export default function FollowUpOptionsPage() {
  const [consultationInterest, setConsultationInterest] = useState('yes');
  const [contactPreference, setContactPreference] = useState('email');
  const [preferredTime, setPreferredTime] = useState('');
  const [specificInterests, setSpecificInterests] = useState<string[]>(['Growth strategies']);
  const [message, setMessage] = useState('');

  const interestOptions = [
    'Growth strategies',
    'Exit planning',
    'Valuation improvement',
    'Operational efficiency',
    'Financial optimization',
    'Market expansion',
    'Strategic partnerships',
    'Technology upgrades'
  ];

  const handleInterestToggle = (interest: string) => {
    setSpecificInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = () => {
    // In real app, this would submit follow-up preferences
    alert('Follow-up preferences saved! Our team will contact you soon.');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 2 }}>
        Follow-Up Options
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: '#6B7280' }}>
        Help us understand how you'd like to proceed with your business assessment results.
      </Typography>

      {/* Consultation Interest */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Consultation Interest
          </Typography>
          
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ mb: 2 }}>
              Are you interested in scheduling a consultation to discuss your results?
            </FormLabel>
            <RadioGroup
              value={consultationInterest}
              onChange={(e) => setConsultationInterest(e.target.value)}
            >
              <FormControlLabel 
                value="yes" 
                control={<Radio />} 
                label="Yes, I'd like to schedule a consultation" 
              />
              <FormControlLabel 
                value="maybe" 
                control={<Radio />} 
                label="Maybe, please send me more information first" 
              />
              <FormControlLabel 
                value="no" 
                control={<Radio />} 
                label="No, I'm satisfied with the assessment report" 
              />
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>

      {(consultationInterest === 'yes' || consultationInterest === 'maybe') && (
        <>
          {/* Contact Preferences */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Contact Preferences
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: 300 }}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend" sx={{ mb: 2 }}>
                      How would you prefer to be contacted?
                    </FormLabel>
                    <RadioGroup
                      value={contactPreference}
                      onChange={(e) => setContactPreference(e.target.value)}
                    >
                      <FormControlLabel 
                        value="email" 
                        control={<Radio />} 
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon sx={{ color: '#667eea' }} />
                            Email
                          </Box>
                        }
                      />
                      <FormControlLabel 
                        value="phone" 
                        control={<Radio />} 
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon sx={{ color: '#10B981' }} />
                            Phone call
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
                
                <Box sx={{ flex: 1, minWidth: 300 }}>
                  <TextField
                    fullWidth
                    label="Preferred Time"
                    placeholder="e.g., Weekday mornings, Tuesday afternoons"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    multiline
                    rows={3}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Specific Interests */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Areas of Interest
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 3, color: '#6B7280' }}>
                Select the topics you'd most like to discuss (choose all that apply):
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {interestOptions.map((interest) => (
                  <Chip
                    key={interest}
                    label={interest}
                    clickable
                    color={specificInterests.includes(interest) ? 'primary' : 'default'}
                    onClick={() => handleInterestToggle(interest)}
                    sx={{
                      '&:hover': {
                        backgroundColor: specificInterests.includes(interest) 
                          ? 'primary.dark' 
                          : 'action.hover'
                      }
                    }}
                  />
                ))}
              </Box>
              
              <TextField
                fullWidth
                label="Additional Comments"
                placeholder="Any specific questions or topics you'd like to discuss..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                multiline
                rows={4}
              />
            </CardContent>
          </Card>
        </>
      )}

      {/* Next Steps Based on Selection */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            What Happens Next
          </Typography>
          
          {consultationInterest === 'yes' && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
                Great! Here's what to expect:
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                <li>Our team will contact you within 1-2 business days</li>
                <li>We'll schedule a 30-45 minute consultation at your convenience</li>
                <li>We'll prepare customized recommendations based on your assessment</li>
                <li>You'll receive actionable strategies to improve your business value</li>
              </Box>
            </Alert>
          )}
          
          {consultationInterest === 'maybe' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
                We'll send you additional information:
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                <li>Detailed case studies from similar businesses</li>
                <li>Information about our consulting services</li>
                <li>Resources for implementing the recommendations</li>
                <li>No pressure - you can schedule when you're ready</li>
              </Box>
            </Alert>
          )}
          
          {consultationInterest === 'no' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
                Thank you for using our assessment tool!
              </Typography>
              <Typography>
                You'll receive your PDF report via email. Feel free to reach out anytime if you 
                have questions or would like to discuss your results in the future.
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          sx={{
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            px: 4
          }}
        >
          Save Preferences
        </Button>
        
        {consultationInterest === 'yes' && (
          <Button
            variant="contained"
            startIcon={<ScheduleIcon />}
            size="large"
            sx={{
              background: 'linear-gradient(45deg, #10B981 30%, #059669 90%)',
              px: 4
            }}
          >
            Schedule Now
          </Button>
        )}
        
        <Button
          variant="outlined"
          size="large"
          sx={{ px: 4 }}
          onClick={() => window.history.back()}
        >
          Back to Results
        </Button>
      </Box>

      {/* Upgrade Options */}
      <Card sx={{ mt: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Want More Detailed Analysis?
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center', flex: 1, minWidth: 200 }}>
              <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Growth Assessment
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                $795 - Industry-specific analysis
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1, minWidth: 200 }}>
              <BusinessIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Capital Assessment
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                $2,500 - Full capital readiness
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1, minWidth: 200 }}>
              <AssessmentIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Custom Analysis
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Tailored to your needs
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'white',
                color: '#667eea',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#f8f9fa'
                }
              }}
            >
              Learn About Upgrades
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}