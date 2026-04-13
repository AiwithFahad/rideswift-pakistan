import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Bike, Mail, Lock, Eye, EyeOff, User, Shield, Truck } from 'lucide-react';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAppStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const success = login(email, password);
    setIsLoading(false);
    if (success) {
      navigate({ to: '/dashboard' });
    } else {
      setError('Invalid email or password. Use demo credentials below.');
    }
  };

  const quickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('123456');
  };

  const demoAccounts = [
    { email: 'user@demo.com', label: 'User', icon: User, desc: 'Book rides & parcels' },
    { email: 'driver@demo.com', label: 'Driver', icon: Truck, desc: 'Accept rides & earn' },
    { email: 'admin@demo.com', label: 'Admin', icon: Shield, desc: 'Manage platform' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-green flex items-center justify-center mx-auto mb-4">
            <Bike className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Welcome to <span className="text-gradient-green">Bykea</span></h1>
          <p className="text-muted-foreground text-sm mt-1">Login to continue</p>
        </div>

        {/* Quick login */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {demoAccounts.map(acc => (
            <button
              key={acc.email}
              onClick={() => quickLogin(acc.email)}
              className="p-3 rounded-xl border border-border hover:border-primary hover:bg-secondary/50 transition-all text-center group"
            >
              <acc.icon className="w-5 h-5 mx-auto mb-1 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-xs font-medium block">{acc.label}</span>
              <span className="text-[10px] text-muted-foreground">{acc.desc}</span>
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-12 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}

          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Password for all demo accounts: <strong>123456</strong>
        </p>
      </motion.div>
    </div>
  );
}
