import { createFileRoute } from '@tanstack/react-router';
import { useAppStore } from '@/store/appStore';
import { Bike, Car, Star } from 'lucide-react';

export const Route = createFileRoute('/dashboard/rides')({
  component: RidesPage,
});

function RidesPage() {
  const { rides, currentUser, rateRide } = useAppStore();
  if (!currentUser) return null;

  const myRides = currentUser.role === 'admin' ? rides : rides.filter(r => r.userId === currentUser.id || r.driverId === currentUser.id.replace('u', 'driver-'));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{currentUser.role === 'driver' ? 'Ride Requests' : 'My Rides'}</h1>
      <div className="space-y-3">
        {myRides.length === 0 && <p className="text-muted-foreground text-center py-10">No rides yet</p>}
        {myRides.map(ride => (
          <div key={ride.id} className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {ride.rideType === 'car' ? <Car className="w-5 h-5 text-primary" /> : <Bike className="w-5 h-5 text-primary" />}
                <div>
                  <p className="font-medium text-sm">{ride.pickupAddress}</p>
                  <p className="text-xs text-muted-foreground">→ {ride.dropoffAddress}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${ride.status === 'completed' ? 'bg-primary/10 text-primary' : ride.status === 'cancelled' ? 'bg-destructive/10 text-destructive' : 'bg-accent/20 text-accent-foreground'}`}>
                {ride.status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>{ride.distance} km</span>
              <span>{ride.duration} min</span>
              <span className="font-semibold text-foreground">PKR {ride.fare}</span>
              <span>{new Date(ride.createdAt).toLocaleDateString()}</span>
            </div>
            {ride.status === 'completed' && !ride.rating && currentUser.role === 'user' && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Rate:</span>
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => rateRide(ride.id, s)} className="text-muted-foreground hover:text-accent transition-colors">
                    <Star className={`w-4 h-4 ${ride.rating && s <= ride.rating ? 'fill-accent text-accent' : ''}`} />
                  </button>
                ))}
              </div>
            )}
            {ride.rating && <div className="mt-2 flex items-center gap-1"><Star className="w-3 h-3 fill-accent text-accent" /><span className="text-xs">{ride.rating}/5</span></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
