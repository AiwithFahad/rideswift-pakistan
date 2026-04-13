import { Link } from '@tanstack/react-router';
import { Bike, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-green flex items-center justify-center">
                <Bike className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold font-[family-name:var(--font-display)]">BYKEA</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              Pakistan's #1 ride-hailing and delivery platform. Book rides, send parcels, and more.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm opacity-70">
              <Link to="/" className="block hover:opacity-100 transition-opacity">Home</Link>
              <Link to="/book-ride" className="block hover:opacity-100 transition-opacity">Book Ride</Link>
              <Link to="/send-parcel" className="block hover:opacity-100 transition-opacity">Send Parcel</Link>
              <Link to="/login" className="block hover:opacity-100 transition-opacity">Login</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <div className="space-y-2 text-sm opacity-70">
              <p>Bike Rides</p>
              <p>Car Rides</p>
              <p>Parcel Delivery</p>
              <p>Corporate Solutions</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm opacity-70">
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> +92 42 111 295 321</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@bykea.com</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Lahore, Pakistan</div>
            </div>
          </div>
        </div>
        <div className="border-t border-background/20 mt-12 pt-8 text-center text-sm opacity-50">
          © {new Date().getFullYear()} Bykea Clone. Built with ❤️ in Pakistan. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
