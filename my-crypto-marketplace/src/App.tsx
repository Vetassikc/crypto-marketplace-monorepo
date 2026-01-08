import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
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

// Theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#0a1929',
      paper: '#1a2027',
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
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
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
            theme="dark"
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
    </ThemeProvider>
  );
}

export default App;
