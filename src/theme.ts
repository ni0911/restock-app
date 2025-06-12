import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // 深みのある緑
      light: '#4CAF50', // 明るい緑
      dark: '#1B5E20', // 暗い緑
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#81C784', // 柔らかい緑
      light: '#A5D6A7', // より明るい緑
      dark: '#66BB6A', // より暗い緑
      contrastText: '#000000',
    },
    background: {
      default: '#F1F8E9', // 薄い緑の背景
      paper: '#FFFFFF',
    },
    success: {
      main: '#43A047',
      light: '#66BB6A',
      dark: '#2E7D32',
    },
    error: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#C62828',
    },
    warning: {
      main: '#FFA000',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    info: {
      main: '#1976D2',
      light: '#42A5F5',
      dark: '#1565C0',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 600,
      color: '#1B5E20',
    },
    h5: {
      fontWeight: 600,
      color: '#2E7D32',
    },
    h6: {
      fontWeight: 600,
      color: '#2E7D32',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#4CAF50',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        },
        head: {
          backgroundColor: '#F1F8E9',
          fontWeight: 600,
          color: '#2E7D32',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#F1F8E9',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: '#F1F8E9',
          color: '#2E7D32',
          fontWeight: 600,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(76, 175, 80, 0.08)',
          },
        },
      },
    },
  },
});

export default theme; 