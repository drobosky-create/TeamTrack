import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  Payment as PaymentIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Receipt as ReceiptIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';

// Master Card Component
const MasterCard: React.FC<{
  number: number;
  holder: string;
  expires: string;
}> = ({ number, holder, expires }) => {
  const formatCardNumber = (num: number) => {
    const str = num.toString();
    return str.replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <Card sx={{
      background: 'linear-gradient(195deg, #42424a, #191919)',
      color: 'white',
      borderRadius: 3,
      p: 3,
      height: 200,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
        <Box sx={{
          width: 50,
          height: 30,
          borderRadius: 1,
          background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
            VISA
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ fontFamily: 'monospace', mb: 2 }}>
          {formatCardNumber(number)}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Card Holder
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
              {holder}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Expires
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {expires}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

// Default Info Card Component
const DefaultInfoCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  value: string;
}> = ({ icon, title, description, value }) => {
  const getIcon = () => {
    switch (icon) {
      case 'account_balance': return <AccountBalanceIcon />;
      case 'paypal': return <PaymentIcon />;
      default: return <AttachMoneyIcon />;
    }
  };

  return (
    <Card sx={{ 
      height: '100%', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
      borderRadius: 3,
      display: 'flex',
      alignItems: 'center',
      p: 3
    }}>
      <Box sx={{
        backgroundColor: '#e8f5e8',
        borderRadius: '50%',
        p: 2,
        mr: 3,
        color: '#4caf50'
      }}>
        {getIcon()}
      </Box>
      
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#344767', mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: '#7b809a', textTransform: 'capitalize' }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: '#7b809a' }}>
          {description}
        </Typography>
      </Box>
    </Card>
  );
};

// Payment Method Component
const PaymentMethod: React.FC = () => {
  const paymentMethods = [
    { type: 'Visa', number: '****4242', expires: '12/24', isDefault: true },
    { type: 'Mastercard', number: '****5555', expires: '06/25', isDefault: false },
    { type: 'PayPal', number: 'user@example.com', expires: '', isDefault: false }
  ];

  return (
    <Card sx={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#344767' }}>
            Payment Methods
          </Typography>
          <Button 
            variant="contained" 
            sx={{ 
              backgroundColor: '#4caf50', 
              '&:hover': { backgroundColor: '#43a047' },
              textTransform: 'none'
            }}
          >
            Add New Card
          </Button>
        </Box>

        <List sx={{ p: 0 }}>
          {paymentMethods.map((method, index) => (
            <ListItem key={index} sx={{ 
              border: '1px solid #e9ecef', 
              borderRadius: 2, 
              mb: 1,
              backgroundColor: '#fafafa'
            }}>
              <ListItemIcon>
                <CreditCardIcon sx={{ color: '#344767' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#344767' }}>
                      {method.type} {method.number}
                    </Typography>
                    {method.isDefault && (
                      <Chip label="Default" size="small" sx={{ backgroundColor: '#e8f5e8', color: '#4caf50' }} />
                    )}
                  </Box>
                }
                secondary={method.expires && `Expires ${method.expires}`}
              />
              <IconButton size="small">
                <EditIcon />
              </IconButton>
              <IconButton size="small">
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

// Transactions Component
const Transactions: React.FC = () => {
  const transactions = [
    { date: '2024-01-15', description: 'Premium Plan - Monthly', amount: '$29.00', status: 'completed' },
    { date: '2023-12-15', description: 'Premium Plan - Monthly', amount: '$29.00', status: 'completed' },
    { date: '2023-11-15', description: 'Premium Plan - Monthly', amount: '$29.00', status: 'completed' },
    { date: '2023-10-15', description: 'Setup Fee', amount: '$50.00', status: 'completed' }
  ];

  return (
    <Card sx={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#344767', mb: 3 }}>
          Recent Transactions
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#344767' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#344767' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#344767' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#344767' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: '#7b809a' }}>{transaction.date}</TableCell>
                  <TableCell sx={{ color: '#344767', fontWeight: 500 }}>{transaction.description}</TableCell>
                  <TableCell sx={{ color: '#344767', fontWeight: 600 }}>{transaction.amount}</TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.status} 
                      size="small" 
                      sx={{ 
                        backgroundColor: '#e8f5e8', 
                        color: '#4caf50',
                        textTransform: 'capitalize'
                      }} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

// Billing Information Component
const BillingInformation: React.FC = () => {
  const billingInfo = {
    companyName: 'PerformanceHub Inc.',
    email: 'billing@performancehub.com',
    vatNumber: 'VAT-123456789',
    address: '123 Business Street, Suite 100',
    city: 'San Francisco, CA 94102',
    country: 'United States'
  };

  return (
    <Card sx={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#344767' }}>
            Billing Information
          </Typography>
          <IconButton>
            <EditIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#344767' }}>
              Company Name
            </Typography>
            <Typography variant="body2" sx={{ color: '#7b809a' }}>
              {billingInfo.companyName}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#344767' }}>
              Email Address
            </Typography>
            <Typography variant="body2" sx={{ color: '#7b809a' }}>
              {billingInfo.email}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#344767' }}>
              VAT Number
            </Typography>
            <Typography variant="body2" sx={{ color: '#7b809a' }}>
              {billingInfo.vatNumber}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#344767' }}>
              Address
            </Typography>
            <Typography variant="body2" sx={{ color: '#7b809a' }}>
              {billingInfo.address}
            </Typography>
            <Typography variant="body2" sx={{ color: '#7b809a' }}>
              {billingInfo.city}
            </Typography>
            <Typography variant="body2" sx={{ color: '#7b809a' }}>
              {billingInfo.country}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Invoices Component
const Invoices: React.FC = () => {
  const invoices = [
    { number: 'INV-2024-001', date: '2024-01-15', amount: '$29.00', status: 'paid' },
    { number: 'INV-2023-012', date: '2023-12-15', amount: '$29.00', status: 'paid' },
    { number: 'INV-2023-011', date: '2023-11-15', amount: '$29.00', status: 'paid' }
  ];

  return (
    <Card sx={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#344767', mb: 3 }}>
          Invoices
        </Typography>

        <List sx={{ p: 0 }}>
          {invoices.map((invoice, index) => (
            <ListItem key={index} sx={{ 
              border: '1px solid #e9ecef', 
              borderRadius: 2, 
              mb: 1,
              backgroundColor: '#fafafa'
            }}>
              <ListItemIcon>
                <ReceiptIcon sx={{ color: '#344767' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#344767' }}>
                    {invoice.number}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography variant="caption" sx={{ color: '#7b809a' }}>
                      {invoice.date}
                    </Typography>
                    <br />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#344767' }}>
                      {invoice.amount}
                    </Typography>
                  </Box>
                }
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  label={invoice.status} 
                  size="small" 
                  sx={{ 
                    backgroundColor: '#e8f5e8', 
                    color: '#4caf50',
                    textTransform: 'capitalize'
                  }} 
                />
                <IconButton size="small">
                  <DownloadIcon />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default function Billing() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, color: '#344767', fontWeight: 'bold' }}>
        Billing & Subscription
      </Typography>

      <Grid container spacing={3}>
        {/* Top Section */}
        <Grid xs={12} lg={8}>
          <Grid container spacing={3}>
            <Grid xs={12} xl={6}>
              <MasterCard 
                number={4562112245947852} 
                holder="John Peterson" 
                expires="11/27" 
              />
            </Grid>
            <Grid xs={12} md={6} xl={3}>
              <DefaultInfoCard
                icon="account_balance"
                title="Current Plan"
                description="Premium Plan"
                value="$29/mo"
              />
            </Grid>
            <Grid xs={12} md={6} xl={3}>
              <DefaultInfoCard
                icon="paypal"
                title="Total Spent"
                description="This Year"
                value="$348.00"
              />
            </Grid>
            <Grid xs={12}>
              <PaymentMethod />
            </Grid>
          </Grid>
        </Grid>

        {/* Invoices */}
        <Grid xs={12} lg={4}>
          <Invoices />
        </Grid>

        {/* Bottom Section */}
        <Grid xs={12} md={7}>
          <BillingInformation />
        </Grid>
        
        <Grid xs={12} md={5}>
          <Transactions />
        </Grid>
      </Grid>
    </Box>
  );
}