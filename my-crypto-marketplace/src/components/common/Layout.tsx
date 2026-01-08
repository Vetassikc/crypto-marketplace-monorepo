import React, { ReactNode } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from '@mui/material';
import { useWallet } from '../../context/WalletContext';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Admin', path: '/admin' },
  { label: 'Profile', path: '/profile' },
];

export function Layout({ children }: LayoutProps) {
  const { account, isConnecting, connect } = useWallet();
  const location = useLocation();

  const formatAddress = (address: string) => 
    `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/"
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 'bold',
            }}
          >
            🛒 Crypto Marketplace
          </Typography>

          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              component={RouterLink}
              to={item.path}
              sx={{
                borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
              }}
            >
              {item.label}
            </Button>
          ))}

          {!account ? (
            <Button
              color="inherit"
              onClick={connect}
              disabled={isConnecting}
              sx={{ border: '1px solid white', ml: 2 }}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          ) : (
            <Typography 
              variant="body2" 
              sx={{ 
                ml: 2, 
                px: 2, 
                py: 0.5, 
                bgcolor: 'rgba(255,255,255,0.1)', 
                borderRadius: 1,
              }}
            >
              {formatAddress(account)}
            </Typography>
          )}
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 2,
          textAlign: 'center',
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2026 Crypto Marketplace. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
