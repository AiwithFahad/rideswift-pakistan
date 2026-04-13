import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import { useAppStore, calculateFare, calculateDistance, PAKISTAN_CITIES } from '@/store/appStore';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Bike, Car, CreditCard, Banknote, Wallet, ArrowRight } from 'lucide-react';
import type { RideType, PaymentMode } from '@/store/appStore';

export const Route = createFileRoute('/book-ride')({
  component: BookRidePage,
});

function BookRidePage() {
  const { isAuthenticated, currentUser, bookRide, isSurge, surgeMultiplier } = useAppStore();
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [rideType, setRideType] = useState<RideType>('bike');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCity, setPickupCity] = useState(PAKISTAN_CITIES[0]);
  const [dropoffCity, setDropoffCity] = useState(PAKISTAN_CITIES[1]);
  const [step, setStep] = useState<'select' | 'confirm' | 'booked'>('select');
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: '/login' });
  }, [isAuthenticated, navigate]);

  const distance = calculateDistance(pickupCity.lat, pickupCity.lng, dropoffCity.lat, dropoffCity.lng);
  const fare = calculateFare(distance, rideType, isSurge ? surgeMultiplier : 1);
  const duration = Math.round(distance * 3.5);

  useEffect(() => {
    if (!mapRef.current || map) return;
    import('leaflet').then(L => {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(css);

      setTimeout(() => {
        if (!mapRef.current) return;
        const m = L.map(mapRef.current).setView([30.3753, 69.3451], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(m);
        setMap(m);
      }, 100);
    });
  }, [map]);

  useEffect(() => {
    if (!map) return;
    import('leaflet').then(L => {
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) map.removeLayer(layer);
      });

      const pickupIcon = L.divIcon({ className: '', html: '<div style="background:#22c55e;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>', iconSize: [14, 14], iconAnchor: [7, 7] });
      const dropoffIcon = L.divIcon({ className: '', html: '<div style="background:#ef4444;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>', iconSize: [14, 14], iconAnchor: [7, 7] });

      L.marker([pickupCity.lat, pickupCity.lng], { icon: pickupIcon }).addTo(map).bindPopup(`Pickup: ${pickupCity.name}`);
      L.marker([dropoffCity.lat, dropoffCity.lng], { icon: dropoffIcon }).addTo(map).bindPopup(`Dropoff: ${dropoffCity.name}`);
      L.polyline([[pickupCity.lat, pickupCity.lng], [dropoffCity.lat, dropoffCity.lng]], { color: '#22c55e', weight: 3, dashArray: '10,6' }).addTo(map);

      const bounds = L.latLngBounds([[pickupCity.lat, pickupCity.lng], [dropoffCity.lat, dropoffCity.lng]]);
      map.fitBounds(bounds, { padding: [40, 40] });
    });
  }, [map, pickupCity, dropoffCity]);

  const handleBook = () => {
    if (!currentUser) return;
    bookRide({
      userId: currentUser.id,
      pickupLat: pickupCity.lat,
      pickupLng: pickupCity.lng,
      dropoffLat: dropoffCity.lat,
      dropoffLng: dropoffCity.lng,
      pickupAddress: pickup || pickupCity.name,
      dropoffAddress: dropoff || dropoffCity.name,
      rideType,
      fare,
      distance: Math.round(distance * 10) / 10,
      duration,
      paymentMode,
    });
    setStep('booked');
    setTimeout(() => navigate({ to: '/tracking' }), 2000);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Map */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-border shadow-sm" style={{ minHeight: 500 }}>
            <div ref={mapRef} className="w-full h-full min-h-[500px]" />
          </div>

          {/* Booking Panel */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl p-6 space-y-6">
              {step === 'booked' ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full gradient-green mx-auto flex items-center justify-center mb-4">
                    <Navigation className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Ride Booked!</h2>
                  <p className="text-muted-foreground text-sm">Finding your driver... Redirecting to tracking.</p>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-xl font-bold mb-1">Book a Ride</h2>
                    <p className="text-sm text-muted-foreground">Choose your pickup and destination</p>
                  </div>

                  {/* Ride type */}
                  <div className="flex gap-3">
                    {[
                      { type: 'bike' as RideType, icon: Bike, label: 'Bike' },
                      { type: 'car' as RideType, icon: Car, label: 'Car' },
                    ].map(opt => (
                      <button
                        key={opt.type}
                        onClick={() => setRideType(opt.type)}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${rideType === opt.type ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
                      >
                        <opt.icon className={`w-8 h-8 ${rideType === opt.type ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-sm font-medium">{opt.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Locations */}
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary" />
                      <select
                        value={pickupCity.name}
                        onChange={e => { const c = PAKISTAN_CITIES.find(c => c.name === e.target.value); if (c) setPickupCity(c); }}
                        className="w-full pl-9 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {PAKISTAN_CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <input
                      value={pickup}
                      onChange={e => setPickup(e.target.value)}
                      placeholder="Pickup address (optional)"
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-destructive" />
                      <select
                        value={dropoffCity.name}
                        onChange={e => { const c = PAKISTAN_CITIES.find(c => c.name === e.target.value); if (c) setDropoffCity(c); }}
                        className="w-full pl-9 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {PAKISTAN_CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <input
                      value={dropoff}
                      onChange={e => setDropoff(e.target.value)}
                      placeholder="Dropoff address (optional)"
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  {/* Payment */}
                  <div>
                    <p className="text-sm font-medium mb-2">Payment Method</p>
                    <div className="flex gap-2">
                      {[
                        { mode: 'cash' as PaymentMode, icon: Banknote, label: 'Cash' },
                        { mode: 'wallet' as PaymentMode, icon: Wallet, label: 'Wallet' },
                        { mode: 'card' as PaymentMode, icon: CreditCard, label: 'Card' },
                      ].map(opt => (
                        <button
                          key={opt.mode}
                          onClick={() => setPaymentMode(opt.mode)}
                          className={`flex-1 py-2.5 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${paymentMode === opt.mode ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'}`}
                        >
                          <opt.icon className="w-3.5 h-3.5" /> {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fare summary */}
                  <div className="rounded-xl bg-secondary/50 p-4 space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Distance</span><span className="font-medium">{Math.round(distance * 10) / 10} km</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Duration (est.)</span><span className="font-medium">{duration} min</span></div>
                    {isSurge && <div className="flex justify-between text-sm text-destructive"><span>Surge ({surgeMultiplier}x)</span><span>Applied</span></div>}
                    <div className="border-t border-border pt-2 flex justify-between"><span className="font-semibold">Total Fare</span><span className="text-xl font-bold text-gradient-green">PKR {fare}</span></div>
                  </div>

                  <Button variant="hero" size="lg" className="w-full" onClick={handleBook}>
                    Confirm Ride <ArrowRight className="w-5 h-5" />
                  </Button>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
