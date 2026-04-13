import { createFileRoute } from '@tanstack/react-router';
import { useAppStore } from '@/store/appStore';
import { Package } from 'lucide-react';

export const Route = createFileRoute('/dashboard/parcels')({
  component: ParcelsPage,
});

function ParcelsPage() {
  const { parcels, currentUser } = useAppStore();
  if (!currentUser) return null;

  const myParcels = parcels.filter(p => p.userId === currentUser.id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Parcels</h1>
      {myParcels.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No parcels sent yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myParcels.map(parcel => (
            <div key={parcel.id} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-sm">{parcel.pickupAddress} → {parcel.dropoffAddress}</p>
                  <p className="text-xs text-muted-foreground mt-1">To: {parcel.receiverName} · {parcel.parcelType} · {parcel.weight}kg</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium capitalize bg-primary/10 text-primary">{parcel.status}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <span className="font-semibold text-foreground">PKR {parcel.fare}</span>
                <span>{new Date(parcel.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
