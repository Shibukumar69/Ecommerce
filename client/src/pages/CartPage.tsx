import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Ticket, ArrowLeft, Star, Heart, ShieldCheck, Truck, BadgeCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from '../components/Toast';

const CartPage: React.FC = () => {
  const {
    cartItems,
    removeFromCart,
    updateCartQuantity,
    subtotal,
    shipping,
    tax,
    total,
    coupon,
    discountPercentage,
    applyCoupon,
    toggleWishlist,
    isInWishlist,
  } = useCart();

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    if (!couponCode.trim()) {
      setCouponError('Please enter a promo code first.');
      return;
    }

    const success = applyCoupon(couponCode);
    if (success) {
      setCouponSuccess(`Coupon "${couponCode.toUpperCase()}" applied successfully!`);
      toast.success(`Coupon "${couponCode.toUpperCase()}" applied successfully!`);
    } else {
      setCouponError('Invalid coupon. Try NEXUS20 or SAVE10.');
      toast.error('Invalid coupon code. Try NEXUS20 or SAVE10.');
    }
    setCouponCode('');
  };

  const handleCheckoutRedirect = () => {
    if (cartItems.length === 0) return;
    navigate('/checkout');
  };

  const handleWishlistToggle = async (productId: string, name: string) => {
    const isAdded = await toggleWishlist(productId);
    if (isAdded) {
      toast.success(`Moved "${name}" to wishlist`);
    } else {
      toast.info(`Removed "${name}" from wishlist`);
    }
  };

  // Calculate delivery estimate date (2 days from now)
  const getDeliveryEstimate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  // Free shipping parameters
  const freeShippingThreshold = 5000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] dark:from-slate-950 dark:to-slate-900 transition-colors duration-300 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 pt-28 w-full flex flex-col gap-10">
        
        {/* Header Block */}
        <div className="border-b border-slate-200/20 pb-6 flex flex-col gap-1">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
            Shopping Cart
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Review your selected items before compiling checkout
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="mx-auto max-w-xl py-16 text-center flex flex-col items-center gap-6 rounded-[18px] bg-white/70 dark:bg-slate-900/40 border border-slate-200/10 backdrop-blur p-8 shadow-lg animate-fade-in w-full">
            <div className="h-24 w-24 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500 mb-2 animate-bounce">
              <ShoppingBag className="h-12 w-12" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-display text-slate-900 dark:text-white">Your Cart is Empty</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Before you can check out, you must add some products to your shopping cart.
            </p>
            <Link
              to="/products"
              className="rounded-xl bg-violet-600 hover:bg-violet-550 px-8 py-4 text-sm font-bold text-white shadow-lg hover:shadow-violet-650/30 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Return to Catalog
            </Link>
          </div>
        ) : (
          /* Cart Listing Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column: Product Cards */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {cartItems.map((item) => {
                const activePrice = item.product.discountPrice && item.product.discountPrice > 0 
                  ? item.product.discountPrice 
                  : item.product.price;
                const hasDiscount = item.product.discountPrice && item.product.discountPrice > 0;
                const itemTotal = Math.round(activePrice * item.quantity * 100) / 100;
                const isSaved = isInWishlist(item.product._id);
                const rating = item.product.ratings || 5;

                return (
                  <div
                    key={item.product._id}
                    className="rounded-[18px] border border-slate-200/20 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 md:p-6 backdrop-blur-md flex flex-col md:flex-row items-center gap-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in relative group"
                  >
                    {/* Free shipping banner if total qualifies */}
                    {isFreeShipping && (
                      <span className="absolute top-3 left-3 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-emerald-500/20 shadow-sm z-10">
                        Free Shipping
                      </span>
                    )}

                    {/* Stock Alert Badge */}
                    <span className={`absolute top-3 right-3 text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border shadow-sm z-10 ${
                      item.product.stock <= 5 
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400 animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200/10 text-slate-500 dark:text-slate-400'
                    }`}>
                      {item.product.stock <= 5 ? `Only ${item.product.stock} Left` : 'In Stock'}
                    </span>

                    {/* Product Image */}
                    <div className="h-32 w-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/10 shadow-inner self-center md:self-start mt-2">
                      <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>

                    {/* Details Column */}
                    <div className="grow text-center md:text-left flex flex-col gap-1 w-full">
                      <span className="text-xs font-bold text-[#2563EB] dark:text-blue-400 uppercase tracking-widest">
                        {item.product.category?.name || 'Catalog'}
                      </span>
                      
                      <Link 
                        to={`/products/${item.product._id}`} 
                        className="text-xl font-bold text-[#111827] dark:text-white hover:text-violet-500 font-display transition-colors line-clamp-2 leading-snug"
                      >
                        {item.product.name}
                      </Link>
                      
                      <p className="text-sm text-[#4B5563] dark:text-slate-300 line-clamp-2 mt-1 pr-4">
                        {item.product.description}
                      </p>

                      {/* Ratings stars display */}
                      <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < Math.floor(rating) 
                                ? 'text-amber-400 fill-current' 
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">
                          {rating.toFixed(1)}
                        </span>
                      </div>

                      {/* Pricing and Qty edit row */}
                      <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-3">
                        <div className="flex items-baseline">
                          <span className="text-[22px] font-bold text-[#16A34A] dark:text-green-400 font-mono">
                            ₹{activePrice}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-slate-400 line-through ml-2 font-mono">
                              ₹{item.product.price}
                            </span>
                          )}
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center border border-slate-300 dark:border-slate-800 rounded-full p-0.5 bg-slate-50 dark:bg-slate-950 shrink-0 shadow-inner">
                          <button
                            onClick={() => updateCartQuantity(item.product._id, item.quantity - 1)}
                            className="h-8 w-8 rounded-full text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 font-extrabold text-base flex items-center justify-center transition-colors"
                          >
                            -
                          </button>
                          <span className="px-3 text-sm font-bold text-[#111827] dark:text-white w-8 text-center font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product._id, item.quantity + 1)}
                            className="h-8 w-8 rounded-full text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 font-extrabold text-base flex items-center justify-center transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Estimated Delivery Indicator */}
                      <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        <Truck className="h-4 w-4 text-violet-500" />
                        <span>Delivery by <strong className="text-slate-700 dark:text-slate-300">{getDeliveryEstimate()}</strong></span>
                      </div>
                    </div>

                    {/* Right column pricing and action buttons */}
                    <div className="flex flex-col items-center md:items-end justify-between self-stretch md:self-auto gap-4 shrink-0">
                      
                      {/* Total price for the item */}
                      <div className="text-[26px] font-black text-[#DC2626] dark:text-red-400 font-mono tracking-tight">
                        ₹{itemTotal}
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto">
                        
                        {/* Wishlist Button */}
                        <button
                          onClick={() => handleWishlistToggle(item.product._id, item.product.name)}
                          className={`p-2.5 rounded-xl border transition-all duration-300 ${
                            isSaved 
                              ? 'bg-rose-500 border-rose-400 text-white shadow-sm'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500'
                          }`}
                          title={isSaved ? "Saved to Wishlist" : "Move to Wishlist"}
                        >
                          <Heart className={`h-4.5 w-4.5 ${isSaved ? 'fill-current' : ''}`} />
                        </button>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-450 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1.5"
                          title="Remove Item"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <Link to="/products" className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 hover:underline font-bold self-start mt-3">
                <ArrowLeft className="h-4.5 w-4.5" /> Continue Shopping
              </Link>
            </div>

            {/* Right Column: Checkout Summary Card */}
            <div className="flex flex-col gap-6 sticky top-28">
              
              {/* Summary Card */}
              <div className="rounded-[18px] border border-slate-200/20 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-6 backdrop-blur-md flex flex-col gap-5 shadow-lg relative">
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display border-b border-slate-200/10 pb-4">
                  Order Summary
                </h3>

                {/* Free Shipping Progress Indicator */}
                <div className="flex flex-col gap-1.5 border-b border-slate-200/10 pb-4">
                  <div className="flex justify-between text-xs font-semibold">
                    {isFreeShipping ? (
                      <span className="text-emerald-600 dark:text-emerald-450 flex items-center gap-1">
                        <BadgeCheck className="h-4 w-4" /> Free Shipping unlocked!
                      </span>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400">
                        Add <strong className="text-violet-500 font-mono">₹{(freeShippingThreshold - subtotal).toFixed(2)}</strong> more for Free Shipping
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFreeShipping ? 'bg-emerald-500' : 'bg-violet-500'
                      }`}
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </div>

                {/* Calculations rows */}
                <div className="flex flex-col gap-3.5 text-sm">
                  <div className="flex justify-between text-slate-800 dark:text-slate-300">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{subtotal}</span>
                  </div>

                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-450 font-bold">
                      <span>Discount ({coupon})</span>
                      <span>-₹{Math.round((subtotal * discountPercentage) / 100 * 100) / 100} ({discountPercentage}%)</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-800 dark:text-slate-300">
                    <span>Shipping</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-800 dark:text-slate-300 border-b border-slate-200/10 pb-4">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{tax}</span>
                  </div>

                  <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white font-display">
                    <span>Total Amount</span>
                    <span className="text-violet-650 dark:text-violet-400 font-mono text-xl">₹{total}</span>
                  </div>
                </div>

                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2 mt-2">
                  <div className="relative grow">
                    <Ticket className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-500 dark:text-slate-400" />
                    <input
                      type="text"
                      placeholder="Promo Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 rounded-xl text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 uppercase focus:outline-none focus:border-violet-500 shadow-inner"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow hover:shadow-md"
                  >
                    Apply
                  </button>
                </form>

                {/* Inline Error/Success Messages */}
                {couponError && (
                  <p className="text-xs font-bold text-white bg-rose-600 border border-rose-500/20 rounded-xl p-3 shadow-md animate-pulse">
                    {couponError}
                  </p>
                )}
                {couponSuccess && (
                  <p className="text-xs font-bold text-white bg-emerald-600 border border-emerald-500/20 rounded-xl p-3 shadow-md">
                    {couponSuccess}
                  </p>
                )}

                {/* Main checkout trigger */}
                <button
                  onClick={handleCheckoutRedirect}
                  className="w-full py-4 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-550/45 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-1.5 mt-2"
                >
                  Checkout
                  <ArrowRight className="h-4.5 w-4.5" />
                </button>

                {/* Trust and Payment Badges */}
                <div className="flex flex-col gap-2 border-t border-slate-200/10 pt-4 mt-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span>Secure SSL payments guaranteed.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4.5 w-4.5 text-violet-500 shrink-0" />
                    <span>Easy 30-day return policy.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
