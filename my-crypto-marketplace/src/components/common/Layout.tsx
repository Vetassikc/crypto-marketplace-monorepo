import React, { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Add padding top to account for fixed navbar */}
      {/* Main Content Area - Monolithic Full Bleed */}
      <main className="flex-grow flex flex-col pt-[72px] min-h-screen">
        <div className="w-full h-full flex-grow">
          {children}
        </div>
      </main>

      <Box
        component="footer"
        sx={{
          py: 4,
          textAlign: 'center',
          bgcolor: 'background.paper', // We might want to redesign footer later too
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <p className="text-sm text-muted-foreground">
          © 2026 Crypto Marketplace. Built with React & Solidity.
        </p>
      </Box>
    </Box>
  );
}
