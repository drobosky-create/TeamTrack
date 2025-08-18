import React from 'react';
import { Box, Typography, Container, Paper, List, ListItem, ListItemText, Divider, Alert } from '@mui/material';
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

export default function TermsOfUse() {
  return (
    <Box>
      <HeaderSection>
        <Container maxWidth="lg">
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Terms of Use
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            Please review these terms before using Apple Bites business valuation services.
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
          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="body2">
              By accessing and using Apple Bites, you agree to be bound by these Terms of Use. 
              If you do not agree to these terms, please do not use our services.
            </Typography>
          </Alert>

          <Typography variant="h4" gutterBottom sx={{ color: '#0A1F44', fontWeight: 700 }}>
            Service Overview
          </Typography>
          
          <Typography paragraph>
            Apple Bites provides AI-powered business valuation assessments and analysis tools designed to help 
            business owners understand their company's estimated value and identify improvement opportunities. 
            Our platform offers both free and premium tier assessments with varying levels of detail and features.
          </Typography>

          <SectionTitle variant="h5">What We Provide</SectionTitle>
          <List>
            <ListItem>
              <ListItemText primary="Interactive business valuation assessments" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Industry-specific multiplier analysis using NAICS classifications" />
            </ListItem>
            <ListItem>
              <ListItemText primary="AI-generated business insights and recommendations" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Professional PDF valuation reports" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Consultation scheduling and follow-up services" />
            </ListItem>
          </List>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h4" gutterBottom sx={{ color: '#0A1F44', fontWeight: 700 }}>
            Important Disclaimers
          </Typography>

          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Educational Tool Only - Not Professional Valuation Advice
            </Typography>
            <Typography variant="body2">
              Apple Bites provides educational business analysis tools and estimated valuations based on 
              standardized methodologies. Our assessments are NOT formal business appraisals and should 
              not be used for legal, tax, investment, or transaction purposes without professional validation.
            </Typography>
          </Alert>

          <SectionTitle variant="h5">Valuation Accuracy & Limitations</SectionTitle>
          <List>
            <ListItem>
              <ListItemText 
                primary="Estimates Only" 
                secondary="All valuations are estimates based on industry averages and user-provided data" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="No Guarantee of Accuracy" 
                secondary="Actual business values may vary significantly from our assessments" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Market Conditions" 
                secondary="Valuations do not account for current market conditions, buyer availability, or specific circumstances" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Professional Review Recommended" 
                secondary="Consult qualified business appraisers, CPAs, or M&A professionals for formal valuations" 
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h4" gutterBottom sx={{ color: '#0A1F44', fontWeight: 700 }}>
            User Responsibilities
          </Typography>

          <SectionTitle variant="h5">Account Security</SectionTitle>
          <List>
            <ListItem>
              <ListItemText primary="Maintain confidentiality of login credentials" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Use secure passwords and enable two-factor authentication when available" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Notify us immediately of any unauthorized account access" />
            </ListItem>
          </List>

          <SectionTitle variant="h5">Data Accuracy</SectionTitle>
          <List>
            <ListItem>
              <ListItemText primary="Provide accurate and truthful business information" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Update financial data to reflect current business performance" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Understand that inaccurate data leads to unreliable valuations" />
            </ListItem>
          </List>

          <SectionTitle variant="h5">Acceptable Use</SectionTitle>
          <List>
            <ListItem>
              <ListItemText primary="Use services only for legitimate business analysis purposes" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Do not attempt to reverse engineer or duplicate our valuation algorithms" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Respect intellectual property rights of all platform content" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Do not share account access with unauthorized individuals" />
            </ListItem>
          </List>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h4" gutterBottom sx={{ color: '#0A1F44', fontWeight: 700 }}>
            Service Tiers & Access
          </Typography>

          <SectionTitle variant="h5">Free Tier</SectionTitle>
          <Typography paragraph>
            Provides basic business valuation assessments using general industry multipliers. 
            Limited to standard reports and basic recommendations.
          </Typography>

          <SectionTitle variant="h5">Growth Tier ($795)</SectionTitle>
          <Typography paragraph>
            Includes industry-specific NAICS-based valuations, comprehensive AI analysis, 
            enhanced reporting, and consultation scheduling access.
          </Typography>

          <SectionTitle variant="h5">Capital Tier</SectionTitle>
          <Typography paragraph>
            Premium tier with advanced features, detailed market analysis, and priority support 
            for businesses seeking investment or acquisition preparation.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h4" gutterBottom sx={{ color: '#0A1F44', fontWeight: 700 }}>
            Payment & Billing
          </Typography>

          <SectionTitle variant="h5">Payment Processing</SectionTitle>
          <List>
            <ListItem>
              <ListItemText primary="Payments processed through secure third-party providers" />
            </ListItem>
            <ListItem>
              <ListItemText primary="All fees are non-refundable unless required by law" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Prices subject to change with advance notice" />
            </ListItem>
          </List>

          <SectionTitle variant="h5">Subscription Terms</SectionTitle>
          <Typography paragraph>
            Premium tier subscriptions automatically renew unless cancelled. You may cancel at any time 
            through your account settings or by contacting support.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h4" gutterBottom sx={{ color: '#0A1F44', fontWeight: 700 }}>
            Intellectual Property
          </Typography>

          <SectionTitle variant="h5">Apple Bites Content</SectionTitle>
          <Typography paragraph>
            All platform content, including algorithms, reports, designs, and analysis methodologies, 
            are proprietary to Apple Bites and protected by intellectual property laws.
          </Typography>

          <SectionTitle variant="h5">User Data Rights</SectionTitle>
          <Typography paragraph>
            You retain ownership of business data you provide. We obtain limited rights to process 
            this data solely for providing valuation services and platform improvements.
          </Typography>

          <SectionTitle variant="h5">Report Usage</SectionTitle>
          <Typography paragraph>
            Generated valuation reports may be used for internal business planning. Commercial 
            redistribution or resale of reports is prohibited without written permission.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h4" gutterBottom sx={{ color: '#0A1F44', fontWeight: 700 }}>
            Limitation of Liability
          </Typography>

          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              No Liability for Business Decisions
            </Typography>
            <Typography variant="body2">
              Apple Bites is not responsible for business decisions made based on our assessments. 
              Users assume full responsibility for evaluating and acting upon valuation information.
            </Typography>
          </Alert>

          <SectionTitle variant="h5">Service Limitations</SectionTitle>
          <List>
            <ListItem>
              <ListItemText 
                primary="Platform Availability" 
                secondary="We do not guarantee uninterrupted service access or data availability" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Technical Issues" 
                secondary="Not liable for losses due to technical problems, outages, or data corruption" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Third-Party Integration" 
                secondary="Not responsible for issues with external services (CRM, email providers, etc.)" 
              />
            </ListItem>
          </List>

          <SectionTitle variant="h5">Maximum Liability</SectionTitle>
          <Typography paragraph>
            In any case, our total liability is limited to the amount paid for services in the 
            12 months preceding the claim, not to exceed $1,000.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h4" gutterBottom sx={{ color: '#0A1F44', fontWeight: 700 }}>
            Termination
          </Typography>

          <SectionTitle variant="h5">By You</SectionTitle>
          <Typography paragraph>
            You may terminate your account at any time through account settings or by contacting support. 
            Termination does not entitle you to refunds of fees already paid.
          </Typography>

          <SectionTitle variant="h5">By Apple Bites</SectionTitle>
          <Typography paragraph>
            We may terminate accounts for violation of these terms, fraudulent activity, or 
            non-payment of fees. We will provide reasonable notice when possible.
          </Typography>

          <SectionTitle variant="h5">Effect of Termination</SectionTitle>
          <Typography paragraph>
            Upon termination, access to platform services ends immediately. You may request 
            export of your data within 30 days of termination.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h4" gutterBottom sx={{ color: '#0A1F44', fontWeight: 700 }}>
            Governing Law & Disputes
          </Typography>

          <Typography paragraph>
            These terms are governed by the laws of the State of Delaware, United States. 
            Any disputes will be resolved through binding arbitration in accordance with 
            the American Arbitration Association rules.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h4" gutterBottom sx={{ color: '#0A1F44', fontWeight: 700 }}>
            Contact Information
          </Typography>

          <Typography paragraph>
            Questions about these Terms of Use? Contact us:
          </Typography>

          <Box sx={{ 
            background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)', 
            p: 3, 
            borderRadius: 2, 
            mt: 2 
          }}>
            <Typography variant="body1" gutterBottom>
              <strong>Apple Bites Legal Team</strong>
            </Typography>
            <Typography variant="body2" gutterBottom>
              Email: legal@applebites.ai
            </Typography>
            <Typography variant="body2" gutterBottom>
              Support: support@applebites.ai
            </Typography>
            <Typography variant="body2">
              Response Time: Within 48 hours for legal inquiries
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ mt: 4, fontStyle: 'italic', color: '#6B7280' }}>
            These terms may be updated periodically to reflect changes in our services or legal requirements. 
            Significant changes will be communicated via email. Continued use constitutes acceptance of updates.
          </Typography>
        </ContentSection>
      </Container>
    </Box>
  );
}