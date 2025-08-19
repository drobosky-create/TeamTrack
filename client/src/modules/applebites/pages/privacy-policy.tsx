import React from 'react';
import { Box, Typography, Container, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeaderSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)',
  color: '#FFFFFF',
  padding: theme.spacing(8, 0, 6),
  textAlign: 'center',
}));

const ContentSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(4, 0),
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: '#0A1F44',
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

export default function PrivacyPolicy() {
  return (
    <Box>
      <HeaderSection>
        <Container maxWidth="lg">
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            Your privacy is important to us. Learn how Apple Bites protects and uses your information.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, opacity: 0.7 }}>
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Typography>
        </Container>
      </HeaderSection>

      <Container maxWidth="lg">
        <ContentSection>
          <Typography variant="h4" gutterBottom sx={{ color: '#0A1F44', fontWeight: 700 }}>
            Information We Collect
          </Typography>
          
          <SectionTitle variant="h5">Business Information</SectionTitle>
          <Typography paragraph>
            When you complete a business valuation assessment, we collect:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Company financial data (revenue, EBITDA, expenses)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Industry classification and business metrics" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Operational performance indicators" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Business improvement preferences and goals" />
            </ListItem>
          </List>

          <SectionTitle variant="h5">Personal Information</SectionTitle>
          <Typography paragraph>
            To provide personalized valuations and reports, we collect:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Name, email address, and phone number" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Company name and job title" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Communication preferences" />
            </ListItem>
          </List>

          <SectionTitle variant="h5">Technical Data</SectionTitle>
          <List>
            <ListItem>
              <ListItemText primary="IP address and browser information" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Session data and authentication tokens" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Usage analytics and platform interactions" />
            </ListItem>
          </List>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h4" gutterBottom sx={{ color: '#0A1F44', fontWeight: 700 }}>
            How We Use Your Information
          </Typography>

          <SectionTitle variant="h5">Business Valuation Services</SectionTitle>
          <List>
            <ListItem>
              <ListItemText primary="Generate personalized business valuation reports" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Provide AI-powered business analysis and recommendations" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Create industry-specific benchmarking comparisons" />
            </ListItem>
          </List>

          <SectionTitle variant="h5">Communication & Support</SectionTitle>
          <List>
            <ListItem>
              <ListItemText primary="Send valuation reports via email" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Provide consultation scheduling and follow-up" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Share relevant market insights and updates" />
            </ListItem>
          </List>

          <SectionTitle variant="h5">Platform Improvement</SectionTitle>
          <List>
            <ListItem>
              <ListItemText primary="Analyze usage patterns to enhance user experience" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Improve valuation algorithms and accuracy" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Develop new features and assessment tools" />
            </ListItem>
          </List>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h4" gutterBottom sx={{ color: '#0A1F44', fontWeight: 700 }}>
            Information Sharing & Third Parties
          </Typography>

          <SectionTitle variant="h5">CRM Integration</SectionTitle>
          <Typography paragraph>
            We integrate with GoHighLevel CRM to manage leads and provide consultation services. 
            This includes sharing contact information and assessment preferences to facilitate follow-up communications.
          </Typography>

          <SectionTitle variant="h5">Email Services</SectionTitle>
          <Typography paragraph>
            We use SendGrid and Resend for email delivery of valuation reports and communications. 
            These services process email addresses solely for delivery purposes.
          </Typography>

          <SectionTitle variant="h5">AI Analysis</SectionTitle>
          <Typography paragraph>
            Business data may be processed by OpenAI services to generate insights and recommendations. 
            This data is anonymized and used only for analysis purposes.
          </Typography>

          <SectionTitle variant="h5">We Do Not Sell Your Data</SectionTitle>
          <Typography paragraph>
            Apple Bites does not sell, rent, or trade your personal or business information to third parties 
            for marketing purposes. All data sharing is limited to essential service providers.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h4" gutterBottom sx={{ color: '#0A1F44', fontWeight: 700 }}>
            Data Security & Storage
          </Typography>

          <SectionTitle variant="h5">Security Measures</SectionTitle>
          <List>
            <ListItem>
              <ListItemText primary="Encrypted data transmission (HTTPS/TLS)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Secure database storage with access controls" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Regular security audits and updates" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Password hashing and secure authentication" />
            </ListItem>
          </List>

          <SectionTitle variant="h5">Data Retention</SectionTitle>
          <Typography paragraph>
            We retain your assessment data and reports for as long as you maintain an active account. 
            You may request data deletion at any time by contacting us at privacy@applebites.ai.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h4" gutterBottom sx={{ color: '#0A1F44', fontWeight: 700 }}>
            Your Rights & Choices
          </Typography>

          <List>
            <ListItem>
              <ListItemText 
                primary="Access Your Data" 
                secondary="Request a copy of all personal and business information we have collected" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Update Information" 
                secondary="Modify your profile, contact details, and communication preferences" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Delete Account" 
                secondary="Request complete removal of your account and associated data" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Opt-Out Communications" 
                secondary="Unsubscribe from marketing emails while maintaining service communications" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Data Portability" 
                secondary="Export your valuation reports and assessment data in standard formats" 
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h4" gutterBottom sx={{ color: '#0A1F44', fontWeight: 700 }}>
            Cookies & Tracking
          </Typography>

          <SectionTitle variant="h5">Essential Cookies</SectionTitle>
          <Typography paragraph>
            Required for authentication, session management, and core platform functionality.
          </Typography>

          <SectionTitle variant="h5">Analytics Cookies</SectionTitle>
          <Typography paragraph>
            Help us understand user behavior and improve our valuation tools. You can decline these 
            cookies without affecting core functionality.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h4" gutterBottom sx={{ color: '#0A1F44', fontWeight: 700 }}>
            Contact Information
          </Typography>

          <Typography paragraph>
            For privacy-related questions, data requests, or concerns, contact us:
          </Typography>

          <Box sx={{ 
            background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)', 
            p: 3, 
            borderRadius: 2, 
            mt: 2 
          }}>
            <Typography variant="body1" gutterBottom>
              <strong>Apple Bites Privacy Team</strong>
            </Typography>
            <Typography variant="body2" gutterBottom>
              Email: privacy@applebites.ai
            </Typography>
            <Typography variant="body2" gutterBottom>
              Response Time: Within 48 hours
            </Typography>
            <Typography variant="body2">
              Address: Available upon request for legal compliance purposes
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ mt: 4, fontStyle: 'italic', color: '#6B7280' }}>
            This privacy policy may be updated periodically. Significant changes will be communicated 
            via email to registered users. Continued use of Apple Bites constitutes acceptance of any updates.
          </Typography>
        </ContentSection>
      </Container>
    </Box>
  );
}