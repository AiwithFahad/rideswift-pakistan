import { create } from 'zustand';

export type UserRole = 'user' | 'driver' | 'admin';
export type RideType = 'bike' | 'car';
export type RideStatus = 'pending' | 'accepted' | 'arriving' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentMode = 'cash' | 'wallet' | 'card';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  walletBalance: number;
}

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  vehicleType: RideType;
  rating: number;
  totalTrips: number;
  isOnline: boolean;
  lat: number;
  lng: number;
  city: string;
  earnings: number;
}

export interface Ride {
  id: string;
  userId: string;
  driverId?: string;
  driverName?: string;
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  pickupAddress: string;
  dropoffAddress: string;
  rideType: RideType;
  status: RideStatus;
  fare: number;
  distance: number;
  duration: number;
  paymentMode: PaymentMode;
  createdAt: string;
  rating?: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'ride' | 'parcel' | 'payment' | 'system';
  read: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  createdAt: string;
}

export interface Parcel {
  id: string;
  userId: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  parcelType: string;
  weight: number;
  fare: number;
  status: RideStatus;
  driverId?: string;
  createdAt: string;
}

interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  rides: Ride[];
  parcels: Parcel[];
  drivers: DriverInfo[];
  notifications: Notification[];
  transactions: Transaction[];
  activeRide: Ride | null;
  isSurge: boolean;
  surgeMultiplier: number;

  login: (email: string, password: string) => boolean;
  logout: () => void;
  bookRide: (ride: Omit<Ride, 'id' | 'createdAt' | 'driverId' | 'driverName' | 'status'>) => Ride;
  updateRideStatus: (rideId: string, status: RideStatus) => void;
  rateRide: (rideId: string, rating: number) => void;
  cancelRide: (rideId: string) => void;
  sendParcel: (parcel: Omit<Parcel, 'id' | 'createdAt' | 'status' | 'driverId'>) => Parcel;
  addMoney: (amount: number) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  toggleDriverOnline: () => void;
  setActiveRide: (ride: Ride | null) => void;
}

const DEMO_USERS: Record<string, User> = {
  'user@demo.com': { id: 'u1', name: 'Ahmed Khan', email: 'user@demo.com', role: 'user', phone: '+92 300 1234567', walletBalance: 5000 },
  'driver@demo.com': { id: 'd1', name: 'Bilal Hussain', email: 'driver@demo.com', role: 'driver', phone: '+92 301 7654321', walletBalance: 12500 },
  'admin@demo.com': { id: 'a1', name: 'Sara Admin', email: 'admin@demo.com', role: 'admin', phone: '+92 302 9876543', walletBalance: 0 },
};

const CITIES = [
  { name: 'Lahore', lat: 31.5204, lng: 74.3587 },
  { name: 'Karachi', lat: 24.8607, lng: 67.0011 },
  { name: 'Islamabad', lat: 33.6844, lng: 73.0479 },
  { name: 'Rawalpindi', lat: 33.5651, lng: 73.0169 },
  { name: 'Faisalabad', lat: 31.4504, lng: 73.135 },
  { name: 'Multan', lat: 30.1575, lng: 71.5249 },
];

function generateDrivers(): DriverInfo[] {
  const names = ['Ali Raza', 'Hassan Shah', 'Umar Farooq', 'Imran Malik', 'Kashif Ahmed', 'Tariq Mehmood', 'Junaid Iqbal', 'Faisal Khan', 'Zubair Abbas', 'Nawaz Sharif', 'Waqas Ali', 'Sohail Ahmad'];
  return names.map((name, i) => {
    const city = CITIES[i % CITIES.length];
    return {
      id: `driver-${i}`,
      name,
      phone: `+92 30${i} ${Math.floor(1000000 + Math.random() * 9000000)}`,
      vehicleType: i % 3 === 0 ? 'car' as RideType : 'bike' as RideType,
      rating: 3.5 + Math.random() * 1.5,
      totalTrips: Math.floor(100 + Math.random() * 2000),
      isOnline: Math.random() > 0.3,
      lat: city.lat + (Math.random() - 0.5) * 0.05,
      lng: city.lng + (Math.random() - 0.5) * 0.05,
      city: city.name,
      earnings: Math.floor(5000 + Math.random() * 50000),
    };
  });
}

function generateRides(): Ride[] {
  const statuses: RideStatus[] = ['completed', 'completed', 'completed', 'in_progress', 'cancelled'];
  return Array.from({ length: 8 }, (_, i) => ({
    id: `ride-${i}`,
    userId: 'u1',
    driverId: `driver-${i % 6}`,
    driverName: generateDrivers()[i % 6].name,
    pickupLat: 31.52 + Math.random() * 0.03,
    pickupLng: 74.35 + Math.random() * 0.03,
    dropoffLat: 31.53 + Math.random() * 0.03,
    dropoffLng: 74.36 + Math.random() * 0.03,
    pickupAddress: `Street ${i + 1}, Gulberg, Lahore`,
    dropoffAddress: `Block ${String.fromCharCode(65 + i)}, DHA, Lahore`,
    rideType: i % 3 === 0 ? 'car' as RideType : 'bike' as RideType,
    status: statuses[i % statuses.length],
    fare: Math.floor(100 + Math.random() * 500),
    distance: Math.round((2 + Math.random() * 15) * 10) / 10,
    duration: Math.floor(10 + Math.random() * 40),
    paymentMode: 'cash' as PaymentMode,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    rating: statuses[i % statuses.length] === 'completed' ? Math.floor(3 + Math.random() * 3) : undefined,
  }));
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  rides: generateRides(),
  parcels: [],
  drivers: generateDrivers(),
  notifications: [
    { id: 'n1', message: 'Welcome to Bykea! Book your first ride today.', type: 'system', read: false, createdAt: new Date().toISOString() },
    { id: 'n2', message: 'Your wallet has been credited with PKR 500 bonus.', type: 'payment', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  ],
  transactions: [
    { id: 't1', amount: 500, type: 'credit', description: 'Welcome bonus', createdAt: new Date().toISOString() },
    { id: 't2', amount: 250, type: 'debit', description: 'Ride payment - Gulberg to DHA', createdAt: new Date(Date.now() - 86400000).toISOString() },
  ],
  activeRide: null,
  isSurge: false,
  surgeMultiplier: 1,

  login: (email, password) => {
    if (password !== '123456') return false;
    const user = DEMO_USERS[email];
    if (!user) return false;
    set({ currentUser: user, isAuthenticated: true });
    return true;
  },

  logout: () => set({ currentUser: null, isAuthenticated: false, activeRide: null }),

  bookRide: (rideData) => {
    const state = get();
    const availableDrivers = state.drivers.filter(d => d.isOnline && d.vehicleType === rideData.rideType);
    const driver = availableDrivers.length > 0 ? availableDrivers[Math.floor(Math.random() * availableDrivers.length)] : state.drivers[0];
    const ride: Ride = {
      ...rideData,
      id: `ride-${Date.now()}`,
      driverId: driver.id,
      driverName: driver.name,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    set(s => ({
      rides: [ride, ...s.rides],
      activeRide: ride,
    }));
    // Simulate status progression
    setTimeout(() => {
      set(s => {
        const updated = s.rides.map(r => r.id === ride.id ? { ...r, status: 'accepted' as RideStatus } : r);
        return { rides: updated, activeRide: updated.find(r => r.id === ride.id) || null };
      });
      get().addNotification({ message: `${driver.name} has accepted your ride!`, type: 'ride' });
    }, 2000);
    setTimeout(() => {
      set(s => {
        const updated = s.rides.map(r => r.id === ride.id ? { ...r, status: 'arriving' as RideStatus } : r);
        return { rides: updated, activeRide: updated.find(r => r.id === ride.id) || null };
      });
      get().addNotification({ message: `${driver.name} is arriving at your location.`, type: 'ride' });
    }, 5000);
    setTimeout(() => {
      set(s => {
        const updated = s.rides.map(r => r.id === ride.id ? { ...r, status: 'in_progress' as RideStatus } : r);
        return { rides: updated, activeRide: updated.find(r => r.id === ride.id) || null };
      });
    }, 8000);
    setTimeout(() => {
      set(s => {
        const updated = s.rides.map(r => r.id === ride.id ? { ...r, status: 'completed' as RideStatus } : r);
        return { rides: updated, activeRide: null };
      });
      get().addNotification({ message: `Ride completed! Fare: PKR ${rideData.fare}`, type: 'ride' });
    }, 15000);
    return ride;
  },

  updateRideStatus: (rideId, status) => set(s => ({
    rides: s.rides.map(r => r.id === rideId ? { ...r, status } : r),
  })),

  rateRide: (rideId, rating) => set(s => ({
    rides: s.rides.map(r => r.id === rideId ? { ...r, rating } : r),
  })),

  cancelRide: (rideId) => set(s => ({
    rides: s.rides.map(r => r.id === rideId ? { ...r, status: 'cancelled' } : r),
    activeRide: s.activeRide?.id === rideId ? null : s.activeRide,
  })),

  sendParcel: (parcelData) => {
    const parcel: Parcel = {
      ...parcelData,
      id: `parcel-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    set(s => ({ parcels: [parcel, ...s.parcels] }));
    get().addNotification({ message: 'Parcel booking confirmed! A rider will pick it up soon.', type: 'parcel' });
    return parcel;
  },

  addMoney: (amount) => set(s => ({
    currentUser: s.currentUser ? { ...s.currentUser, walletBalance: s.currentUser.walletBalance + amount } : null,
    transactions: [{ id: `t-${Date.now()}`, amount, type: 'credit', description: 'Wallet top-up', createdAt: new Date().toISOString() }, ...s.transactions],
  })),

  addNotification: (notification) => set(s => ({
    notifications: [{ ...notification, id: `n-${Date.now()}`, read: false, createdAt: new Date().toISOString() }, ...s.notifications],
  })),

  markNotificationRead: (id) => set(s => ({
    notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n),
  })),

  toggleDriverOnline: () => set(s => ({
    drivers: s.drivers.map(d => d.id === 'd1' ? { ...d, isOnline: !d.isOnline } : d),
  })),

  setActiveRide: (ride) => set({ activeRide: ride }),
}));

export const PAKISTAN_CITIES = CITIES;

export function calculateFare(distanceKm: number, rideType: RideType, surgeMultiplier = 1): number {
  const baseFare = rideType === 'bike' ? 30 : 80;
  const perKm = rideType === 'bike' ? 15 : 25;
  return Math.round((baseFare + distanceKm * perKm) * surgeMultiplier);
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
