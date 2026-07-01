import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Database, Layers, ShoppingCart, Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Product, Category, Order } from '../types';
import { toast } from '../components/Toast';

const DashboardAdmin: React.FC = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  // Tabs: 'analytics' | 'products' | 'categories' | 'orders'
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'categories' | 'orders'>('analytics');

  // API Data States
  const [analytics, setAnalytics] = useState<any>({ summary: {}, monthlySales: [], categorySales: [] });
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Loading States
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Modals / Form States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDiscount, setProdDiscount] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodTags, setProdTags] = useState('');
  const [prodSpecs, setProdSpecs] = useState('');

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('');

  // Fetch admin datasets
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch analytics
      const analRes = await api.get('/orders/analytics');
      setAnalytics(analRes.data);

      // Fetch products
      const prodRes = await api.get('/products?limit=100');
      setProducts(prodRes.data.products);

      // Fetch categories
      const catRes = await api.get('/categories');
      setCategories(catRes.data);

      // Fetch orders
      const orderRes = await api.get('/orders');
      setOrders(orderRes.data);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
      toast.error('Failed to retrieve catalog data. Check server console.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchAllData();
  }, [userInfo, navigate]);

  // Seeding mockup database
  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      // 1. Seed Categories
      const categoriesSeed = [
        { name: 'Smartphones', description: 'Next-gen mobile phones and cellular devices', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400' },
        { name: 'Laptops', description: 'Premium computers, ultrabooks, and workstations', image: 'https://images.unsplash.com/photo-1496181130204-7552cc15f0e1?auto=format&fit=crop&q=80&w=400' },
        { name: 'Audio Gear', description: 'Noise cancelling headphones, earbuds, speakers', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400' },
        { name: 'Accessories', description: 'Wireless charging hubs, adapters, and smart watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400' }
      ];

      const seededCats: any[] = [];
      for (const cat of categoriesSeed) {
        try {
          const { data } = await api.post('/categories', cat);
          seededCats.push(data);
        } catch (e) {
          // If already exists, fetch instead
        }
      }

      // Fetch categories list to get their IDs
      const { data: currentCats } = await api.get<Category[]>('/categories');
      const catsMap = currentCats.reduce((acc: any, c) => {
        acc[c.name] = c._id;
        return acc;
      }, {});

      // 2. Seed Products
      const productsSeed = [
        {
          name: 'Nexus Phone Pro Max',
          description: 'A revolutionary flagship smartphone featuring an edge-to-edge OLED display, AI triple camera array, and blazing-fast performance.',
          price: 999.99,
          discountPrice: 899.99,
          category: catsMap['Smartphones'] || currentCats[0]?._id,
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600',
          stock: 45,
          tags: 'phone, smartphone, mobile, flagship, apple, android',
          specs: 'screen:6.7 inch OLED, cpu:A16 Bionic, battery:4500mAh',
          isFeatured: true,
        },
        {
          name: 'UltraBook Air 14',
          description: 'Sleek, lightweight, and extremely powerful notebook built for developers and visual creators. Includes 16GB unified RAM and 512GB SSD.',
          price: 1299.99,
          category: catsMap['Laptops'] || currentCats[0]?._id,
          image: 'https://images.unsplash.com/photo-1496181130204-7552cc15f0e1?auto=format&fit=crop&q=80&w=600',
          stock: 20,
          tags: 'laptop, computer, notebook, ultrabook, coding',
          specs: 'screen:14 inch Retina, ram:16GB, storage:512GB SSD',
          isFeatured: true,
        },
        {
          name: 'Hologram Noise Cancelling Headset',
          description: 'Premium over-ear headphones with active hybrid noise cancellation, studio-quality acoustic transparency, and 40-hour wireless playtime.',
          price: 299.99,
          discountPrice: 249.99,
          category: catsMap['Audio Gear'] || currentCats[0]?._id,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
          stock: 120,
          tags: 'headphones, audio, wireless, noise-cancelling, music',
          specs: 'battery:40 Hours, connectivity:Bluetooth 5.3, weight:250g',
          isFeatured: true,
        },
        {
          name: 'Nexus Charging Pad Pro',
          description: 'Elegant glassmorphic 3-in-1 inductive fast charging base that powers your phone, smart watch, and noise-cancelling earbuds concurrently.',
          price: 89.99,
          category: catsMap['Accessories'] || currentCats[0]?._id,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
          stock: 60,
          tags: 'charger, power, accessories, apple, wireles-charging',
          specs: 'output:15W Fast Charge, input:USB-C, slots:3 items',
          isFeatured: false,
        }
      ];

      for (const prod of productsSeed) {
        if (!prod.category) continue;
        // Parse specs key-value string
        const specsMap: Record<string, string> = {};
        prod.specs.split(',').forEach((sp) => {
          const parts = sp.split(':');
          if (parts.length === 2) specsMap[parts[0].trim()] = parts[1].trim();
        });

        const tagsList = prod.tags.split(',').map((t) => t.trim());

        await api.post('/products', {
          ...prod,
          specs: specsMap,
          tags: tagsList,
        });
      }

      toast.success('Successfully seeded database with premium templates!');
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Seeding process encountered an issue');
    } finally {
      setSeeding(false);
    }
  };

  // Create or Update Product
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodCategory || !prodImage || !prodStock) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      // Parse specifications map
      const specsObj: Record<string, string> = {};
      if (prodSpecs) {
        prodSpecs.split(',').forEach((sp) => {
          const parts = sp.split(':');
          if (parts.length === 2) {
            specsObj[parts[0].trim()] = parts[1].trim();
          }
        });
      }

      // Parse tags array
      const tagsArr = prodTags ? prodTags.split(',').map((t) => t.trim()) : [];

      const payload = {
        name: prodName,
        description: prodDesc,
        price: Number(prodPrice),
        discountPrice: prodDiscount ? Number(prodDiscount) : 0,
        category: prodCategory,
        image: prodImage,
        stock: Number(prodStock),
        specs: specsObj,
        tags: tagsArr,
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        toast.success(`Successfully updated product: ${prodName}`);
      } else {
        await api.post('/products', payload);
        toast.success(`Successfully created product: ${prodName}`);
      }

      setShowProductModal(false);
      resetProductForm();
      fetchAllData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit product');
    }
  };

  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdDesc(product.description);
    setProdPrice(product.price.toString());
    setProdDiscount(product.discountPrice?.toString() || '');
    setProdCategory(product.category?._id || '');
    setProdStock(product.stock.toString());
    setProdImage(product.image);
    setProdTags(product.tags ? product.tags.join(', ') : '');
    
    // Map specifications to string
    const specsStr = product.specs
      ? Object.entries(product.specs)
          .map(([k, v]) => `${k}:${v}`)
          .join(', ')
      : '';
    setProdSpecs(specsStr);

    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.info('Product removed');
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove product');
    }
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProdName('');
    setProdDesc('');
    setProdPrice('');
    setProdDiscount('');
    setProdCategory('');
    setProdStock('');
    setProdImage('');
    setProdTags('');
    setProdSpecs('');
  };

  // Add Category
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;

    try {
      await api.post('/categories', {
        name: catName,
        description: catDesc,
        image: catImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300',
      });
      toast.success(`Category "${catName}" added!`);
      setShowCategoryModal(false);
      setCatName('');
      setCatDesc('');
      setCatImage('');
      fetchAllData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.info('Category deleted');
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete category');
    }
  };

  // Update Order Status
  const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to: ${newStatus}`);
      fetchAllData();
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  // Image Upload helper (base64 reader)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'product' | 'category') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (target === 'product') {
        setProdImage(base64String);
      } else {
        setCatImage(base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
          <span className="text-xs font-semibold">Compiling catalog dashboards...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col gap-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/10 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-display text-slate-900 dark:text-white mb-1">
            Admin Panel
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Configure products, categories, track invoices, and analyze sales metrics</p>
        </div>

        {/* Developer Seeding Actions */}
        <button
          onClick={handleSeedDatabase}
          disabled={seeding}
          className="rounded-xl border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-violet-500 text-xs font-bold py-2.5 px-4 disabled:opacity-40 transition-all flex items-center gap-1.5 self-start"
        >
          <Database className="h-4 w-4" />
          {seeding ? 'Seeding Catalog DB...' : 'Seed Sample Catalog'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="rounded-2xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/30 p-4 backdrop-blur-md flex flex-col gap-2 shadow">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'analytics' ? 'bg-violet-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-violet-500/10'
            }`}
          >
            <BarChart3 className="h-4.5 w-4.5" />
            Dashboard Analytics
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'products' ? 'bg-violet-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-violet-500/10'
            }`}
          >
            <Layers className="h-4.5 w-4.5" />
            Manage Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'categories' ? 'bg-violet-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-violet-500/10'
            }`}
          >
            <Database className="h-4.5 w-4.5" />
            Manage Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders' ? 'bg-violet-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-violet-500/10'
            }`}
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            Manage Orders ({orders.length})
          </button>
        </aside>

        {/* Tab content area */}
        <section className="lg:col-span-3">
          {/* TAB 1: Analytics widgets */}
          {activeTab === 'analytics' && (
            <div className="flex flex-col gap-8 animate-fade-in">
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">Business Metrics</h2>
              
              {/* Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/30 backdrop-blur-md shadow">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-1 uppercase">Total Sales</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white font-display">₹{analytics.summary?.totalRevenue || 0}</span>
                </div>
                <div className="p-5 rounded-2xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/30 backdrop-blur-md shadow">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-1 uppercase">Total Orders</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white font-display">{analytics.summary?.totalOrders || 0}</span>
                </div>
                <div className="p-5 rounded-2xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/30 backdrop-blur-md shadow">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-1 uppercase">Store Products</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white font-display">{analytics.summary?.totalProducts || 0}</span>
                </div>
                <div className="p-5 rounded-2xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/30 backdrop-blur-md shadow">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-1 uppercase">Store Users</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white font-display">{analytics.summary?.totalUsers || 0}</span>
                </div>
              </div>

              {/* Chart statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sales Trend */}
                <div className="p-6 rounded-3xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/30 backdrop-blur-md shadow">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Sales Trend (Last 6 Months)</h3>
                  {analytics.monthlySales?.length > 0 ? (
                    <div className="flex items-end justify-between gap-3 h-40 pt-4">
                      {analytics.monthlySales.map((item: any, i: number) => (
                        <div key={i} className="flex flex-col items-center gap-1.5 grow max-w-[40px]">
                          <div className="relative w-full rounded-t-lg bg-violet-500/80 hover:bg-violet-500 transition-colors" style={{ height: `${Math.min(100, Math.max(10, (item.sales / 5000) * 100))}px` }}>
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold font-mono text-slate-200">₹{item.sales}</span>
                          </div>
                          <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold text-center truncate w-full">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400 py-10 text-center">No sales trends recorded yet.</p>
                  )}
                </div>

                {/* Sales by Category */}
                <div className="p-6 rounded-3xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/30 backdrop-blur-md shadow">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Sales By Category</h3>
                  {analytics.categorySales?.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {analytics.categorySales.map((item: any, i: number) => (
                        <div key={i} className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-800 dark:text-slate-200">{item.name}</span>
                            <span className="text-violet-500">₹{item.value}</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: `${Math.min(100, (item.value / (analytics.summary.totalRevenue || 1)) * 100)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400 py-10 text-center">No category sales summaries available.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Manage Products CRUD */}
          {activeTab === 'products' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">Store Products</h2>
                <button
                  onClick={() => {
                    resetProductForm();
                    setShowProductModal(true);
                  }}
                  className="rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold py-2 px-4 flex items-center gap-1 shadow transition-all"
                >
                  <Plus className="h-4 w-4" /> Add Product
                </button>
              </div>

              {/* Table list */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/30 backdrop-blur-md shadow">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/10 bg-slate-800/10 text-slate-500 dark:text-slate-400 font-bold">
                      <th className="p-4">Item</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id} className="border-b border-slate-200/10 hover:bg-slate-700/5">
                        <td className="p-4 flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                            <img src={p.image} alt="" className="h-full w-full object-cover" />
                          </div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-[120px]">{p.name}</span>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">{p.category?.name || 'Unassigned'}</td>
                        <td className="p-4 font-mono font-bold">₹{p.price}</td>
                        <td className="p-4 font-semibold">{p.stock}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditProductClick(p)}
                              className="p-1.5 text-violet-500 hover:bg-violet-500/10 rounded-lg"
                              title="Edit"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p._id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Manage Categories CRUD */}
          {activeTab === 'categories' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">Product Collections</h2>
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold py-2 px-4 flex items-center gap-1 shadow"
                >
                  <Plus className="h-4 w-4" /> Add Category
                </button>
              </div>

              {/* Table List */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/30 backdrop-blur-md shadow">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/10 bg-slate-800/10 text-slate-500 dark:text-slate-400 font-bold">
                      <th className="p-4">Name</th>
                      <th className="p-4">Slug</th>
                      <th className="p-4">Description</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c._id} className="border-b border-slate-200/10 hover:bg-slate-700/5">
                        <td className="p-4 flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                            {c.image ? <img src={c.image} alt="" className="h-full w-full object-cover" /> : <Layers className="h-4 w-4 text-violet-500" />}
                          </div>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{c.name}</span>
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-400">{c.slug}</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400 line-clamp-1 max-w-[200px] mt-2">{c.description || 'No description'}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteCategory(c._id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Manage Orders status */}
          {activeTab === 'orders' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">Store Order Logs</h2>

              <div className="overflow-x-auto rounded-2xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/30 backdrop-blur-md shadow">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/10 bg-slate-800/10 text-slate-500 dark:text-slate-400 font-bold">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">State</th>
                      <th className="p-4 text-center">Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id} className="border-b border-slate-200/10 hover:bg-slate-700/5">
                        <td className="p-4 font-mono font-bold">{o._id}</td>
                        <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{o.user?.name || 'Deleted Account'}</td>
                        <td className="p-4 font-mono font-bold text-violet-500">₹{o.totalPrice}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                            o.status === 'Delivered'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : o.status === 'Cancelled'
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <select
                            value={o.status}
                            onChange={(e) => handleOrderStatusUpdate(o._id, e.target.value)}
                            className="bg-slate-950/40 border border-slate-800 rounded-lg p-1 text-[10px]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* MODAL: Product CRUD Builder */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200/10 bg-white dark:bg-slate-900 p-6 flex flex-col gap-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200/10 pb-3">
              <span className="text-base font-bold text-slate-900 dark:text-white font-display">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Product'}
              </span>
              <button
                onClick={() => {
                  setShowProductModal(false);
                  resetProductForm();
                }}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-800/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="Nexus Soundbar XL"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950/20 border border-slate-800 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="199.99"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950/20 border border-slate-800 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Discount Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={prodDiscount}
                    onChange={(e) => setProdDiscount(e.target.value)}
                    placeholder="159.99"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950/20 border border-slate-800 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category Collection *</label>
                  <select
                    required
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-950/20 border border-slate-800 focus:outline-none"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock Availability *</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    placeholder="50"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950/20 border border-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Describe the product details and key selling points..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950/20 border border-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Image URL (or upload base64 file) *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full grow px-3 py-2 rounded-xl text-xs bg-slate-950/20 border border-slate-800 focus:outline-none"
                  />
                  <label className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 flex items-center justify-center">
                    <Upload className="h-4 w-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'product')} />
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={prodTags}
                  onChange={(e) => setProdTags(e.target.value)}
                  placeholder="bluetooth, wireless, surround, speaker"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950/20 border border-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specs Map (Format: Key:Value, Key:Value)</label>
                <input
                  type="text"
                  value={prodSpecs}
                  onChange={(e) => setProdSpecs(e.target.value)}
                  placeholder="power:120W, channels:5.1, input:Optical/HDMI"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950/20 border border-slate-800 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow mt-2"
              >
                {editingProduct ? 'Save Product Changes' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Category Add Form */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200/10 bg-white dark:bg-slate-900 p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200/10 pb-3">
              <span className="text-base font-bold text-slate-900 dark:text-white font-display">Create Category Collection</span>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-800/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Smartwatches"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950/20 border border-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                <textarea
                  rows={3}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Describe the items in this collection..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950/20 border border-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={catImage}
                    onChange={(e) => setCatImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full grow px-3 py-2 rounded-xl text-xs bg-slate-950/20 border border-slate-800 focus:outline-none"
                  />
                  <label className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 flex items-center justify-center">
                    <Upload className="h-4 w-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'category')} />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow mt-2"
              >
                Create Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;
