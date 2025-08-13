import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  CircularProgress, 
  Grid, 
  Paper, 
  Avatar 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFiles } from '../App';
import { 
  Science, 
  FolderSpecial, 
  CloudUpload, 
  Assessment 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

const steps = [
  { label: 'Upload Data', icon: <CloudUpload sx={{ color: '#e0e0e0' }} /> },
  { label: 'AI Analysis in Progress', icon: <Science sx={{ color: '#e0e0e0' }} /> },
  { label: 'Results Categorized', icon: <FolderSpecial sx={{ color: '#e0e0e0' }} /> },
  { label: 'Review & Download', icon: <Assessment sx={{ color: '#e0e0e0' }} /> }
];

// Custom blue connector for Stepper
const BlueConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#2a2a2a',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#2a2a2a',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.grey[300],
    borderRadius: 1,
    transition: 'background-color 0.3s ease',
  },
}));

const CyanConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#00ffff',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#00ffff',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#b0b0b0',
    borderRadius: 1,
    transition: 'background-color 0.3s ease',
  },
}));

const ProcessingPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { uploadedFiles, distributeFiles } = useFiles();
  
  // Debug: log uploaded files
  console.log('ProcessingPage - uploadedFiles:', uploadedFiles);

  // Auto-advance steps
  useEffect(() => {
    if (activeStep === 0) {
      setLoading(true);
      const t = setTimeout(() => setActiveStep(1), 1000);
      return () => clearTimeout(t);
    }
    if (activeStep === 1) {
      setLoading(true);
      const t = setTimeout(() => setActiveStep(2), 2000);
      return () => clearTimeout(t);
    }
    if (activeStep === 2) {
      setLoading(true);
      const t = setTimeout(() => {
        setActiveStep(3);
        distributeFiles();
        setLoading(false);
      }, 1500);
      return () => clearTimeout(t);
    }
    if (activeStep === 3) {
      setLoading(false);
    }
  }, [activeStep, distributeFiles]);

  return (
    <Box sx={{ minHeight: '80vh', p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card sx={{ minWidth: 400, maxWidth: 600, mx: 'auto', boxShadow: 4, borderRadius: 3 }}>
        {/* Gradient Header */}
        <Box sx={{
          background: '#1a1a1a',
          border: '1px solid #333333',
          color: '#e0e0e0',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Avatar sx={{ bgcolor: '#2a2a2a', color: '#e0e0e0', width: 48, height: 48, boxShadow: 2 }}>
            <Assessment fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#e0e0e0' }}>
              {steps[activeStep].label}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(224,224,224,0.9)' }}>
              AI-powered Workflow
            </Typography>
          </Box>
        </Box>
        <CardContent sx={{ p: 4 }}>
          {/* File count info */}
          {uploadedFiles.length > 0 && (
            <Paper sx={{ mb: 3, p: 2, bgcolor: '#1a1a1a', borderRadius: 2, textAlign: 'center', border: '1px solid #333333' }}>
              <Typography variant="body2" sx={{ color: '#00ffff', fontWeight: 600 }}>
                Processing <b>{uploadedFiles.length}</b> uploaded {uploadedFiles.length === 1 ? 'file' : 'files'}
              </Typography>
            </Paper>
          )}

          {/* Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel connector={<CyanConnector />} sx={{ mb: 4 }}>
            {steps.map((step, idx) => (
              <Step key={step.label} completed={activeStep > idx}>
                <StepLabel 
                  icon={step.icon}
                  sx={{
                    color: activeStep >= idx ? '#00ffff' : '#b0b0b0', // icon and label cyan
                    '& .MuiStepLabel-label': {
                      color: activeStep >= idx ? '#00ffff' : '#b0b0b0',
                      fontWeight: activeStep >= idx ? 600 : 400,
                    },
                  }}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content */}
          <Box sx={{ minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {activeStep === 0 && (
              <Typography sx={{ mb: 2, color: '#00ffff', fontWeight: 600 }}>Ready to begin AI-powered analysis.</Typography>
            )}
            {activeStep === 1 && (
              <Typography sx={{ mb: 2, color: '#00ffff', fontWeight: 600 }}>AI Analysis in Progress…</Typography>
            )}
            {activeStep === 2 && (
              <Typography sx={{ mb: 2, color: '#00ffff', fontWeight: 600 }}>Results being categorized by AI.</Typography>
            )}
            {activeStep === 3 && (
              <>
                <Typography sx={{ mb: 2 }}>You can now review and download your results.</Typography>
                <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
                  <Grid item xs={4}>
                    <Box sx={{
                      bgcolor: '#1a1a1a',
                      border: '2px solid #00ff99',
                      borderRadius: 2,
                      textAlign: 'center',
                      color: '#00ff99',
                      fontWeight: 600,
                      py: 2
                    }}>RSN</Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{
                      bgcolor: '#1a1a1a',
                      border: '2px solid #ffff00',
                      borderRadius: 2,
                      textAlign: 'center',
                      color: '#ffff00',
                      fontWeight: 600,
                      py: 2
                    }}>Noise</Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{
                      bgcolor: '#1a1a1a',
                      border: '2px solid #ff4d8b',
                      borderRadius: 2,
                      textAlign: 'center',
                      color: '#ff4d8b',
                      fontWeight: 600,
                      py: 2
                    }}>SOZ</Box>
                  </Grid>
                </Grid>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {uploadedFiles.length} {uploadedFiles.length === 1 ? 'file has' : 'files have'} been distributed to the folders
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth 
                  size="large" 
                  sx={{ mt: 1, backgroundColor: '#2a2a2a', color: '#e0e0e0', '&:hover': { backgroundColor: '#333333' } }} 
                  onClick={() => navigate('/results')}
                >
                  Review
                </Button>
              </>
            )}
            {loading && <Box display="flex" justifyContent="center" mt={2}><CircularProgress /></Box>}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProcessingPage; 