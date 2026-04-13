import { createFileRoute, Link } from '@tanstack/react-router';
import { useAppStore } from '@/store/appStore';
import { motion } from 'framer-motion';
import { Bike, Package, Wallet, TrendingUp, Users, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardOverview,
});

function DashboardOverview() {
  const { currentUser, rides, parcels, drivers, notifications } = useAppStore();
  if (!currentUser) return null;
  const role = currentUser.role;

  const userStats = [
    { label: 'Total Rides', value: rides.filter(r => r.userId === currentUser.id).length, icon: Bike, color: 'gradient-green' },
    { label: 'Parcels Sent', value: parcels.filter(p => p.userId === currentUser.id).length, icon: Package, color: 'gradient-yellow' },
    { label: 'Wallet Balance', value: `PKR ${currentUser.walletBalance.toLocaleString()}`, icon: Wallet, color: 'gradient-green' },
    { label: 'Notifications', value: notifications.filter(n => !n.read).length, icon: TrendingUp, color: 'gradient-yellow' },
  ];

  const adminStats = [
    { label: 'Total Users', value: 3, icon: Users, color: 'gradient-green' },
    { label: 'Total Drivers', value: drivers.length, icon: Bike, color: 'gradient-yellow' },
    { label: 'Total Rides', value: rides.length, icon: MapPin, color: 'gradient-green' },
    { label: 'Online Drivers', value: drivers.filter(d => d.isOnline).length, icon: TrendingUp, color: 'gradient-yellow' },
  ];

  const driverStats = [
    { label: 'Earnings', value: 'PKR 12,500', icon: Wallet, color: 'gradient-green' },
    { label: 'Total Trips', value: rides.filter(r => r.driverId === 'd1').length, icon: Bike, color: 'gradient-yellow' },
    { label: 'Rating', value: '4.8 ★', icon: TrendingUp, color: 'gradient-green' },
    { label: 'Status', value: drivers.find(d => d.id === 'd1')?.isOnline ? 'Online' : 'Offline', icon: MapPin, color: 'gradient-yellow' },
  ];

  const stats = role === 'admin' ? adminStats : role === 'driver' ? driverStats : userStats;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Welcome, {currentUser.name}!</h1>
        <p className="text-muted-foreground text-sm capitalize">{role} Dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent rides */}
      {role !== 'admin' && (
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Rides</h2>
            <Link to="/dashboard/rides" className="text-sm text-primary font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {rides.slice(0, 3).map(ride => (
              <div key={ride.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bike className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{ride.pickupAddress} → {ride.dropoffAddress}</p>
                    <p className="text-xs text-muted-foreground">{new Date(ride.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">PKR {ride.fare}</p>
                  <span className={`text-xs capitalize ${ride.status === 'completed' ? 'text-primary' : ride.status === 'cancelled' ? 'text-destructive' : 'text-muted-foreground'}`}>{ride.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {role === 'user' && (
        <div className="mt-6 flex gap-4">
          <Link to="/book-ride"><Button variant="hero">Book a Ride</Button></Link>
          <Link to="/send-parcel"><Button variant="heroOutline">Send Parcel</Button></Link>
        </div>
      )}
    </div>
  );
}
