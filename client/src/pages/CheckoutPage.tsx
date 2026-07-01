import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, CheckCircle2, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from '../components/Toast';
import confetti from 'canvas-confetti';

const CheckoutPage: React.FC = () => {
  const { cartItems, subtotal, shipping, tax, total, discountPercentage, coupon, clearCart } = useCart();
  const { userInfo } = useAuth();


  // Multi-step state: 'form' | 'success'
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [createdOrderId, setCreatedOrderId] = useState('');

  // Shipping Form State
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  // Credit Card Form State
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [processing, setProcessing] = useState(false);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setProcessing(true);

    try {
      // 1. Create order on the backend
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.discountPrice && item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price,
          image: item.product.image,
        })),
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: 'Credit Card',
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
        discountAmount: Math.round((subtotal * discountPercentage) / 100 * 100) / 100,
        couponApplied: coupon,
      };

      const { data: order } = await api.post('/orders', orderPayload);

      // 2. Mock payment completion
      const paymentPayload = {
        id: `PAY-${Date.now()}`,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: userInfo?.email || 'buyer@nexus.com',
      };

      await api.put(`/orders/${order._id}/pay`, paymentPayload);

      // 3. Complete checkout
      setCreatedOrderId(order._id);
      setStep('success');
      clearCart();

      // Trigger Confetti Celebration!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error occurred compiling checkout');
    } finally {
      setProcessing(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center flex flex-col items-center gap-6 animate-fade-in">
        <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-2">
          <CheckCircle2 className="h-10 w-10 animate-bounce" />
        </div>
        <h2 className="text-2xl font-black tracking-tight font-display text-slate-900 dark:text-white">Order Confirmed!</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
          Thank you for your purchase. We have compiled your order details and processing has commenced.
        </p>

        <div className="rounded-2xl border border-slate-200/10 bg-slate-500/5 p-4 w-full text-xs font-mono text-slate-400">
          <span className="font-bold text-slate-800 dark:text-slate-200">Order ID:</span> {createdOrderId}
        </div>

        <div className="flex gap-4 w-full mt-4">
          <Link
            to="/dashboard"
            className="w-1/2 rounded-xl border border-slate-700/30 text-xs font-bold text-slate-600 dark:text-slate-300 py-3.5 hover:bg-violet-500/10 flex items-center justify-center gap-1.5"
          >
            Track Order
          </Link>
          <Link
            to="/"
            className="w-1/2 rounded-xl bg-violet-600 text-xs font-bold text-white py-3.5 hover:bg-violet-550 shadow flex items-center justify-center gap-1.5"
          >
            Return Home
            <Home className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col gap-10">
      <div className="border-b border-slate-200/10 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-display text-slate-900 dark:text-white mb-1">
          Secure Checkout
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Provide details to compile order shipping and complete payment</p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Columns: Forms */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Shipping Details */}
          <div className="rounded-2xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/30 p-6 backdrop-blur-md flex flex-col gap-4 shadow">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display flex items-center gap-2 border-b border-slate-200/10 pb-3">
              <Truck className="h-4.5 w-4.5 text-violet-500" />
              Shipping Information
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Street Address</label>
              <input
                type="text"
                required
                placeholder="123 Nexus Boulevard"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white/50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">City</label>
                <input
                  type="text"
                  required
                  placeholder="San Francisco"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white/50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Postal Code</label>
                <input
                  type="text"
                  required
                  placeholder="94103"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white/50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Country</label>
                <input
                  type="text"
                  required
                  placeholder="United States"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white/50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="rounded-2xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/30 p-6 backdrop-blur-md flex flex-col gap-4 shadow">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display flex items-center gap-2 border-b border-slate-200/10 pb-3">
              <CreditCard className="h-4.5 w-4.5 text-violet-500" />
              Payment Information (Sandbox Mode)
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Name On Card</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white/50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Card Number</label>
              <input
                type="text"
                required
                maxLength={19}
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white/50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expiry Date</label>
                <input
                  type="text"
                  required
                  placeholder="MM/YY"
                  maxLength={5}
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white/50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CVC / CVV</label>
                <input
                  type="password"
                  required
                  placeholder="•••"
                  maxLength={3}
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white/50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Summary Panel */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200/10 bg-white/30 dark:bg-slate-900/30 p-6 backdrop-blur-md flex flex-col gap-5 shadow">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display border-b border-slate-200/10 pb-3">
              Review Selection
            </h3>

            {/* List items summaries */}
            <div className="flex flex-col gap-3.5 max-h-48 overflow-y-auto no-scrollbar border-b border-slate-200/10 pb-3">
              {cartItems.map((item) => {
                const activePrice = item.product.discountPrice && item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
                return (
                  <div key={item.product._id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                        <img src={item.product.image} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 font-display line-clamp-1">{item.product.name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 shrink-0 font-mono">₹{Math.round(activePrice * item.quantity * 100) / 100}</span>
                  </div>
                );
              })}
            </div>

            {/* Calculations summaries */}
            <div className="flex flex-col gap-2 text-xs border-b border-slate-200/10 pb-3">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discountPercentage > 0 && (
                <div className="flex justify-between text-emerald-500 font-semibold">
                  <span>Promo ({coupon})</span>
                  <span>-₹{Math.round((subtotal * discountPercentage) / 100 * 100) / 100}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Estimated Tax</span>
                <span>₹{tax}</span>
              </div>
            </div>

            <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white font-display">
              <span>Total Price</span>
              <span>₹{total}</span>
            </div>

            <button
              type="submit"
              disabled={processing || cartItems.length === 0}
              className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5"
            >
              {processing ? 'Processing Transaction...' : 'Pay and Place Order'}
              <ShieldCheck className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
