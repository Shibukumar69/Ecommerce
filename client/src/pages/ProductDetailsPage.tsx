import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, ShieldCheck, HelpCircle, Send, Check } from 'lucide-react';
import api from '../services/api';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';
import ProductCard from '../components/ProductCard';
import { DetailsSkeleton } from '../components/SkeletonLoader';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { userInfo } = useAuth();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  // API State
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery State
  const [selectedImg, setSelectedImg] = useState('');
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', transform: 'scale(1)', transformOrigin: 'center' });

  // Reviews Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Cart Qty State
  const [quantity, setQuantity] = useState(1);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
      setRecommendations(data.recommendations || []);
      setSelectedImg(data.product.image);

      // Fetch reviews
      const revRes = await api.get(`/reviews/product/${id}`);
      setReviews(revRes.data);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const handleZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      transform: 'scale(1.8)',
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleZoomLeave = () => {
    setZoomStyle({
      display: 'none',
      transform: 'scale(1)',
      transformOrigin: 'center',
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`Added ${quantity} of "${product.name}" to cart`);
  };

  const handleWishlist = async () => {
    if (!product) return;
    if (!userInfo) {
      toast.error('Please log in to save products to wishlist');
      return;
    }
    const isAdded = await toggleWishlist(product._id);
    if (isAdded) {
      toast.success('Saved to wishlist');
    } else {
      toast.info('Removed from wishlist');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !reviewComment) return;
    setSubmittingReview(true);
    try {
      await api.post('/reviews', {
        rating: reviewRating,
        comment: reviewComment,
        productId: id,
      });
      toast.success('Review submitted successfully!');
      setReviewComment('');
      // Refetch details
      fetchProductDetails();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 w-full">
        <DetailsSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center w-full">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Product Not Found</h2>
        <Link to="/products" className="text-sm text-violet-500 hover:underline">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product._id);
  const imagesList = [product.image, ...(product.images || [])].filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col gap-16">
      {/* Product Details Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left Column: Image Gallery with Zoom */}
        <div className="flex flex-col gap-4">
          <div
            className="relative aspect-square rounded-2xl overflow-hidden bg-white/40 dark:bg-slate-900/40 border border-slate-200/10 cursor-zoom-in"
            onMouseMove={handleZoomMove}
            onMouseLeave={handleZoomLeave}
          >
            <img
              src={selectedImg}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform duration-200"
              style={zoomStyle.display === 'block' ? { transform: zoomStyle.transform, transformOrigin: zoomStyle.transformOrigin } : {}}
            />
          </div>

          {/* Thumbnails Row */}
          {imagesList.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(img)}
                  className={`aspect-square rounded-xl overflow-hidden border bg-white/20 dark:bg-slate-900/20 backdrop-blur ${
                    selectedImg === img ? 'border-violet-500 shadow' : 'border-slate-200/10 hover:border-slate-400/40'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details Info */}
        <div className="flex flex-col gap-6 py-2">
          {/* Category */}
          <span className="text-[11px] font-bold text-violet-500 tracking-widest uppercase">
            {product.category?.name}
          </span>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-display leading-tight">
            {product.name}
          </h1>

          {/* Ratings display */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-400">
              <Star className="h-4.5 w-4.5 fill-current" />
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {product.ratings || '5.0'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({reviews.length} customer reviews)
            </span>
          </div>

          {/* Prices */}
          <div className="flex items-baseline gap-3 border-b border-slate-200/10 pb-4">
            {product.discountPrice && product.discountPrice > 0 ? (
              <>
                <span className="text-3xl font-black text-slate-900 dark:text-white font-display">
                  ₹{product.discountPrice}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400 line-through">
                  ₹{product.price}
                </span>
              </>
            ) : (
              <span className="text-3xl font-black text-slate-900 dark:text-white font-display">
                ₹{product.price}
              </span>
            )}
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {product.description}
          </p>

          {/* Specs List */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="rounded-2xl border border-slate-200/10 bg-slate-500/5 p-4 flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Specifications</span>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-slate-700/10 pb-1.5">
                    <span className="text-slate-500 dark:text-slate-400 font-medium capitalize">{k}</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stock Availability */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Status:</span>
            {product.stock > 0 ? (
              <span className="font-bold text-emerald-500 flex items-center gap-1">
                <Check className="h-4 w-4" /> In Stock ({product.stock} items left)
              </span>
            ) : (
              <span className="font-bold text-rose-500">Out of Stock</span>
            )}
          </div>

          {/* Action Bar (Qty, Add to Cart, Wishlist) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            {product.stock > 0 && (
              <div className="flex items-center border border-slate-300 dark:border-slate-800 rounded-xl bg-white/40 dark:bg-slate-900/40 p-1 w-full sm:w-auto">
                <button
                  onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                  className="px-3.5 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-100 font-bold text-sm"
                >
                  -
                </button>
                <span className="px-4 py-1 text-sm font-bold text-slate-800 dark:text-slate-200 w-10 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(q + 1, product.stock))}
                  className="px-3.5 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-100 font-bold text-sm"
                >
                  +
                </button>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full sm:grow rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-500 dark:text-slate-400 disabled:cursor-not-allowed text-white py-3.5 text-sm font-bold shadow-md shadow-violet-600/10 hover:shadow-violet-600/35 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              Add to Cart
            </button>

            <button
              onClick={handleWishlist}
              className={`w-full sm:w-auto p-3.5 rounded-xl border backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 ${
                isSaved
                  ? 'bg-rose-500 border-rose-400 text-white shadow-md'
                  : 'bg-white/40 dark:bg-slate-900/40 border-slate-200/20 text-slate-700 dark:text-slate-300 hover:text-rose-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
              <span className="sm:hidden text-sm font-bold">Wishlist</span>
            </button>
          </div>

          {/* Secure details */}
          <div className="flex items-center gap-6 border-t border-slate-200/10 pt-4 text-[10px] text-slate-500 dark:text-slate-400 mt-2">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Authentic product guarantee</span>
            <span className="flex items-center gap-1.5"><HelpCircle className="h-4 w-4 text-violet-500" /> 24/7 client center assistance</span>
          </div>
        </div>
      </section>

      {/* AI Product Recommendations Section */}
      {recommendations.length > 0 && (
        <section className="border-t border-slate-200/10 pt-12">
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display mb-1">
              AI Recommendations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Matching products suggested by our content-matching engine</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((rec) => (
              <ProductCard key={rec._id} product={rec} />
            ))}
          </div>
        </section>
      )}

      {/* Reviews Tab and Review Submission */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-slate-200/10 pt-12">
        {/* Left Column: Customer Review lists */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display mb-1">
              Customer Reviews
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Read what others say about this item</p>
          </div>

          {reviews.length === 0 ? (
            <div className="py-12 text-center rounded-2xl border border-slate-200/10 bg-slate-500/5">
              <p className="text-xs text-slate-500 dark:text-slate-400">No reviews yet for this product. Be the first to leave one!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="rounded-2xl border border-slate-200/10 bg-white/20 dark:bg-slate-900/30 p-5 backdrop-blur-md flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white font-display">{rev.name}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          className={`h-3 w-3 ${starIdx < rev.rating ? 'fill-current' : 'opacity-20'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Submit Review Form */}
        <div className="flex flex-col gap-4 sticky top-24">
          <div className="rounded-2xl border border-slate-200/10 bg-white/30 dark:bg-slate-900/30 p-6 backdrop-blur-md">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display mb-4">
              Write a Review
            </h3>

            {userInfo ? (
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                {/* Rating Selector */}
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-2">Rating</span>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setReviewRating(i + 1)}
                        className={`text-amber-400 p-1 hover:scale-110 transition-transform`}
                      >
                        <Star className={`h-6 w-6 ${i < reviewRating ? 'fill-current' : 'opacity-20'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Text */}
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-2">Comment</span>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share your thoughts about this product..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full rounded-xl bg-white/50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 text-xs p-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Please log in to leave reviews.</p>
                <Link
                  to="/login"
                  className="inline-block px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsPage;
