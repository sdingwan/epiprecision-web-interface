import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4fc3f7', // Soft cyan for medical displays
      light: '#81d4fa',
      dark: '#0288d1',
      contrastText: '#000000',
    },
    secondary: {
      main: '#81c784', // Soft green for success states
      light: '#a5d6a7',
      dark: '#388e3c',
      contrastText: '#000000',
    },
    background: {
      default: '#0a0a0a', // Very dark for radiology room
      paper: '#1a1a1a', // Dark cards/surfaces
    },
    text: {
      primary: '#e0e0e0', // High contrast light text
      secondary: '#b0b0b0', // Medium contrast secondary text
    },
    error: {
      main: '#f44336',
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#000000',
    },
    info: {
      main: '#29b6f6',
      light: '#4fc3f7',
      dark: '#0288d1',
      contrastText: '#000000',
    },
    success: {
      main: '#66bb6a',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#000000',
    },
    // Custom colors for medical context - darker versions
    medical: {
      rsn: '#1a237e', // Dark blue for RSN
      noise: '#e65100',  // Dark orange for noise
      soz: '#880e4f',    // Dark pink for SOZ
      rsnBorder: '#3f51b5',
      noiseBorder: '#ff9800',
      sozBorder: '#e91e63',
    },
    // Additional dark theme colors
    divider: '#333333',
    action: {
      hover: '#222',
      selected: '#00ffff', // Neon cyan for selected
      disabled: '#555555',
      disabledBackground: '#2a2a2a',
      focus: '#00ffff', // Neon cyan for focus
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      color: '#e0e0e0',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#e0e0e0',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#e0e0e0',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#e0e0e0',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#e0e0e0',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#e0e0e0',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#b0b0b0',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#b0b0b0',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#e0e0e0',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#b0b0b0',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: '#888888',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0a0a0a',
          scrollbarColor: '#333333 #0a0a0a',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#0a0a0a',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#333333',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#444444',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
          border: '1px solid #333333',
          borderRadius: 12,
          transition: 'box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.8)',
            borderColor: '#444444',
          },
          '&.neon-selected': {
            border: '2px solid #00ffff',
            color: '#00ffff',
            boxShadow: '0 0 8px 2px #00ffff55',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          color: '#e0e0e0',
          '&.neon-selected': {
            border: '2px solid #00ffff',
            color: '#00ffff',
            boxShadow: '0 0 8px 2px #00ffff55',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          textTransform: 'none',
          fontSize: '0.875rem',
          padding: '10px 24px',
          boxShadow: 'none',
          border: '2px solid transparent',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          '&:focus': {
            borderColor: '#00ffff',
            boxShadow: '0 0 0 2px #00ffff44',
          },
        },
        contained: {
          border: '2px solid #00ffff',
          '&:hover': {
            borderColor: '#00ffff',
            boxShadow: '0 0 8px 2px #00ffff55',
            backgroundColor: '#222',
          },
        },
        outlined: {
          border: '2px solid #00ffff',
          color: '#e0e0e0',
          '&:hover': {
            borderColor: '#00ffff',
            backgroundColor: '#111',
            boxShadow: '0 0 8px 2px #00ffff55',
          },
          '&:focus': {
            borderColor: '#00ffff',
            boxShadow: '0 0 0 2px #00ffff44',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
          borderBottom: '1px solid #333333',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          backgroundColor: '#111',
          color: '#00ffff',
          border: '2px solid #00ffff',
          '&.MuiChip-colorPrimary': {
            backgroundColor: '#111',
            color: '#00ffff',
            border: '2px solid #00ffff',
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: '#2e7d32',
            color: '#e0e0e0',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: '#333333',
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          padding: '24px 0',
          backgroundColor: 'transparent',
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#b0b0b0',
          '&.Mui-active': {
            fontWeight: 600,
            color: '#e0e0e0',
          },
          '&.Mui-completed': {
            fontWeight: 500,
            color: '#81c784',
          },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: '#444444',
          '&.Mui-active': {
            color: '#00ffff',
          },
          '&.Mui-completed': {
            color: '#00ffff',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1a1a1a',
            '& fieldset': {
              borderColor: '#444444',
            },
            '&:hover fieldset': {
              borderColor: '#666666',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4fc3f7',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#b0b0b0',
          },
          '& .MuiOutlinedInput-input': {
            color: '#e0e0e0',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          color: '#e0e0e0',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#444444',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#666666',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00ffff',
            boxShadow: '0 0 0 2px #00ffff44',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          color: '#e0e0e0',
          '&:hover': {
            backgroundColor: '#2a2a2a',
          },
          '&.Mui-selected': {
            backgroundColor: '#333333',
            '&:hover': {
              backgroundColor: '#444444',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1a1a',
          color: '#e0e0e0',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: '#e0e0e0',
          borderBottom: '1px solid #333333',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          color: '#e0e0e0',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#2a2a2a',
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#e0e0e0',
        },
        secondary: {
          color: '#b0b0b0',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#333333',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#333333',
          color: '#e0e0e0',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1a1a',
          border: '1px solid #333333',
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: '#b0b0b0',
          '&.Mui-checked': {
            color: '#00ffff',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#b0b0b0',
          '&.Mui-checked': {
            color: '#00ffff',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00ffff',
            boxShadow: '0 0 0 2px #00ffff44',
          },
        },
        notchedOutline: {
          borderColor: '#444444',
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          '& .MuiRadio-root.Mui-checked': {
            color: '#00ffff',
          },
          '& .Mui-checked + .MuiTypography-root': {
            color: '#00ffff',
            fontWeight: 700,
          },
        },
        label: {
          color: '#e0e0e0',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: '#4fc3f7',
          color: '#000000',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: '#00ffff',
          },
        },
        track: {
          backgroundColor: '#00ffff',
        },
      },
    },
  },
});

// Add custom medical theme colors to the theme object
theme.palette.medical = {
  rsn: '#1a237e',
  noise: '#e65100', 
  soz: '#880e4f',
  rsnBorder: '#3f51b5',
  noiseBorder: '#ff9800',
  sozBorder: '#e91e63',
};

export default theme; 
