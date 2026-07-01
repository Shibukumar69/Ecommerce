import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// @desc    Get logged in user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      populate: { path: 'category', select: 'name slug' }
    });

    // If wishlist doesn't exist yet, create an empty one
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle item in wishlist
// @route   POST /api/wishlist/toggle
// @access  Private
export const toggleWishlistItem = async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const isAdded = wishlist.products.includes(productId);

    if (isAdded) {
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId.toString()
      );
    } else {
      wishlist.products.push(productId);
    }

    await wishlist.save();
    
    // Return the updated populated products list
    const populated = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      populate: { path: 'category', select: 'name' }
    });

    res.json({
      message: isAdded ? 'Removed from wishlist' : 'Added to wishlist',
      wishlist: populated,
      isAdded: !isAdded,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
