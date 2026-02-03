import React, { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      {/* Global Video Background */}
      <div className="fixed inset-0 z-[-1]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Strong overlay for text readability across the app */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
      </div>

      <Navbar />
      
      {/* Add padding top to account for fixed navbar */}
      {/* Main Content Area - Monolithic Full Bleed */}
      <main className="flex-grow flex flex-col pt-[72px]">
        <div className="w-full h-full flex-grow">
          {children}
        </div>
      </main>

      <footer className="py-4 text-center border-t border-border bg-background/80 backdrop-blur-md">
        <p className="text-sm text-muted-foreground">
          © 2026 Crypto Marketplace. Built with React & Solidity.
        </p>
      </footer>
    </Box>
  );
}
