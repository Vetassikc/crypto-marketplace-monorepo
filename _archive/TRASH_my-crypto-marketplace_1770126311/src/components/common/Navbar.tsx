import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Search, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { useWallet } from "../../context/WalletContext";
import { useMarketplaceContext, SortOption } from "../../context/MarketplaceContext";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Admin", path: "/admin" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const location = useLocation();
  const { account, connect, isConnecting } = useWallet();
  const { search, setSearch, sortBy, setSortBy } = useMarketplaceContext();

  const isMarketplace = location.pathname === "/";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatAddress = (addr: string) => 
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case 'date_desc': return 'Newest';
      case 'date_asc': return 'Oldest';
      case 'price_asc': return 'Price: Low';
      case 'price_desc': return 'Price: High';
      default: return 'Sort';
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled 
          ? "bg-background/80 backdrop-blur-xl border-border/10" 
          : "bg-transparent border-transparent"
      )}>
        <div className="w-full px-6 lg:px-12 flex items-center justify-between py-4 gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="flex items-center justify-center group-hover:opacity-80 transition-opacity">
            <Logo className="w-8 h-8" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground hidden sm:block">
            VartMarkt
          </span>
        </Link>

        {/* Search Bar & Nav (Desktop) */}
        <div className="flex-1 flex items-center justify-center gap-6">
           {/* Center Search (Only visible on larger screens, and usually preferred on Marketplace) */}
           <div className="hidden md:flex items-center w-full max-w-xl gap-2">
             <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-muted-foreground" />
                </div>
                <input 
                  type="text"
                  placeholder="Search products..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-full bg-secondary/50 border border-transparent focus:border-primary focus:bg-background transition-all outline-none text-sm"
                />
             </div>
             
             {/* Sort Dropdown */}
             <div className="relative">
                <button 
                  onClick={() => setShowSort(!showSort)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors text-sm font-medium border border-transparent hover:border-border"
                >
                  <span className="text-muted-foreground hidden lg:inline">Sort:</span>
                  <span>{getSortLabel(sortBy)}</span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </button>
                
                {showSort && (
                  <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-20">
                     <button onClick={() => { setSortBy('date_desc'); setShowSort(false); }} className="w-full text-left px-4 py-2 hover:bg-primary/10 text-sm">Newest First</button>
                     <button onClick={() => { setSortBy('date_asc'); setShowSort(false); }} className="w-full text-left px-4 py-2 hover:bg-primary/10 text-sm">Oldest First</button>
                     <button onClick={() => { setSortBy('price_asc'); setShowSort(false); }} className="w-full text-left px-4 py-2 hover:bg-primary/10 text-sm">Price: Low to High</button>
                     <button onClick={() => { setSortBy('price_desc'); setShowSort(false); }} className="w-full text-left px-4 py-2 hover:bg-primary/10 text-sm">Price: High to Low</button>
                  </div>
                  </>
                )}
             </div>
           </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6 flex-shrink-0">
          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative",
                  location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="h-6 w-px bg-border/50" />

          <div className="flex items-center gap-3">
             <ThemeToggle />
             {!account ? (
               <button
                 onClick={connect}
                 disabled={isConnecting}
                 className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
               >
                 {isConnecting ? "..." : "Connect"}
               </button>
             ) : (
               <Link to="/profile">
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border hover:bg-secondary transition-colors cursor-pointer">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-xs font-mono hidden xl:inline">{formatAddress(account)}</span>
                   <User className="w-4 h-4 opacity-50" />
                 </div>
               </Link>
             )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Search - Visible only on mobile below header */}
      <div className="md:hidden px-6 pb-4">
         <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-secondary/50 border border-transparent focus:border-primary text-sm"
            />
         </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-base font-medium py-2 border-b border-border/50",
                    location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
               {/* Mobile Sort Options */}
               <div className="py-2 border-b border-border/50">
                  <span className="text-xs text-muted-foreground block mb-2">Sort By</span>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSortBy('date_desc')} className={cn("text-xs px-2 py-1 rounded bg-secondary", sortBy === 'date_desc' && "text-primary ring-1 ring-primary")}>Newest</button>
                    <button onClick={() => setSortBy('price_asc')} className={cn("text-xs px-2 py-1 rounded bg-secondary", sortBy === 'price_asc' && "text-primary ring-1 ring-primary")}>Price: Low</button>
                    <button onClick={() => setSortBy('price_desc')} className={cn("text-xs px-2 py-1 rounded bg-secondary", sortBy === 'price_desc' && "text-primary ring-1 ring-primary")}>Price: High</button>
                  </div>
               </div>

              <div className="flex items-center justify-between pt-2">
                <ThemeToggle />
                {!account ? (
                  <button
                    onClick={connect}
                    className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm"
                  >
                    Connect Wallet
                  </button>
                ) : (
                   <span className="text-xs font-mono">{formatAddress(account)}</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
