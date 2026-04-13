import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { motion } from 'framer-motion';
import { Navigation, Clock, MapPin, Phone, Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/tracking')({
  component: TrackingPage,
});

function TrackingPage() {
  const { isAuthenticated, activeRide, rides, drivers } = useAppStore();
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [driverPos, setDriverPos] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: '/login' });
  }, [isAuthenticated, navigate]);

  const currentRide = activeRide || rides.find(r => r.status === 'in_progress' || r.status === 'arriving' || r.status === 'accepted');
  const driver = currentRide?.driverId ? drivers.find(d => d.id === currentRide.driverId) : null;

  // Simulate driver movement
  useEffect(() => {
    if (!currentRide) return;
    let lat = currentRide.pickupLat;
    let lng = currentRide.pickupLng;
    const targetLat = currentRide.dropoffLat;
    const targetLng = currentRide.dropoffLng;

    const interval = setInterval(() => {
      lat += (targetLat - lat) * 0.02 + (Math.random() - 0.5) * 0.001;
      lng += (targetLng - lng) * 0.02 + (Math.random() - 0.5) * 0.001;
      setDriverPos({ lat, lng });
    }, 2000);

    return () => clearInterval(interval);
  }, [currentRide]);

  // Map
  useEffect(() => {
    if (!mapRef.current || !currentRide) return;
    import('leaflet').then(L => {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(css);

      setTimeout(() => {
        if (!mapRef.current) return;
        const existingMap = (mapRef.current as any)._leafletMap;
        if (existingMap) existingMap.remove();

        const map = L.map(mapRef.current).setView([currentRide.pickupLat, currentRide.pickupLng], 12);
        (mapRef.current as any)._leafletMap = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);

        const pickupIcon = L.divIcon({ className: '', html: '<div style="background:#22c55e;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>', iconSize: [14, 14], iconAnchor: [7, 7] });
        const dropoffIcon = L.divIcon({ className: '', html: '<div style="background:#ef4444;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>', iconSize: [14, 14], iconAnchor: [7, 7] });

        L.marker([currentRide.pickupLat, currentRide.pickupLng], { icon: pickupIcon }).addTo(map);
        L.marker([currentRide.dropoffLat, currentRide.dropoffLng], { icon: dropoffIcon }).addTo(map);
        L.polyline([[currentRide.pickupLat, currentRide.pickupLng], [currentRide.dropoffLat, currentRide.dropoffLng]], { color: '#22c55e', weight: 3, dashArray: '8,6' }).addTo(map);

        const bounds = L.latLngBounds([[currentRide.pickupLat, currentRide.pickupLng], [currentRide.dropoffLat, currentRide.dropoffLng]]);
        map.fitBounds(bounds, { padding: [50, 50] });

        // Driver marker
        if (driverPos) {
          const driverIcon = L.divIcon({ className: '', html: '<div style="background:#facc15;width:18px;height:18px;border-radius:50%;border:3px solid #16a34a;box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>', iconSize: [18, 18], iconAnchor: [9, 9] });
          L.marker([driverPos.lat, driverPos.lng], { icon: driverIcon }).addTo(map);
        }
      }, 100);
    });
  }, [currentRide, driverPos]);

  if (!isAuthenticated) return null;

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-blue-100 text-blue-800',
    arriving: 'bg-purple-100 text-purple-800',
    in_progress: 'bg-primary/10 text-primary',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {currentRide ? (
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-border shadow-sm" style={{ minHeight: 500 }}>
              <div ref={mapRef} className="w-full h-full min-h-[500px]" />
            </div>
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Live Tracking</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[currentRide.status] || ''}`}>
                    {currentRide.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Status timeline */}
                <div className="space-y-3">
                  {['pending', 'accepted', 'arriving', 'in_progress', 'completed'].map((s, i) => {
                    const statusIndex = ['pending', 'accepted', 'arriving', 'in_progress', 'completed'].indexOf(currentRide.status);
                    const isActive = i <= statusIndex;
                    return (
                      <div key={s} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${isActive ? 'gradient-green' : 'bg-border'}`} />
                        <span className={`text-sm capitalize ${isActive ? 'font-medium' : 'text-muted-foreground'}`}>{s.replace('_', ' ')}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Driver info */}
                {driver && (
                  <div className="rounded-xl bg-secondary/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full gradient-green flex items-center justify-center">
                        <User className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{driver.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="w-3 h-3 text-accent" /> {driver.rating.toFixed(1)} · {driver.totalTrips} trips
                        </div>
                      </div>
                      <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="w-4 h-4 text-primary" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Ride details */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Pickup</p>
                      <p className="text-sm font-medium">{currentRide.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Navigation className="w-4 h-4 text-destructive mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Dropoff</p>
                      <p className="text-sm font-medium">{currentRide.dropoffAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-secondary/50 p-4 flex justify-between">
                  <div><p className="text-xs text-muted-foreground">Distance</p><p className="font-semibold">{currentRide.distance} km</p></div>
                  <div><p className="text-xs text-muted-foreground">ETA</p><p className="font-semibold">{currentRide.duration} min</p></div>
                  <div><p className="text-xs text-muted-foreground">Fare</p><p className="font-semibold text-gradient-green">PKR {currentRide.fare}</p></div>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-secondary mx-auto flex items-center justify-center mb-6">
              <Navigation className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Active Ride</h2>
            <p className="text-muted-foreground mb-6">Book a ride to start tracking</p>
            <Button variant="hero" onClick={() => navigate({ to: '/book-ride' })}>Book a Ride</Button>
          </div>
        )}
      </div>
    </div>
  );
}
