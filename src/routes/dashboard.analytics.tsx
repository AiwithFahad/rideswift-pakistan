import { createFileRoute } from '@tanstack/react-router';
import { useAppStore } from '@/store/appStore';
import { BarChart3, TrendingUp, Users, Bike, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export const Route = createFileRoute('/dashboard/analytics')({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { rides, drivers, parcels } = useAppStore();

  const completedRides = rides.filter(r => r.status === 'completed');
  const totalRevenue = completedRides.reduce((s, r) => s + r.fare, 0);
  const avgFare = completedRides.length ? Math.round(totalRevenue / completedRides.length) : 0;

  const stats = [
    { label: 'Total Revenue', value: `PKR ${totalRevenue.toLocaleString()}`, icon: DollarSign, change: '+12%' },
    { label: 'Total Rides', value: rides.length, icon: Bike, change: '+8%' },
    { label: 'Active Drivers', value: drivers.filter(d => d.isOnline).length, icon: Users, change: '+5%' },
    { label: 'Avg Fare', value: `PKR ${avgFare}`, icon: TrendingUp, change: '+3%' },
  ];

  const cityData = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'].map(city => ({
    city,
    drivers: drivers.filter(d => d.city === city).length,
    online: drivers.filter(d => d.city === city && d.isOnline).length,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center"><s.icon className="w-5 h-5 text-primary-foreground" /></div>
              <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">{s.change}</span>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* City breakdown */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-4">City-wise Driver Distribution</h2>
        <div className="space-y-3">
          {cityData.map(c => (
            <div key={c.city} className="flex items-center gap-4">
              <span className="w-24 text-sm font-medium">{c.city}</span>
              <div className="flex-1 bg-secondary rounded-full h-6 overflow-hidden">
                <div className="gradient-green h-full rounded-full flex items-center px-2" style={{ width: `${Math.max((c.online / Math.max(c.drivers, 1)) * 100, 10)}%` }}>
                  <span className="text-[10px] text-primary-foreground font-medium">{c.online}/{c.drivers}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
