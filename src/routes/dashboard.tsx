import { createFileRoute, Outlet, Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { LayoutDashboard, Bike, Package, Wallet, Bell, Users, BarChart3, MapPin, Settings, LogOut, Menu, X, User, Shield, Truck } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
});

function DashboardLayout() {
  const { isAuthenticated, currentUser, logout } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: '/login' });
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !currentUser) return null;

  const role = currentUser.role;

  const navItems = [
    { to: '/dashboard' as const, icon: LayoutDashboard, label: 'Overview', roles: ['user', 'driver', 'admin'] },
    { to: '/dashboard/rides' as const, icon: Bike, label: 'My Rides', roles: ['user'] },
    { to: '/dashboard/rides' as const, icon: Bike, label: 'Ride Requests', roles: ['driver'] },
    { to: '/dashboard/parcels' as const, icon: Package, label: 'Parcels', roles: ['user'] },
    { to: '/dashboard/wallet' as const, icon: Wallet, label: 'Wallet', roles: ['user', 'driver'] },
    { to: '/dashboard/notifications' as const, icon: Bell, label: 'Notifications', roles: ['user', 'driver', 'admin'] },
    { to: '/dashboard/users' as const, icon: Users, label: 'Users', roles: ['admin'] },
    { to: '/dashboard/drivers' as const, icon: Truck, label: 'Drivers', roles: ['admin'] },
    { to: '/dashboard/analytics' as const, icon: BarChart3, label: 'Analytics', roles: ['admin'] },
  ].filter(item => item.roles.includes(role));

  const roleIcons = { user: User, driver: Truck, admin: Shield };
  const RoleIcon = roleIcons[role];

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-sidebar p-4 fixed h-full">
        <Link to="/" className="flex items-center gap-2 px-3 py-2 mb-6">
          <div className="w-8 h-8 rounded-lg gradient-green flex items-center justify-center">
            <Bike className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-gradient-green">BYKEA</span>
        </Link>

        <nav className="flex-1 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.to;
            return (
              <Link key={item.label} to={item.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50'}`}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border pt-4 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full gradient-green flex items-center justify-center">
              <RoleIcon className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate({ to: '/' }); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-background border-b border-border flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(true)} className="p-2"><Menu className="w-5 h-5" /></button>
        <span className="font-bold text-gradient-green">BYKEA</span>
        <div className="w-8 h-8 rounded-full gradient-green flex items-center justify-center">
          <RoleIcon className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 h-full bg-sidebar p-4 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gradient-green">BYKEA</span>
              <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <nav className="flex-1 space-y-1">
              {navItems.map(item => (
                <Link key={item.label} to={item.to} onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-sidebar-accent/50">
                  <item.icon className="w-4 h-4" /> {item.label}
                </Link>
              ))}
            </nav>
            <button onClick={() => { logout(); navigate({ to: '/' }); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
