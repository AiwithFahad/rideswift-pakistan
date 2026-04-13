import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Package, User, Phone, MapPin, ArrowRight, Weight, Tag } from 'lucide-react';
import { PAKISTAN_CITIES } from '@/store/appStore';

export const Route = createFileRoute('/send-parcel')({
  component: SendParcelPage,
});

function SendParcelPage() {
  const { isAuthenticated, currentUser, sendParcel } = useAppStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'done'>('form');
  const [form, setForm] = useState({
    senderName: '',
    senderPhone: '',
    receiverName: '',
    receiverPhone: '',
    pickupAddress: '',
    dropoffAddress: '',
    pickupCity: PAKISTAN_CITIES[0],
    dropoffCity: PAKISTAN_CITIES[1],
    parcelType: 'document',
    weight: 1,
  });

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: '/login' });
  }, [isAuthenticated, navigate]);

  const parcelTypes = [
    { value: 'document', label: 'Document', price: 100 },
    { value: 'small', label: 'Small Package', price: 200 },
    { value: 'medium', label: 'Medium Package', price: 350 },
    { value: 'large', label: 'Large Package', price: 500 },
  ];

  const selectedType = parcelTypes.find(p => p.value === form.parcelType) || parcelTypes[0];
  const fare = selectedType.price + (form.weight - 1) * 50;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    sendParcel({
      userId: currentUser.id,
      senderName: form.senderName || currentUser.name,
      senderPhone: form.senderPhone || currentUser.phone,
      receiverName: form.receiverName,
      receiverPhone: form.receiverPhone,
      pickupAddress: form.pickupAddress || form.pickupCity.name,
      dropoffAddress: form.dropoffAddress || form.dropoffCity.name,
      pickupLat: form.pickupCity.lat,
      pickupLng: form.pickupCity.lng,
      dropoffLat: form.dropoffCity.lat,
      dropoffLng: form.dropoffCity.lng,
      parcelType: form.parcelType,
      weight: form.weight,
      fare,
    });
    setStep('done');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8">
          {step === 'done' ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full gradient-green mx-auto flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Parcel Booked!</h2>
              <p className="text-muted-foreground mb-6">A rider will pick up your parcel shortly.</p>
              <Button variant="hero" onClick={() => navigate({ to: '/dashboard' })}>Go to Dashboard</Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Send a Parcel</h1>
                  <p className="text-sm text-muted-foreground">Fast and secure delivery across Pakistan</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Sender */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Sender Details</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input value={form.senderName} onChange={e => setForm(f => ({ ...f, senderName: e.target.value }))} placeholder="Sender name" className="px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    <input value={form.senderPhone} onChange={e => setForm(f => ({ ...f, senderPhone: e.target.value }))} placeholder="Phone number" className="px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>

                {/* Receiver */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> Receiver Details</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input value={form.receiverName} onChange={e => setForm(f => ({ ...f, receiverName: e.target.value }))} placeholder="Receiver name" required className="px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    <input value={form.receiverPhone} onChange={e => setForm(f => ({ ...f, receiverPhone: e.target.value }))} placeholder="Phone number" required className="px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Locations</h3>
                  <div className="space-y-3">
                    <select value={form.pickupCity.name} onChange={e => { const c = PAKISTAN_CITIES.find(c => c.name === e.target.value); if (c) setForm(f => ({ ...f, pickupCity: c })); }} className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      {PAKISTAN_CITIES.map(c => <option key={c.name}>{c.name}</option>)}
                    </select>
                    <select value={form.dropoffCity.name} onChange={e => { const c = PAKISTAN_CITIES.find(c => c.name === e.target.value); if (c) setForm(f => ({ ...f, dropoffCity: c })); }} className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      {PAKISTAN_CITIES.map(c => <option key={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Parcel type */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Tag className="w-4 h-4 text-primary" /> Parcel Type</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {parcelTypes.map(p => (
                      <button key={p.value} type="button" onClick={() => setForm(f => ({ ...f, parcelType: p.value }))}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${form.parcelType === p.value ? 'border-primary bg-primary/5' : 'border-border'}`}>
                        <span className="text-sm font-medium block">{p.label}</span>
                        <span className="text-xs text-muted-foreground">PKR {p.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Weight className="w-4 h-4 text-primary" /> Weight (kg)</h3>
                  <input type="number" min={1} max={50} value={form.weight} onChange={e => setForm(f => ({ ...f, weight: Number(e.target.value) }))} className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>

                {/* Price */}
                <div className="rounded-xl bg-secondary/50 p-4 flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-gradient-green">PKR {fare}</span>
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full">
                  Send Parcel <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
