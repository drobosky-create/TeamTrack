import { Dialog, DialogContent, Typography, Box, CircularProgress } from '@mui/material';
import { FileText, Calculator, TrendingUp } from 'lucide-react';
import MDBox from '../../../components/MD/MDBox';
import MDTypography from '../../../components/MD/MDTypography';

interface LoadingPopupProps {
  open: boolean;
  onClose?: () => void;
}

export default function LoadingPopup({ open, onClose }: LoadingPopupProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)',
          color: 'white',
          textAlign: 'center',
          p: 3
        }
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <MDBox display="flex" flexDirection="column" alignItems="center" gap={3}>
          {/* Animated Icons */}
          <MDBox position="relative" mb={2}>
            <Box
              sx={{
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)', opacity: 0.8 },
                  '50%': { transform: 'scale(1.1)', opacity: 1 },
                  '100%': { transform: 'scale(1)', opacity: 0.8 }
                }
              }}
            >
              <Calculator size={64} color="#005b8c" />
            </Box>
            
            {/* Orbiting Icons */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120px',
                height: '120px',
                animation: 'orbit 3s linear infinite',
                '@keyframes orbit': {
                  '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
                  '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' }
                }
              }}
            >
              <FileText 
                size={20} 
                color="#00718d" 
                style={{ 
                  position: 'absolute', 
                  top: '0', 
                  left: '50%', 
                  transform: 'translateX(-50%)' 
                }} 
              />
              <TrendingUp 
                size={20} 
                color="#00718d" 
                style={{ 
                  position: 'absolute', 
                  bottom: '0', 
                  left: '50%', 
                  transform: 'translateX(-50%)' 
                }} 
              />
            </Box>
          </MDBox>

          {/* Loading Progress */}
          <CircularProgress 
            size={60} 
            thickness={4}
            sx={{ 
              color: '#005b8c',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round'
              }
            }} 
          />

          {/* Title */}
          <MDTypography variant="h4" fontWeight="bold" sx={{ color: '#005b8c' }}>
            Generating Your Report
          </MDTypography>

          {/* Subtitle */}
          <MDTypography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: '400px' }}>
            Our AI is analyzing your business data and creating your professional valuation report
          </MDTypography>

          {/* Progress Steps */}
          <MDBox mt={2}>
            <MDBox display="flex" flexDirection="column" gap={1} textAlign="left">
              <MDBox display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#005b8c',
                    animation: 'blink 1.5s ease-in-out infinite',
                    '@keyframes blink': {
                      '0%, 50%': { opacity: 1 },
                      '51%, 100%': { opacity: 0.3 }
                    }
                  }}
                />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Processing financial data...
                </Typography>
              </MDBox>
              
              <MDBox display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#005b8c',
                    animation: 'blink 1.5s ease-in-out infinite 0.5s',
                    '@keyframes blink': {
                      '0%, 50%': { opacity: 1 },
                      '51%, 100%': { opacity: 0.3 }
                    }
                  }}
                />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Calculating valuation metrics...
                </Typography>
              </MDBox>
              
              <MDBox display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#005b8c',
                    animation: 'blink 1.5s ease-in-out infinite 1s',
                    '@keyframes blink': {
                      '0%, 50%': { opacity: 1 },
                      '51%, 100%': { opacity: 0.3 }
                    }
                  }}
                />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Generating professional report...
                </Typography>
              </MDBox>
            </MDBox>
          </MDBox>

          {/* Estimated Time */}
          <MDBox mt={2}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              This usually takes 5-10 seconds
            </Typography>
          </MDBox>
        </MDBox>
      </DialogContent>
    </Dialog>
  );
}