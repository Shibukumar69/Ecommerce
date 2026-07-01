import React, { useState } from 'react';
import { Mail, Shield, Truck, RotateCcw, Heart } from 'lucide-react';
import { toast } from './Toast';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success(`Subscribed successfully with: ${email}`);
    setEmail('');
  };

  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50 text-slate-600 dark:text-slate-400 transition-colors duration-300">
      {/* Service Highlights */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-display">Free Shipping</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">On all orders above ₹5000</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-display">30-Day Returns</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">No questions asked return policy</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-display">Secure Payments</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">100% SSL protected transactions</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-display">Premium Service</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Dedicated 24/7 customer support</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="flex flex-col gap-4">
            <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-2xl font-black tracking-tight text-transparent font-display">
              NEXUS
            </span>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Experience the pinnacle of modern e-commerce with our glassmorphic catalog app, built using React, Vite, Mongoose, and Tailwind.
            </p>
          </div>

          {/* Catalog Categories */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 font-display">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/" className="hover:text-violet-500 transition-colors">Home</a></li>
              <li><a href="/products" className="hover:text-violet-500 transition-colors">Shop Catalog</a></li>
              <li><a href="/dashboard" className="hover:text-violet-500 transition-colors">User Dashboard</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 font-display">Promo Coupons</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/10 text-xs">
                <span className="font-bold text-violet-400 block mb-1">NEXUS20 (20% OFF)</span>
                Apply at checkout to redeem maximum benefits.
              </div>
              <div className="p-3 rounded-xl bg-slate-500/5 border border-slate-500/10 text-xs">
                <span className="font-bold text-slate-400 block mb-1">SAVE10 (10% OFF)</span>
                Valid on all store-wide items.
              </div>
            </div>
          </div>

          {/* Newsletter Subscribe */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-display">Newsletter</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Subscribe to stay updated on new product releases and flash sales.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative grow">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-violet-500 text-slate-800 dark:text-slate-200"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-semibold transition-all duration-300"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} NexusShop. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> for digital excellence.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
