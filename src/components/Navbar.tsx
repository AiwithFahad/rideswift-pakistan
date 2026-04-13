import { Link, useLocation } from '@tanstack/react-router';
import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/ui/button';
import { Menu, X, Bell, User, LogOut, Bike, Package, LayoutDashboard, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, currentUser, logout, notifications } = useAppStore();
  const location = useLocation();
  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { to: '/' as const, label: 'Home' },
    { to: '/book-ride' as const, label: 'Book Ride' },
    { to: '/send-parcel' as const, label: 'Send Parcel' },
    { to: '/tracking' as const, label: 'Track' },
  ];

  const isDashboard = location.pathname.startsWith('/dashboard');
  if (isDashboard) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-green flex items-center justify-center">
              <Bike className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-[family-name:var(--font-display)] text-gradient-green">BYKEA</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                activeProps={{ className: 'px-4 py-2 rounded-lg text-sm font-medium text-primary bg-secondary' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="relative p-2 rounded-lg hover:bg-secondary transition-all">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full gradient-green text-[10px] text-primary-foreground flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link to="/dashboard/wallet" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-sm font-medium">
                  <Wallet className="w-4 h-4 text-primary" />
                  PKR {currentUser?.walletBalance?.toLocaleString()}
                </Link>
                <Link to="/dashboard">
                  <Button variant="hero" size="sm">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <button onClick={logout} className="p-2 rounded-lg hover:bg-secondary transition-all text-muted-foreground">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/login">
                  <Button variant="hero" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary"
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-medium text-primary bg-secondary">
                    Dashboard
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-secondary">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="hero" className="w-full">Get Started</Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
