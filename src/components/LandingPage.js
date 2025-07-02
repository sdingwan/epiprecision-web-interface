import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  Button, 
  Box, 
  Avatar, 
  Chip,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  Logout, 
  Person, 
  Biotech,
  LocalHospital,
  Security,
  CheckCircle,
  MedicalServices,
  Psychology,
  Assessment
} from '@mui/icons-material';

const LandingPage = () => {
  const [dataType, setDataType] = useState('MRI');
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const checkLoginStatus = () => {
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    
    if (isLoggedIn && userEmail) {
      setUserInfo({
        email: userEmail,
        name: userName || 'User'
      });
    } else {
      setUserInfo(null);
    }
  };

  useEffect(() => {
    checkLoginStatus();
    
    // Listen for storage changes (when user logs in/out from other components)
    window.addEventListener('storage', checkLoginStatus);
    
    // Listen for custom login state changes (for same-tab updates)
    window.addEventListener('loginStateChanged', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStateChanged', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setUserInfo(null);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('loginStateChanged'));
    
    navigate('/login');
  };

  const handleProceed = () => {
    if (!userInfo) {
      navigate('/login');
    } else {
      navigate('/upload');
    }
  };

  if (!userInfo) {
    // User not logged in - show professional login prompt
    return (
      <Box 
        sx={{ 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 1, md: 2 }
        }}
      >
        <Grid container maxWidth="lg" spacing={2} alignItems="center">
          {/* Left side - Branding and Info */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Biotech sx={{ fontSize: '2.2rem', color: 'primary.main', mr: 1.5 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    EpiPrecision
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Advanced Medical Imaging Platform
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                Precision Epilepsy Analysis Through AI-Powered Neuroimaging
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.5 }}>
                State-of-the-art MELODIC independent component analysis for identifying seizure onset zones 
                with clinical-grade accuracy and reliability.
              </Typography>

              {/* Feature highlights */}
              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircle sx={{ color: 'success.main', mr: 1, fontSize: '1rem' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      FDA-Compliant Processing
                    </Typography>
                  </Box>
                </Grid>
                                 <Grid item xs={12} sm={6}>
                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                     <Security sx={{ color: 'success.main', mr: 1, fontSize: '1rem' }} />
                     <Typography variant="body2" sx={{ fontWeight: 500 }}>
                       Secure Platform
                     </Typography>
                   </Box>
                 </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Psychology sx={{ color: 'success.main', mr: 1, fontSize: '1rem' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      AI-Powered Analysis
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Assessment sx={{ color: 'success.main', mr: 1, fontSize: '1rem' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Clinical Integration
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          
          {/* Right side - Login Card */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 2.5, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.08)'
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar 
                  sx={{ 
                    width: 48, 
                    height: 48, 
                    bgcolor: 'primary.main', 
                    mx: 'auto', 
                    mb: 1.5,
                    boxShadow: '0 2px 6px 0 rgba(25, 118, 210, 0.18)'
                  }}
                >
                  <LocalHospital sx={{ fontSize: '1.5rem' }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Secure Access Portal
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Sign in to access advanced neuroimaging analysis tools
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="medium"
                fullWidth
                onClick={() => navigate('/login')}
                startIcon={<Person />}
                sx={{ 
                  py: 1,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: '0 2px 6px 0 rgba(25, 118, 210, 0.18)',
                  '&:hover': {
                    boxShadow: '0 4px 12px 0 rgba(25, 118, 210, 0.22)',
                  }
                }}
              >
                Sign In / Create Account
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Secure & Compliant
                </Typography>
              </Divider>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
                  This platform complies with FDA guidelines and medical data protection standards. 
                  Your patient data is encrypted and secure.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // User is logged in - show main dashboard interface
  return (
    <Box sx={{ minHeight: '100vh', p: { xs: 1, md: 2 } }}>
      <Grid container maxWidth="lg" spacing={2} sx={{ mx: 'auto' }}>
        {/* User Welcome Section */}
        <Grid item xs={12}>
          <Card sx={{ mb: 2, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      color: '#1976d2',
                      border: '2px solid rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    {userInfo.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: 'white' }}>
                      Welcome back, {userInfo.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.95)', mb: 0.5 }}>
                      {userInfo.email}
                    </Typography>
                    <Chip 
                      label="Active Session" 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.9)', 
                        color: '#2e7d32',
                        fontWeight: 600
                      }} 
                    />
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Logout />}
                  onClick={handleLogout}
                  sx={{ 
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                    color: 'white',
                    fontWeight: 600,
                    px: 2,
                    py: 0.5,
                    minWidth: 0,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.15)'
                    }
                  }}
                >
                  Sign Out
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Analysis Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MedicalServices sx={{ fontSize: '1.5rem', color: 'primary.main', mr: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Neuroimaging Analysis
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
                Select your data type to begin advanced MELODIC independent component analysis 
                for precise seizure onset zone identification.
              </Typography>

              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Select Data Type
              </Typography>
              
              <RadioGroup
                value={dataType}
                onChange={e => setDataType(e.target.value)}
                sx={{ mb: 2 }}
              >
                <Paper 
                  sx={{ 
                    p: 1.5, 
                    mb: 1.5, 
                    border: dataType === 'MRI' ? '2px solid' : '1px solid',
                    borderColor: dataType === 'MRI' ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    bgcolor: dataType === 'MRI' ? 'primary.50' : 'transparent'
                  }}
                >
                  <FormControlLabel 
                    value="MRI" 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          MRI (Magnetic Resonance Imaging)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          High-resolution structural and functional brain imaging
                        </Typography>
                      </Box>
                    }
                  />
                </Paper>
                
                <Paper sx={{ p: 1.5, mb: 1.5, opacity: 0.6, borderRadius: 2 }}>
                  <FormControlLabel 
                    value="EEG" 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          EEG (Electroencephalography)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Electrical activity monitoring - Coming Soon
                        </Typography>
                      </Box>
                    }
                    disabled 
                  />
                </Paper>
                
                <Paper sx={{ p: 1.5, mb: 1.5, opacity: 0.6, borderRadius: 2 }}>
                  <FormControlLabel 
                    value="PET" 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          PET (Positron Emission Tomography)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Metabolic brain imaging - Coming Soon
                        </Typography>
                      </Box>
                    }
                    disabled 
                  />
                </Paper>
              </RadioGroup>

              <Button
                variant="contained"
                color="primary"
                size="medium"
                fullWidth
                onClick={handleProceed}
                disabled={dataType !== 'MRI'}
                sx={{ 
                  py: 1,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                Begin MRI Analysis Workflow
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Panel */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                System Status
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircle sx={{ color: 'success.main', mr: 1.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Platform Ready
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      All systems operational
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircle sx={{ color: 'success.main', mr: 1.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      MELODIC Engine
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Analysis ready
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600 }}>
                Quick Actions
              </Typography>
              
              <Button 
                variant="outlined" 
                size="small" 
                fullWidth 
                sx={{ mb: 1 }}
                onClick={() => navigate('/upload')}
              >
                Upload New Data
              </Button>
              
              <Button 
                variant="outlined" 
                size="small" 
                fullWidth
                onClick={() => navigate('/results')}
              >
                View Previous Results
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LandingPage; 