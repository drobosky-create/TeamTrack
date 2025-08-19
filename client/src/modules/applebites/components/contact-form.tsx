import { UseFormReturn } from "react-hook-form";
import { ContactInfo } from "@shared/schema";
import { 
  Typography, 
  TextField, 
  Box, 
  Grid
} from '@mui/material';
import { ArrowRight, User } from "lucide-react";
import MDBox from "../../../components/MD/MDBox";
import MDTypography from "../../../components/MD/MDTypography";
import MDButton from "../../../components/MD/MDButton";

interface ContactFormProps {
  form: UseFormReturn<ContactInfo>;
  onNext: () => void;
  onDataChange: (data: ContactInfo) => void;
}

export default function ContactForm({ form, onNext, onDataChange }: ContactFormProps) {
  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = (data: ContactInfo) => {
    onDataChange(data);
    onNext();
  };

  return (
    <MDBox>
      {/* Executive Header Section */}
      <MDBox display="flex" alignItems="center" mb={4}>
        <MDBox mr={3}>
          <MDBox 
            width="48px" 
            height="48px" 
            borderRadius="50%" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            sx={{ 
              background: 'linear-gradient(135deg, #00718d 0%, #005b8c 100%)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
          >
            <User size={24} color="white" />
          </MDBox>
        </MDBox>
        <MDBox>
          <MDTypography variant="h3" fontWeight="bold" color="dark" mb={1} sx={{ fontSize: '28px' }}>
            Contact Information
          </MDTypography>
          <MDTypography variant="body1" color="text" sx={{ opacity: 0.8 }}>
            Please provide your contact details to begin the comprehensive valuation assessment.
          </MDTypography>
        </MDBox>
      </MDBox>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Personal Information Section */}
        <MDBox mb={4}>
          <MDTypography variant="h5" fontWeight="bold" color="dark" mb={3} sx={{ fontSize: '20px' }}>
            Personal Information
          </MDTypography>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <MDBox>
                <MDTypography variant="body1" fontWeight="medium" color="dark" mb={1} sx={{ fontSize: '16px' }}>
                  First Name <span style={{ color: '#f44336' }}>*</span>
                </MDTypography>
                <TextField
                  {...register('firstName', { required: 'First name is required' })}
                  fullWidth
                  placeholder="Enter your first name"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  variant="outlined"
                  size="medium"
                />
              </MDBox>
            </Grid>

            <Grid item xs={12} md={6}>
              <MDBox>
                <MDTypography variant="body1" fontWeight="medium" color="dark" mb={1} sx={{ fontSize: '16px' }}>
                  Last Name <span style={{ color: '#f44336' }}>*</span>
                </MDTypography>
                <TextField
                  {...register('lastName', { required: 'Last name is required' })}
                  fullWidth
                  placeholder="Enter your last name"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  variant="outlined"
                  size="medium"
                />
              </MDBox>
            </Grid>
          </Grid>

          {/* Email and Phone Fields */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <MDBox>
                <MDTypography variant="body1" fontWeight="medium" color="dark" mb={1} sx={{ fontSize: '16px' }}>
                  Email Address <span style={{ color: '#f44336' }}>*</span>
                </MDTypography>
                <TextField
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  fullWidth
                  type="email"
                  placeholder="Enter your email address"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  variant="outlined"
                  size="medium"
                />
              </MDBox>
            </Grid>

            <Grid item xs={12} md={6}>
              <MDBox>
                <MDTypography variant="body1" fontWeight="medium" color="dark" mb={1} sx={{ fontSize: '16px' }}>
                  Phone Number
                </MDTypography>
                <TextField
                  {...register('phone')}
                  fullWidth
                  placeholder="Enter your phone number"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  variant="outlined"
                  size="medium"
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {/* Business Information Section */}
        <MDBox mb={4}>
          <MDTypography variant="h5" fontWeight="bold" color="dark" mb={3} sx={{ fontSize: '20px' }}>
            Business Information
          </MDTypography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <MDBox>
                <MDTypography variant="body1" fontWeight="medium" color="dark" mb={1} sx={{ fontSize: '16px' }}>
                  Company Name <span style={{ color: '#f44336' }}>*</span>
                </MDTypography>
                <TextField
                  {...register('company', { required: 'Company name is required' })}
                  fullWidth
                  placeholder="Enter your company name"
                  error={!!errors.company}
                  helperText={errors.company?.message}
                  variant="outlined"
                  size="medium"
                />
              </MDBox>
            </Grid>

            <Grid item xs={12} md={6}>
              <MDBox>
                <MDTypography variant="body1" fontWeight="medium" color="dark" mb={1} sx={{ fontSize: '16px' }}>
                  Job Title
                </MDTypography>
                <TextField
                  {...register('jobTitle')}
                  fullWidth
                  placeholder="Enter your job title"
                  error={!!errors.jobTitle}
                  helperText={errors.jobTitle?.message}
                  variant="outlined"
                  size="medium"
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {/* Action Buttons */}
        <MDBox display="flex" justifyContent="flex-end" mt={4}>
          <MDButton
            type="submit"
            variant="gradient"
            color="primary"
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #0b2147 0%, #1a365d 100%)',
              minWidth: '140px',
              height: '48px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '8px',
              '&:hover': {
                background: 'linear-gradient(135deg, #1a365d 0%, #2d5aa0 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(11, 33, 71, 0.4)'
              }
            }}
          >
            Continue
            <ArrowRight size={20} style={{ marginLeft: '8px' }} />
          </MDButton>
        </MDBox>
      </form>
    </MDBox>
  );
}