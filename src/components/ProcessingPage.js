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
  Timeline, 
  TimelineDot, 
  TimelineConnector, 
  TimelineItem, 
  TimelineSeparator, 
  TimelineContent 
} from '@mui/lab';
import { 
  Science, 
  PlayCircleFilledWhite, 
  CheckCircle, 
  FolderSpecial, 
  CloudUpload, 
  PsychologyAlt, 
  Assessment 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

const steps = [
  { label: 'Upload Data', icon: <CloudUpload color="primary" /> },
  { label: 'AI Analysis in Progress', icon: <Science color="primary" /> },
  { label: 'Results Categorized', icon: <FolderSpecial color="primary" /> },
  { label: 'Review & Download', icon: <Assessment color="primary" /> }
];

// Custom blue connector for Stepper
const BlueConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: theme.palette.primary.main,
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
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Avatar sx={{ bgcolor: 'white', color: 'primary.main', width: 48, height: 48, boxShadow: 2 }}>
            <Assessment fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
              Data Processing
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Step-by-step workflow for AI-powered analysis
            </Typography>
          </Box>
        </Box>
        <CardContent sx={{ p: 4 }}>
          {/* File count info */}
          {uploadedFiles.length > 0 && (
            <Paper sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Processing <b>{uploadedFiles.length}</b> uploaded {uploadedFiles.length === 1 ? 'file' : 'files'}
              </Typography>
            </Paper>
          )}

          {/* Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel connector={<BlueConnector />} sx={{ mb: 4 }}>
            {steps.map((step, idx) => (
              <Step key={step.label} completed={activeStep > idx}>
                <StepLabel icon={step.icon}>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content */}
          <Box sx={{ minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {activeStep === 0 && (
              <Typography sx={{ mb: 2 }}>Ready to begin AI-powered analysis.</Typography>
            )}
            {activeStep === 1 && (
              <Typography sx={{ mb: 2 }}>AI Analysis in Progress…</Typography>
            )}
            {activeStep === 2 && (
              <Typography sx={{ mb: 2 }}>Results being categorized by AI.</Typography>
            )}
            {activeStep === 3 && (
              <>
                <Typography sx={{ mb: 2 }}>You can now review and download your results.</Typography>
                <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
                  <Grid item xs={4}><Box bgcolor="#e8f5e9" p={2} borderRadius={2} textAlign="center">Normal Folder</Box></Grid>
                  <Grid item xs={4}><Box bgcolor="#fffde7" p={2} borderRadius={2} textAlign="center">Noisy Folder</Box></Grid>
                  <Grid item xs={4}><Box bgcolor="#ffebee" p={2} borderRadius={2} textAlign="center">Needs Review Folder</Box></Grid>
                </Grid>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {uploadedFiles.length} {uploadedFiles.length === 1 ? 'file has' : 'files have'} been distributed to the folders
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  size="large" 
                  sx={{ mt: 1 }} 
                  onClick={() => navigate('/results')}
                 
                >
                  Review & Download
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