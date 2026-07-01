import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Heart, ShoppingBag, Trash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { Order } from '../types';
import { toast } from '../components/Toast';

const DashboardUser: React.FC = () => {
  const { userInfo, updateProfile } = useAuth();
  const { wishlistItems, toggleWishlist, addToCart } = useCart();
  const navigate = useNavigate();

  // Navigation tab: 'profile' | 'orders' | 'wishlist'
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('orders');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Profile Form State
  const [name, setName] = useState(userInfo?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await api.get<Order[]>('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error('Error fetching user orders:', err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setUpdatingProfile(true);
    try {
      await updateProfile(name, password || undefined);
      toast.success('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      // Error handled by AuthContext
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleRemoveWishlist = async (productId: string) => {
    await toggleWishlist(productId);
    toast.info('Item removed from wishlist');
  };

  const handleAddToCart = (item: any) => {
    addToCart(item, 1);
    toast.success(`Added "${item.name}" to cart`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col gap-10">
      <div className="border-b border-slate-200/10 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-display text-slate-900 dark:text-white mb-1">
          User Dashboard
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage your profile, track shipments, and view favorited catalogs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Left Side: Sidebar Tabs */}
        <aside className="rounded-2xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/30 p-4 backdrop-blur-md flex flex-col gap-2 shadow">
          <div className="flex items-center gap-3 p-3 border-b border-slate-200/10 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-base shadow">
              {userInfo?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white font-display truncate max-w-[130px]">{userInfo?.name}</h4>
              <span className="text-[10px] text-slate-400 capitalize">{userInfo?.role} Account</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-violet-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:bg-violet-500/10'
            }`}
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            My Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'wishlist'
                ? 'bg-violet-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:bg-violet-500/10'
            }`}
          >
            <Heart className="h-4.5 w-4.5" />
            Wishlist ({wishlistItems.length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-violet-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:bg-violet-500/10'
            }`}
          >
            <Settings className="h-4.5 w-4.5" />
            Profile Settings
          </button>
        </aside>

        {/* Right Side: Tab Contents */}
        <section className="md:col-span-3">
          {/* 1. Orders Log Tab */}
          {activeTab === 'orders' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">Purchase History</h2>
              
              {ordersLoading ? (
                <div className="flex justify-center py-10">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-slate-200/10 bg-slate-500/5">
                  <p className="text-xs text-slate-500 dark:text-slate-400">You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {orders.map((ord) => (
                    <div
                      key={ord._id}
                      className="rounded-2xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/30 p-5 backdrop-blur-md flex flex-col gap-4 shadow"
                    >
                      <div className="flex flex-col sm:flex-row justify-between border-b border-slate-200/10 pb-3 gap-2">
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block font-mono">ID: {ord._id}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">Placed: {new Date(ord.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {ord.isPaid ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">Paid</span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400">Unpaid</span>
                          )}
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : ord.status === 'Cancelled'
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                      </div>

                      {/* Items mini list */}
                      <div className="flex flex-col gap-3">
                        {ord.orderItems.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                                <img src={item.image} alt="" className="h-full w-full object-cover" />
                              </div>
                              <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{item.name}</span>
                            </div>
                            <span className="text-slate-500 dark:text-slate-400 shrink-0">Qty {item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-200/10 pt-3 text-xs font-bold mt-1 text-slate-800 dark:text-slate-200">
                        <span>Total Price</span>
                        <span className="font-mono text-violet-500">₹{ord.totalPrice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">Saved Products</h2>

              {wishlistItems.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-slate-200/10 bg-slate-500/5">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Your wishlist is empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistItems.map((item) => (
                    <div
                      key={item._id}
                      className="rounded-2xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/30 p-4 backdrop-blur-md flex items-center gap-4 shadow"
                    >
                      <div className="h-16 w-16 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                        <img src={item.image} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="grow min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate font-display mb-0.5">{item.name}</h4>
                        <span className="text-[10px] text-violet-500 font-bold font-mono block mb-2">₹{item.price}</span>
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={item.stock === 0}
                          className="px-3 py-1 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-500 dark:text-slate-400 disabled:cursor-not-allowed text-[10px] font-bold text-white rounded-lg transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveWishlist(item._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 shrink-0 transition-colors"
                        title="Remove"
                      >
                        <Trash className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Profile Settings Tab */}
          {activeTab === 'profile' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">Profile Settings</h2>

              <form onSubmit={handleUpdateProfile} className="rounded-2xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/30 p-6 backdrop-blur-md flex flex-col gap-4 shadow">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address (Read Only)</label>
                  <input
                    type="email"
                    disabled
                    value={userInfo?.email}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950/20 border border-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white/50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <hr className="border-slate-200/10 my-2" />

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Password (Leave blank to keep current)</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white/50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white/50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="w-full sm:w-auto self-start px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow"
                >
                  {updatingProfile ? 'Saving updates...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardUser;
