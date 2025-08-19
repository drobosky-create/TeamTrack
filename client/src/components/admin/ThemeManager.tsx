import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useUITokens, useUpdateUIToken, type UITokens } from '@/hooks/useUITokens';
import { gradients, glassStyles } from '../../../../src/theme/gradients';

export default function ThemeManager() {
  const { data: tokens, isLoading, refetch } = useUITokens();
  const updateToken = useUpdateUIToken();
  const [editedTokens, setEditedTokens] = useState<Partial<UITokens>>({});
  const [previewMode, setPreviewMode] = useState(false);

  const handleTokenChange = (key: keyof UITokens, value: string) => {
    setEditedTokens(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: keyof UITokens) => {
    const value = editedTokens[key];
    if (!value) return;

    try {
      await updateToken.mutateAsync({ key, value });
      setEditedTokens(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  };

  const handleReset = () => {
    setEditedTokens({});
    refetch();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const tokenCategories = {
    colors: Object.entries(tokens || {}).filter(([key]) => key.startsWith('color.')),
    gradients: Object.entries(tokens || {}).filter(([key]) => key.startsWith('gradient.')),
    spacing: Object.entries(tokens || {}).filter(([key]) => key.startsWith('radius.') || key.startsWith('blur.')),
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <PaletteIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Theme Manager
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body2">
          Manage your application's design tokens. Changes are applied immediately and persist across sessions.
          Only administrators can modify theme tokens.
        </Typography>
      </Alert>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleReset}
          disabled={Object.keys(editedTokens).length === 0}
        >
          Reset Changes
        </Button>
        <Chip 
          label={`${Object.keys(editedTokens).length} unsaved changes`}
          color={Object.keys(editedTokens).length > 0 ? 'warning' : 'default'}
        />
      </Box>

      <Grid container spacing={4}>
        {/* Color Tokens */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Color Tokens
              </Typography>
              
              {tokenCategories.colors.map(([key, value]) => (
                <Box key={key} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 1,
                        backgroundColor: editedTokens[key as keyof UITokens] || value,
                        border: '1px solid #e0e0e0',
                        mr: 2,
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {key.replace('color.', '')}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      fullWidth
                      value={editedTokens[key as keyof UITokens] || value}
                      onChange={(e) => handleTokenChange(key as keyof UITokens, e.target.value)}
                      placeholder="Enter color value"
                    />
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<SaveIcon />}
                      onClick={() => handleSave(key as keyof UITokens)}
                      disabled={!editedTokens[key as keyof UITokens] || updateToken.isPending}
                      sx={{ minWidth: 80 }}
                    >
                      Save
                    </Button>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Gradient Tokens */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Gradient Tokens
              </Typography>
              
              {tokenCategories.gradients.map(([key, value]) => (
                <Box key={key} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 1,
                        background: editedTokens[key as keyof UITokens] || value,
                        border: '1px solid #e0e0e0',
                        mr: 2,
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {key.replace('gradient.', '')}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      value={editedTokens[key as keyof UITokens] || value}
                      onChange={(e) => handleTokenChange(key as keyof UITokens, e.target.value)}
                      placeholder="Enter gradient CSS"
                    />
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<SaveIcon />}
                      onClick={() => handleSave(key as keyof UITokens)}
                      disabled={!editedTokens[key as keyof UITokens] || updateToken.isPending}
                      sx={{ minWidth: 80 }}
                    >
                      Save
                    </Button>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Spacing & Effects */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Spacing & Effects
              </Typography>
              
              {tokenCategories.spacing.map(([key, value]) => (
                <Box key={key} sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {key}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      fullWidth
                      value={editedTokens[key as keyof UITokens] || value}
                      onChange={(e) => handleTokenChange(key as keyof UITokens, e.target.value)}
                      placeholder="Enter CSS value"
                    />
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<SaveIcon />}
                      onClick={() => handleSave(key as keyof UITokens)}
                      disabled={!editedTokens[key as keyof UITokens] || updateToken.isPending}
                      sx={{ minWidth: 80 }}
                    >
                      Save
                    </Button>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Preview Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Live Preview
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Primary Color Preview */}
                <Button 
                  variant="contained" 
                  sx={{ background: 'var(--ab-grad-brandBlue)' }}
                >
                  Primary Brand Button
                </Button>
                
                {/* Glass Effect Preview */}
                <Box
                  sx={{
                    ...glassStyles,
                    p: 2,
                    borderRadius: 'var(--ab-radius-lg)',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body2">
                    Glass Effect Preview
                  </Typography>
                </Box>
                
                {/* Growth Gradient Preview */}
                <Box
                  sx={{
                    background: 'var(--ab-grad-growth)',
                    p: 2,
                    borderRadius: 'var(--ab-radius-md)',
                    color: 'var(--ab-color-onBrand)',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Growth Gradient
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}