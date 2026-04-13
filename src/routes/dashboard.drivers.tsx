import { createFileRoute } from '@tanstack/react-router';
import { useAppStore } from '@/store/appStore';
import { Truck, Star, MapPin } from 'lucide-react';

export const Route = createFileRoute('/dashboard/drivers')({
  component: DriversPage,
});

function DriversPage() {
  const { drivers } = useAppStore();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Drivers</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map(d => (
          <div key={d.id} className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full gradient-green flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">{d.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{d.vehicleType}</p>
              </div>
              <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${d.isOnline ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                {d.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-accent" /> {d.rating.toFixed(1)}</span>
              <span>{d.totalTrips} trips</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {d.city}</span>
            </div>
            <p className="text-sm font-semibold mt-2">PKR {d.earnings.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
