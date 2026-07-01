import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { toast } from './Toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const discountPercent = product.discountPrice && product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isAdded = await toggleWishlist(product._id);
    if (isAdded) {
      toast.success(`Saved "${product.name}" to wishlist`);
    } else {
      toast.info(`Removed "${product.name}" from wishlist`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) {
      toast.error('This product is currently out of stock');
      return;
    }
    addToCart(product, 1);
    toast.success(`Added "${product.name}" to cart`);
  };

  const isSaved = isInWishlist(product._id);

  return (
    <Link
      to={`/products/${product._id}`}
      className="group relative flex flex-col rounded-2xl border border-slate-200/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md overflow-hidden transition-all-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-violet-500/5 duration-300"
    >
      {/* Badges and Wishlist Button */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {discountPercent > 0 && (
          <span className="rounded-lg bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
            {discountPercent}% OFF
          </span>
        )}
        {product.stock === 0 && (
          <span className="rounded-lg bg-slate-800 dark:bg-slate-950 px-2 py-0.5 text-[10px] font-bold text-slate-300 uppercase tracking-wider border border-slate-700/30">
            Out Of Stock
          </span>
        )}
        {product.isFeatured && (
          <span className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
            Popular
          </span>
        )}
      </div>

      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 z-10 p-2 rounded-xl border backdrop-blur-md transition-all-300 ${
          isSaved
            ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/20'
            : 'bg-white/40 dark:bg-slate-950/40 border-slate-200/20 text-slate-700 dark:text-slate-300 hover:text-rose-500'
        }`}
        title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart className={`h-4.5 w-4.5 ${isSaved ? 'fill-current' : ''}`} />
      </button>

      {/* Product Image Area */}
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col grow p-5">
        {/* Category Label */}
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
          {product.category?.name || 'Catalog'}
        </span>

        {/* Product Title */}
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-105 group-hover:text-violet-500 line-clamp-1 mb-2 font-display transition-colors">
          {product.name}
        </h3>

        {/* Ratings Review Display */}
        <div className="flex items-center gap-1.5 mb-3.5">
          <div className="flex items-center text-amber-400">
            <Star className="h-3.5 w-3.5 fill-current" />
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{product.ratings || '5.0'}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">({product.numReviews || 0})</span>
        </div>

        {/* Price and Cart Toggle Bar */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {discountPercent > 0 ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold text-slate-800 dark:text-slate-100 font-display">
                  ₹{product.discountPrice}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 line-through">
                  ₹{product.price}
                </span>
              </div>
            ) : (
              <span className="text-base font-bold text-slate-800 dark:text-slate-100 font-display">
                ₹{product.price}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              product.stock <= 0
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/10 hover:shadow-violet-500/30'
            }`}
            title="Add to Cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
