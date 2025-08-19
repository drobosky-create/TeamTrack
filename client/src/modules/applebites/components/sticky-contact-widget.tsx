import { useState } from 'react';
import { X, Phone, Mail, MessageCircle, Calendar } from 'lucide-react';
import { Box, Typography, IconButton, Fab, Backdrop, Card, CardContent, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const FloatingWidget = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  zIndex: 1300,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '12px',
}));

const ContactCard = styled(Card)(({ theme }) => ({
  width: '300px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: '16px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
}));

const ContactOption = styled(Button)(({ theme }) => ({
  width: '100%',
  justifyContent: 'flex-start',
  color: 'white',
  borderColor: 'rgba(255,255,255,0.3)',
  marginBottom: '8px',
  padding: '12px 16px',
  borderRadius: '12px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.5)',
  },
}));

const MainFab = styled(Fab)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  width: '60px',
  height: '60px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    transform: 'scale(1.05)',
  },
  transition: 'all 0.3s ease',
}));

interface StickyContactWidgetProps {
  className?: string;
}

export default function StickyContactWidget({ className }: StickyContactWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const contactOptions = [
    {
      icon: <Phone size={20} />,
      label: 'Call Us Now',
      action: () => window.open('tel:+19495229121', '_self'),
      description: '(949) 522-9121'
    },
    {
      icon: <Mail size={20} />,
      label: 'Send Email',
      action: () => window.open('mailto:info@applebites.ai', '_self'),
      description: 'info@applebites.ai'
    },
    {
      icon: <Calendar size={20} />,
      label: 'Schedule Consultation',
      action: () => window.open('https://api.leadconnectorhq.com/widget/bookings/applebites', '_blank'),
      description: 'Book a free call'
    },
    {
      icon: <MessageCircle size={20} />,
      label: 'Get Support',
      action: () => window.open('/assessment/free', '_self'),
      description: 'Start assessment'
    }
  ];

  return (
    <>
      <FloatingWidget className={className}>
        {isOpen && (
          <ContactCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Get in Touch
                </Typography>
                <IconButton 
                  onClick={handleClose} 
                  size="small" 
                  sx={{ color: 'white', opacity: 0.8, '&:hover': { opacity: 1 } }}
                >
                  <X size={20} />
                </IconButton>
              </Box>
              
              <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
                Ready to discover your business value? Connect with our experts now.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {contactOptions.map((option, index) => (
                  <ContactOption
                    key={index}
                    variant="outlined"
                    startIcon={option.icon}
                    onClick={option.action}
                  >
                    <Box sx={{ textAlign: 'left', width: '100%' }}>
                      <Typography variant="body2" fontWeight="600">
                        {option.label}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {option.description}
                      </Typography>
                    </Box>
                  </ContactOption>
                ))}
              </Box>
            </CardContent>
          </ContactCard>
        )}

        <MainFab onClick={handleToggle}>
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </MainFab>
      </FloatingWidget>

      {/* Backdrop for mobile */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: 1250,
          display: { xs: isOpen ? 'block' : 'none', md: 'none' }
        }}
        open={isOpen}
        onClick={handleClose}
      />
    </>
  );
}