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
      navigate('/upload', { state: { dataType } });
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
                <Biotech sx={{ fontSize: '2.2rem', color: '#e0e0e0', mr: 1.5 }} />
                <Box>
                                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#e0e0e0' }}>
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
                State-of-the-art independent component analysis for identifying seizure onset zones 
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
                    bgcolor: '#2a2a2a', 
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
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
      {/* User Welcome Section */}
      <Box sx={{ width: '100%', maxWidth: 1000, mb: 4 }}>
        <Card sx={{ background: '#1a1a1a', color: '#e0e0e0', borderRadius: 3, boxShadow: 4, border: '1px solid #333333' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 48, 
                    height: 48, 
                    bgcolor: '#2a2a2a',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: '#e0e0e0',
                    border: '2px solid #333333'
                  }}
                >
                  {userInfo.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: '#e0e0e0' }}>
                    Welcome back, {userInfo.name}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(224, 224, 224, 0.95)', mb: 0.5 }}>
                    {userInfo.email}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Logout />}
                onClick={handleLogout}
                sx={{ 
                  fontWeight: 600,
                  px: 2,
                  py: 0.5,
                  minWidth: 0,
                }}
              >
                Sign Out
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Main Analysis Section - Centered, wide, and with whitespace */}
      <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto' }}>
        <Card sx={{ width: '100%', p: 3, boxShadow: 6, borderRadius: 4, bgcolor: '#1a1a1a' }}>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MedicalServices sx={{ fontSize: '1.5rem', color: '#e0e0e0', mr: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Neuroimaging Analysis
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
              Select your data type to begin advanced independent component analysis 
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
              <Grid container spacing={2}>
                <Grid item xs={12}>
              <Paper 
                className={dataType === 'MRI' ? 'neon-selected' : ''}
                sx={{ 
                  p: 1.5, 
                  mb: 1.5, 
                  border: dataType === 'MRI' ? '2px solid #00ffff' : '1px solid #333333',
                  borderRadius: 2,
                  bgcolor: dataType === 'MRI' ? '#2a2a2a' : 'transparent',
                  color: dataType === 'MRI' ? '#00ffff' : '#e0e0e0',
                  boxShadow: dataType === 'MRI' ? '0 0 8px 2px #00ffff55' : 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s, color 0.2s',
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
                </Grid>
                <Grid item xs={12}>
                  <Paper 
                    className={dataType === 'EEG' ? 'neon-selected' : ''}
                    sx={{ 
                      p: 1.5, 
                      mb: 1.5, 
                      border: dataType === 'EEG' ? '2px solid #00ffff' : '1px solid #333333',
                      borderRadius: 2,
                      bgcolor: dataType === 'EEG' ? '#2a2a2a' : 'transparent',
                      color: dataType === 'EEG' ? '#00ffff' : '#e0e0e0',
                      boxShadow: dataType === 'EEG' ? '0 0 8px 2px #00ffff55' : 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s, color 0.2s',
                    }}
                  >
                    <FormControlLabel 
                      value="EEG" 
                      control={<Radio />} 
                      label={
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            EEG (Electroencephalography)
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Electrical activity monitoring for seizure detection
                          </Typography>
                        </Box>
                      }
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper 
                    className={dataType === 'PET' ? 'neon-selected' : ''}
                    sx={{ 
                      p: 1.5, 
                      mb: 1.5, 
                      border: dataType === 'PET' ? '2px solid #00ffff' : '1px solid #333333',
                      borderRadius: 2,
                      bgcolor: dataType === 'PET' ? '#2a2a2a' : 'transparent',
                      color: dataType === 'PET' ? '#00ffff' : '#e0e0e0',
                      boxShadow: dataType === 'PET' ? '0 0 8px 2px #00ffff55' : 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s, color 0.2s',
                    }}
                  >
                    <FormControlLabel 
                      value="PET" 
                      control={<Radio />} 
                      label={
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            PET (Positron Emission Tomography)
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Metabolic brain imaging for functional analysis
                          </Typography>
                        </Box>
                      }
                    />
                  </Paper>
                </Grid>
              </Grid>
            </RadioGroup>

            <Button
              variant="contained"
              size="medium"
              fullWidth
              onClick={handleProceed}
              sx={{ 
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                mt: 2,
                backgroundColor: '#2a2a2a',
                color: '#e0e0e0',
                '&:hover': { backgroundColor: '#333333' }
              }}
            >
              Begin {dataType} Analysis Workflow
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default LandingPage; 