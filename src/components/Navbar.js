import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Typography, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem,
  Chip,
  Divider,
  IconButton
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Person, 
  AccountCircle, 
  Biotech,
  Dashboard,
  CloudUpload,
  Psychology,
  Assessment,
  Logout as LogoutIcon
} from '@mui/icons-material';

const Navbar = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkLoginStatus);
    
    // Listen for custom login state changes (for same-tab updates)
    window.addEventListener('loginStateChanged', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStateChanged', checkLoginStatus);
    };
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setUserInfo(null);
    handleMenuClose();
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('loginStateChanged'));
    
    navigate('/');
  };

  const getActiveButton = (path) => {
    return location.pathname === path;
  };

  const NavButton = ({ to, icon: Icon, label, isActive }) => (
    <Button
      color="inherit"
      component={Link}
      to={to}
      startIcon={<Icon />}
      sx={{
        mx: 0.5,
        px: 2,
        py: 1,
        borderRadius: 2,
        bgcolor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        '&:hover': {
          bgcolor: 'rgba(255, 255, 255, 0.1)',
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {label}
    </Button>
  );

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ minHeight: 70 }}>
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
          <Biotech sx={{ fontSize: '2rem', mr: 1.5, color: '#ffffff' }} />
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                fontSize: '1.25rem',
                lineHeight: 1.1,
                color: '#ffffff'
              }}
            >
              EpiPrecision
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.7rem',
                fontWeight: 500,
                letterSpacing: '0.5px'
              }}
            >
              MEDICAL IMAGING PLATFORM
        </Typography>
          </Box>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {userInfo ? (
          // User is logged in - show navigation and user menu
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Navigation Buttons */}
            <NavButton 
              to="/" 
              icon={Dashboard} 
              label="Dashboard" 
              isActive={getActiveButton('/')}
            />
            <NavButton 
              to="/upload" 
              icon={CloudUpload} 
              label="Upload" 
              isActive={getActiveButton('/upload')}
            />
            <NavButton 
              to="/processing" 
              icon={Psychology} 
              label="Processing" 
              isActive={getActiveButton('/processing')}
            />
            <NavButton 
              to="/results" 
              icon={Assessment} 
              label="Results" 
              isActive={getActiveButton('/results')}
            />
            
            <Divider 
              orientation="vertical" 
              flexItem 
              sx={{ 
                mx: 2, 
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                height: '30px',
                alignSelf: 'center'
              }} 
            />
            
            {/* User Menu */}
            <Button
              color="inherit"
              onClick={handleMenuOpen}
              startIcon={
                <Avatar sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  fontSize: '0.875rem'
                }}>
                  {userInfo.name.charAt(0).toUpperCase()}
                </Avatar>
              }
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <Box sx={{ textAlign: 'left', ml: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              {userInfo.name}
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  lineHeight: 1.1 
                }}>
                  {userInfo.email}
                </Typography>
              </Box>
            </Button>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" color="text.primary">
                  {userInfo.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {userInfo.email}
                </Typography>
                <Chip 
                  label="Active Session" 
                  size="small" 
                  color="success" 
                  sx={{ mt: 0.5, fontSize: '0.7rem' }}
                />
              </Box>
              <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                <LogoutIcon sx={{ mr: 2, fontSize: '1.2rem' }} />
                <Typography variant="body2">Sign Out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          // User not logged in - show login button only
          <Button
            color="inherit"
            component={Link}
            to="/login"
            variant="outlined"
            startIcon={<Person />}
            sx={{ 
              borderColor: 'rgba(255, 255, 255, 0.5)',
              borderWidth: '1.5px',
              borderRadius: 2,
              px: 3,
              py: 1,
              '&:hover': { 
                borderColor: 'rgba(255, 255, 255, 0.8)',
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 