import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Sparkles, Star, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import api from '../services/api';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton, CategorySkeleton } from '../components/SkeletonLoader';

const testimonials = [
  {
    name: 'Sarah Connor',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    stars: 5,
    text: 'Nexus products are of absolute supreme quality. The glassmorphic design and the voice search on the website make browsing feel so futuristic!',
  },
  {
    name: 'David Lightman',
    role: 'Tech Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    stars: 5,
    text: 'Incredibly responsive interface. The checkout was lightning fast, and I used the NEXUS20 coupon for a cool 20% off. Will definitely shop here again!',
  },
  {
    name: 'Marcus Wright',
    role: 'Regular Customer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    stars: 5,
    text: 'The AI recommendations actually suggested exactly what I needed to match my setup. Outstanding shipping speeds as well.',
  },
];

const LandingPage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const catRes = await api.get<Category[]>('/categories');
        setCategories(catRes.data.slice(0, 6));
        setLoadingCategories(false);

        // Fetch products
        const prodRes = await api.get<{ products: Product[] }>('/products?limit=4');
        setFeaturedProducts(prodRes.data.products);
        setLoadingProducts(false);
      } catch (err) {
        console.error('Error fetching landing data:', err);
        setLoadingCategories(false);
        setLoadingProducts(false);
      }
    };
    fetchData();
  }, []);

  const nextTestimonial = () => {
    setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 left-1/10 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl animate-float" />
        <div className="absolute top-1/3 right-1/10 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 px-3.5 py-1 text-xs font-semibold text-violet-500 mb-6 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            Introducing the Next Generation Shopping Experience
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white font-display leading-[1.1] mb-6">
            Elevate Your Style.<br />
            Discover The{' '}
            <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              Nexus Catalog
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-slate-500 dark:text-slate-400 text-base sm:text-lg mb-8 leading-relaxed">
            Immerse yourself in a premium glassmorphic shopping portal featuring smart AI-guided recommendations, spoken voice searches, and ultra-fluid animations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/products"
              className="w-full sm:w-auto rounded-xl bg-violet-600 hover:bg-violet-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Shop Catalog
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#categories"
              className="w-full sm:w-auto rounded-xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/20 px-8 py-3.5 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Browse Categories
            </a>
          </div>
        </div>
      </section>

      {/* 2. Categories Grid */}
      <section id="categories" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display mb-2">
              Browse Categories
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Explore meticulously crafted items sorted by collection</p>
          </div>
        </div>

        {loadingCategories ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <CategorySkeleton count={6} />
          </div>
        ) : categories.length === 0 ? (
          // If category list is empty, show mockup placeholders
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {['Electronics', 'Fashion', 'Home Decor', 'Accessories'].map((cat, i) => (
              <Link
                key={i}
                to={`/products?category=${cat.toLowerCase()}`}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/40 hover:bg-violet-500/10 hover:border-violet-500/20 backdrop-blur-md transition-all-300 group"
              >
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white mb-3 shadow-md shadow-violet-500/10 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-display">{cat}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat.slug}`}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/40 hover:bg-violet-500/10 hover:border-violet-500/20 backdrop-blur-md transition-all-300 group"
              >
                <div className="h-14 w-14 rounded-2xl overflow-hidden bg-slate-200 mb-3 shadow-md group-hover:scale-110 transition-transform flex items-center justify-center text-violet-500">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                  ) : (
                    <ShoppingBag className="h-6 w-6" />
                  )}
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-display truncate max-w-full">{cat.name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 3. Promo Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-600 py-12 px-8 sm:px-12 md:py-16 md:px-16 shadow-xl shadow-violet-500/10">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-slate-100 to-transparent" />
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1 bg-white/10 text-white rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/20">
              Limited Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-display mb-4">
              Get 20% Discount On Your First Order
            </h2>
            <p className="text-violet-100 text-sm sm:text-base mb-6 leading-relaxed">
              Use code <span className="font-mono font-black text-white bg-black/20 rounded px-1.5 py-0.5">NEXUS20</span> at the cart page to redeem. Explore our catalog and unlock premium tech accessories instantly.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-violet-600 hover:bg-violet-50 px-6 py-3 text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display mb-2">
              Featured Products
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Pick from our best-sellers catalog</p>
          </div>
          <Link
            to="/products"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-violet-500 hover:text-violet-400 mt-2 md:mt-0 transition-colors"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductSkeleton count={4} />
          </div>
        ) : featuredProducts.length === 0 ? (
          // If no products, render mockup notice
          <div className="text-center py-12 rounded-3xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/40 backdrop-blur-md">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">No products available in the database yet.</p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-xs font-bold text-white shadow"
            >
              Create Mock Products in Admin
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Testimonial Slider */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display mb-2">
            What Our Customers Say
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Read honest reviews from tech enthusiasts worldwide</p>
        </div>

        <div className="mx-auto max-w-3xl relative">
          {/* Testimonial Panel */}
          <div className="rounded-3xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/40 backdrop-blur-md p-8 md:p-12 text-center flex flex-col items-center gap-6 shadow-md transition-all duration-500">
            <div className="relative">
              <img
                src={testimonials[testimonialIdx].avatar}
                alt={testimonials[testimonialIdx].name}
                className="h-16 w-16 rounded-full object-cover border-2 border-violet-500/30 shadow-md"
              />
              <span className="absolute bottom-0 right-0 p-1 bg-violet-500 rounded-full text-white">
                <Bookmark className="h-3 w-3 fill-current" />
              </span>
            </div>

            <div className="flex items-center text-amber-400">
              {Array.from({ length: testimonials[testimonialIdx].stars }).map((_, idx) => (
                <Star key={idx} className="h-4 w-4 fill-current" />
              ))}
            </div>

            <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg italic leading-relaxed">
              "{testimonials[testimonialIdx].text}"
            </p>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                {testimonials[testimonialIdx].name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{testimonials[testimonialIdx].role}</p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/20 text-slate-700 dark:text-slate-300 hover:bg-violet-500/15"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {testimonialIdx + 1} / {testimonials.length}
            </span>
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/20 text-slate-700 dark:text-slate-300 hover:bg-violet-500/15"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
