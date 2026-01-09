import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as TailwindThemeProvider } from './components/theme-provider';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { WalletProvider } from './context/WalletContext';

// Components
import { Layout } from './components/common/Layout';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Pages
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import Marketplace from './pages/Marketplace';
import Admin from './Admin';
import Profile from './Profile';
import Checkout from './Checkout';
import ProductPage from './ProductPage';
import EditProduct from './EditProduct';

import { useTheme } from './components/theme-provider';

// Keep dark theme for MUI parts
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // Standard blue
    },
    secondary: {
      main: '#f1f5f9',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
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
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3B82F6', // Blue-500
    },
    secondary: {
      main: '#1e2330',
    },
    background: {
      default: '#0b0f19', // Matches index.css --background (hsl(230 35% 7%))
      paper: '#131722',   // Matches index.css --card
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
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
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
          border: '1px solid #1e293b',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});


function AppContent() {
  const { theme } = useTheme();
  const [muiTheme, setMuiTheme] = React.useState(lightTheme);

  React.useEffect(() => {
    const isDark = 
      theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setMuiTheme(isDark ? darkTheme : lightTheme);
  }, [theme]);

  // Listen to system value changes
  React.useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setMuiTheme(e.matches ? darkTheme : lightTheme);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ErrorBoundary>
        <WalletProvider>
          <Router>
            <Layout>
              <Routes>
                {/* Main Routes */}
                <Route path="/" element={<Marketplace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/add-product" element={<AddProduct />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* Product Routes */}
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/edit/:id" element={<EditProduct />} />
                <Route path="/checkout/:productId" element={<Checkout />} />
              </Routes>
            </Layout>
          </Router>
          
          <ToastContainer
            theme={muiTheme.palette.mode as 'light' | 'dark'}
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </WalletProvider>
      </ErrorBoundary>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <TailwindThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AppContent />
    </TailwindThemeProvider>
  );
}

export default App;
