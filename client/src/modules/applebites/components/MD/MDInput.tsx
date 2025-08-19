import { forwardRef } from 'react';
import { TextField, TextFieldProps, InputAdornment } from '@mui/material';

interface MDInputProps extends Omit<TextFieldProps, 'variant'> {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const MDInput = forwardRef<HTMLInputElement, MDInputProps>(
  ({ startAdornment, endAdornment, sx, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        variant="outlined"
        fullWidth
        InputProps={{
          startAdornment: startAdornment ? (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          ) : undefined,
          endAdornment: endAdornment ? (
            <InputAdornment position="end">{endAdornment}</InputAdornment>
          ) : undefined,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'white',
            '& fieldset': {
              borderColor: '#D1D5DB',
            },
            '&:hover fieldset': {
              borderColor: '#9CA3AF',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00718d',
              borderWidth: 2,
            },
          },
          '& .MuiInputBase-input': {
            padding: '14px 16px',
            fontSize: '15px',
          },
          ...sx,
        }}
        {...props}
      />
    );
  }
);

MDInput.displayName = 'MDInput';

export default MDInput;