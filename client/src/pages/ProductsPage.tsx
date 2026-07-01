import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Grid, List, SlidersHorizontal, RefreshCw, X, Star } from 'lucide-react';
import api from '../services/api';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/SkeletonLoader';
import VoiceSearch from '../components/VoiceSearch';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // API State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter States (synchronized from URL params if available)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(searchParams.get('rating') || '');

  // UI States
  const [isListView, setIsListView] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get<Category[]>('/categories');
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when queries or page updates
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {
          page: page.toString(),
          limit: '9',
          sort: sortOption,
        };

        if (searchQuery) params.keyword = searchQuery;
        if (selectedCategory) params.category = selectedCategory;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (minRating) params.rating = minRating;

        const { data } = await api.get('/products', { params });
        setProducts(data.products);
        setPages(data.pages);
        setTotalProducts(data.count);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, searchQuery, selectedCategory, sortOption, minPrice, maxPrice, minRating]);

  // Synchronize URL parameters
  const updateURLParams = () => {
    const params: Record<string, string> = {};
    if (searchQuery) params.keyword = searchQuery;
    if (selectedCategory) params.category = selectedCategory;
    if (sortOption) params.sort = sortOption;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (minRating) params.rating = minRating;
    
    setSearchParams(params);
    setPage(1); // Reset page on filter apply
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateURLParams();
  };

  const handleVoiceTranscript = (text: string) => {
    setSearchQuery(text);
    // Automatically trigger search
    const params = new URLSearchParams(searchParams);
    params.set('keyword', text);
    setSearchParams(params);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortOption('newest');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Top Search Bar & Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/40 dark:bg-slate-900/40 border border-slate-200/10 rounded-3xl p-6 backdrop-blur-md">
        <div className="w-full md:w-auto">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight font-display text-slate-900 dark:text-white mb-1">
            Shop Catalog
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Showing {totalProducts} premium products</p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:max-w-md">
          <div className="relative grow">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by name, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-white/60 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-500"
            />
          </div>
          <VoiceSearch onTranscript={handleVoiceTranscript} />
          <button
            type="submit"
            className="px-5 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold shadow hover:shadow-lg transition-all duration-300"
          >
            Search
          </button>
        </form>
      </div>

      {/* Grid Content Layout */}
      <div className="flex gap-8 relative items-start">
        {/* Left Filters - Desktop */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-6 sticky top-24">
          <div className="rounded-2xl border border-slate-200/10 bg-white/30 dark:bg-slate-900/30 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-200/15 pb-4 mb-4">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-violet-500" />
                Filters
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-500 hover:underline flex items-center gap-1"
              >
                Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Categories</h3>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto no-scrollbar">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setPage(1);
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('category');
                    setSearchParams(newParams);
                  }}
                  className={`text-left text-sm py-1.5 px-2 rounded-lg transition-colors ${
                    !selectedCategory
                      ? 'bg-violet-500/10 text-violet-500 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-violet-400'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setPage(1);
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('category', cat.slug);
                      setSearchParams(newParams);
                    }}
                    className={`text-left text-sm py-1.5 px-2 rounded-lg transition-colors truncate ${
                      selectedCategory === cat.slug
                        ? 'bg-violet-500/10 text-violet-500 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-violet-400'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6 border-t border-slate-200/15 pt-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Price Range (₹)</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white/50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 focus:outline-none text-slate-800 dark:text-slate-200"
                />
                <span className="text-slate-500 dark:text-slate-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white/50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 focus:outline-none text-slate-800 dark:text-slate-200"
                />
              </div>
              <button
                onClick={updateURLParams}
                className="mt-3 w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all"
              >
                Apply Price
              </button>
            </div>

            {/* Rating Filter */}
            <div className="border-t border-slate-200/15 pt-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Rating</h3>
              <div className="flex flex-col gap-1.5">
                {[4, 3, 2].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => {
                      setMinRating(stars.toString());
                      setPage(1);
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('rating', stars.toString());
                      setSearchParams(newParams);
                    }}
                    className={`flex items-center gap-1.5 text-xs py-1.5 px-2 rounded-lg transition-colors ${
                      minRating === stars.toString()
                        ? 'bg-violet-500/10 text-violet-500 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-violet-400'
                    }`}
                  >
                    <div className="flex items-center text-amber-400">
                      <Star className="h-3 w-3 fill-current" />
                    </div>
                    <span>{stars}+ Stars</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Product Grid */}
        <section className="grow w-full flex flex-col gap-6">
          {/* Grid Controls (Sorting & Layout Switcher) */}
          <div className="flex items-center justify-between bg-white/20 dark:bg-slate-900/20 border border-slate-200/10 rounded-2xl p-4 backdrop-blur-md">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700/30 text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              <SlidersHorizontal className="h-4 w-4 text-violet-500" />
              Filter By
            </button>

            <div className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => setIsListView(false)}
                className={`p-2 rounded-lg transition-colors ${!isListView ? 'bg-violet-600 text-white' : 'text-slate-400 hover:bg-slate-800/10'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsListView(true)}
                className={`p-2 rounded-lg transition-colors ${isListView ? 'bg-violet-600 text-white' : 'text-slate-400 hover:bg-slate-800/10'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setPage(1);
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('sort', e.target.value);
                  setSearchParams(newParams);
                }}
                className="bg-white/40 dark:bg-slate-950/40 border border-slate-200/15 rounded-xl text-xs px-3 py-1.5 focus:outline-none focus:border-violet-500 text-slate-700 dark:text-slate-200"
              >
                <option value="newest">Newest</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Catalog items */}
          {loading ? (
            <div className={`grid gap-6 ${isListView ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
              <ProductSkeleton count={9} />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 rounded-3xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/40 backdrop-blur-md">
              <RefreshCw className="h-10 w-10 text-violet-500/30 animate-spin mx-auto mb-4" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-200 font-display mb-1">No products matches</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Try refining your searches, tags or price bounds</p>
              <button
                onClick={handleResetFilters}
                className="rounded-xl bg-violet-600 px-5 py-2 text-xs font-bold text-white shadow"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${isListView ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
              {products.map((product) => (
                <div key={product._id} className={isListView ? 'flex flex-col sm:flex-row gap-6 bg-white/30 dark:bg-slate-900/30 border border-slate-200/10 rounded-2xl p-4 backdrop-blur-md items-center' : ''}>
                  {isListView ? (
                    <>
                      <div className="h-36 w-36 overflow-hidden rounded-xl bg-slate-200 shrink-0">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="grow">
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1 block">{product.category?.name}</span>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-display mb-1">{product.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 max-w-xl">{product.description}</p>
                        <div className="flex items-center gap-1 text-amber-400 mb-2">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{product.ratings || '5.0'}</span>
                        </div>
                        <div className="text-sm font-bold text-violet-500 font-display">₹{product.price}</div>
                      </div>
                      <div className="shrink-0">
                        <ProductCard product={product} /> {/* Reusing visual card as detail */}
                      </div>
                    </>
                  ) : (
                    <ProductCard product={product} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-8">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3.5 py-2 rounded-xl border border-slate-700/30 text-xs font-semibold hover:bg-violet-500/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                Prev
              </button>
              {Array.from({ length: pages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx + 1)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    page === idx + 1
                      ? 'bg-violet-600 text-white shadow shadow-violet-600/20'
                      : 'border border-slate-700/30 text-slate-600 dark:text-slate-300 hover:bg-violet-500/10'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                disabled={page === pages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3.5 py-2 rounded-xl border border-slate-700/30 text-xs font-semibold hover:bg-violet-500/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-80 h-full bg-white dark:bg-slate-900 p-6 flex flex-col gap-6 animate-slide-in">
            <div className="flex items-center justify-between border-b border-slate-200/15 pb-4">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-display">Filters</span>
              <button onClick={() => setShowMobileFilters(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-800/10">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grow overflow-y-auto no-scrollbar flex flex-col gap-6">
              {/* Category */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setPage(1);
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('category');
                      setSearchParams(newParams);
                    }}
                    className={`text-xs py-1.5 px-3 rounded-full border border-slate-700/30 ${!selectedCategory ? 'bg-violet-600 text-white border-violet-500' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setPage(1);
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set('category', cat.slug);
                        setSearchParams(newParams);
                      }}
                      className={`text-xs py-1.5 px-3 rounded-full border border-slate-700/30 ${selectedCategory === cat.slug ? 'bg-violet-600 text-white border-violet-500' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Price Limits</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950/50 border border-slate-800 text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950/50 border border-slate-800 text-white"
                  />
                </div>
              </div>

              {/* Ratings */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Rating</h3>
                <div className="flex flex-col gap-1">
                  {[4, 3, 2].map((stars) => (
                    <button
                      key={stars}
                      onClick={() => {
                        setMinRating(stars.toString());
                        setPage(1);
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set('rating', stars.toString());
                        setSearchParams(newParams);
                      }}
                      className={`flex items-center gap-2 text-xs py-2 px-3 rounded-xl border border-slate-700/30 ${minRating === stars.toString() ? 'bg-violet-600 text-white' : 'text-slate-400'}`}
                    >
                      <Star className="h-3.5 w-3.5 fill-current text-amber-400" />
                      <span>{stars}+ Stars</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleResetFilters}
                className="w-1/2 py-3 border border-slate-700/30 text-xs font-bold rounded-xl text-rose-500"
              >
                Reset All
              </button>
              <button
                onClick={() => {
                  updateURLParams();
                  setShowMobileFilters(false);
                }}
                className="w-1/2 py-3 bg-violet-600 text-white text-xs font-bold rounded-xl"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
