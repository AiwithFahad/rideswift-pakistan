import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useAppStore, PAKISTAN_CITIES } from '@/store/appStore';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';
import { Bike, Car, Package, MapPin, Users, TrendingUp, Shield, Clock, Star, ChevronRight, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <>{count.toLocaleString()}{suffix}</>;
}

function HomePage() {
  const { isAuthenticated } = useAppStore();

  const services = [
    { icon: Bike, title: 'Bike Ride', desc: 'Affordable two-wheeler rides across the city. Quick and reliable.', color: 'bg-primary/10 text-primary' },
    { icon: Car, title: 'Car Ride', desc: 'Comfortable car rides for longer distances. Premium experience.', color: 'bg-accent/20 text-accent-foreground' },
    { icon: Package, title: 'Parcel Delivery', desc: 'Send packages anywhere in the city. Fast and secure delivery.', color: 'bg-secondary text-secondary-foreground' },
  ];

  const features = [
    { icon: Shield, title: 'We prioritize your safety', desc: 'All our partners are verified and trained through background checks to guarantee your safety.' },
    { icon: Star, title: 'Maintain high quality standards', desc: 'We maintain strict quality standards for all our services to ensure the best experience.' },
    { icon: Clock, title: 'Provide transparent pricing', desc: 'Our charges are fully transparent. No surprise fees, no hidden charges, just fair pricing.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-sm font-medium text-secondary-foreground mb-6">
                <span className="w-2 h-2 rounded-full gradient-green" />
                Pakistan's #1 Ride-Hailing Platform
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] leading-tight mb-6">
                <span className="text-gradient-green">Bykea</span> is your everyday,{' '}
                <span className="text-gradient-green">everything</span> platform
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Book rides, send parcels, and make payments — all from one app. Serving millions across Pakistan's major cities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={isAuthenticated ? '/book-ride' : '/login'}>
                  <Button variant="hero" size="xl">
                    Book a Ride <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to={isAuthenticated ? '/send-parcel' : '/login'}>
                  <Button variant="heroOutline" size="xl">
                    Send a Parcel <Package className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
              {/* Demo credentials */}
              <div className="mt-8 p-4 rounded-xl bg-secondary/50 border border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">🔑 Demo Credentials (Password: 123456)</p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="px-2 py-1 rounded-md bg-background">👤 user@demo.com</span>
                  <span className="px-2 py-1 rounded-md bg-background">🏍️ driver@demo.com</span>
                  <span className="px-2 py-1 rounded-md bg-background">⚙️ admin@demo.com</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 rounded-3xl gradient-green opacity-10 blur-3xl" />
                <div className="relative glass-card rounded-3xl p-8 h-full flex flex-col justify-center items-center">
                  <div className="w-32 h-32 rounded-full gradient-green flex items-center justify-center mb-6">
                    <Bike className="w-16 h-16 text-primary-foreground" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {PAKISTAN_CITIES.slice(0, 4).map(city => (
                      <div key={city.name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span className="text-sm">{city.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Tabs */}
      <section className="py-20 gradient-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background/95 backdrop-blur rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group"
              >
                <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-5`}>
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{service.desc}</p>
                <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ChevronRight className="w-4 h-4" />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-2">
              <p className="text-sm font-medium text-primary uppercase tracking-wider">Why Choose Bykea?</p>
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="p-6 rounded-xl hover:bg-secondary/50 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg gradient-green flex items-center justify-center shrink-0 mt-1">
                      <feature.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{feature.title}</h4>
                      <p className="text-muted-foreground text-sm">{feature.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-10 text-center"
            >
              <h3 className="text-2xl font-bold mb-2">Our Foot Print in Pakistan</h3>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {PAKISTAN_CITIES.map(city => (
                  <div key={city.name} className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">{city.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-display)]">Trusted by Millions</h2>
            <p className="text-muted-foreground mt-2">Growing every day across Pakistan</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Active Riders', value: 25000, icon: Users, suffix: '+' },
              { label: 'Completed Trips', value: 5000000, icon: TrendingUp, suffix: '+' },
              { label: 'Cities Covered', value: 6, icon: MapPin, suffix: '' },
              { label: 'Driver Partners', value: 50000, icon: Bike, suffix: '+' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 text-center shadow-sm border border-border"
              >
                <div className="w-12 h-12 rounded-xl gradient-green mx-auto flex items-center justify-center mb-4">
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gradient-green">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="gradient-green rounded-3xl p-12 text-primary-foreground"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to ride with Bykea?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">Join millions of Pakistanis who trust Bykea for their daily transportation and delivery needs.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={isAuthenticated ? '/book-ride' : '/login'}>
                <Button variant="accent" size="xl">
                  Get Started Today <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
