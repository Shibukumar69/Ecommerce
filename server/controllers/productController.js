import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { getRecommendations } from '../services/aiService.js';
import { uploadImage } from '../services/cloudinaryService.js';

// @desc    Get all products (with search, filter, sort, pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    // Search query
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
            { tags: { $in: [new RegExp(req.query.keyword, 'i')] } }
          ],
        }
      : {};

    // Category Filter
    let categoryQuery = {};
    if (req.query.category) {
      // Find category by slug or ID
      const category = await Category.findOne({
        $or: [{ slug: req.query.category }, { _id: req.query.category.match(/^[0-9a-fA-F]{24}$/) ? req.query.category : null }]
      });
      if (category) {
        categoryQuery = { category: category._id };
      } else {
        // If query is present but not found, force empty array
        return res.json({ products: [], page, pages: 0, count: 0 });
      }
    }

    // Price Filter
    let priceQuery = {};
    if (req.query.minPrice || req.query.maxPrice) {
      priceQuery.price = {};
      if (req.query.minPrice) priceQuery.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) priceQuery.price.$lte = Number(req.query.maxPrice);
    }

    // Rating Filter
    let ratingQuery = {};
    if (req.query.rating) {
      ratingQuery.ratings = { $gte: Number(req.query.rating) };
    }

    // Combine all filters
    const filter = { ...keyword, ...categoryQuery, ...priceQuery, ...ratingQuery };

    // Sorting options
    let sort = {};
    if (req.query.sort) {
      if (req.query.sort === 'priceAsc') sort = { price: 1 };
      else if (req.query.sort === 'priceDesc') sort = { price: -1 };
      else if (req.query.sort === 'rating') sort = { ratings: -1 };
      else if (req.query.sort === 'newest') sort = { createdAt: -1 };
    } else {
      sort = { createdAt: -1 }; // default sorting
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize || 1), count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');

    if (product) {
      // Get AI recommendations
      const recommendations = await getRecommendations(product._id);
      res.json({ product, recommendations });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, image, images, stock, specs, tags, isFeatured } = req.body;

    // Upload main image
    let uploadedImage = image;
    if (image.startsWith('data:image')) {
      uploadedImage = await uploadImage(image);
    }

    // Upload secondary images
    let uploadedImages = [];
    if (images && images.length > 0) {
      for (const img of images) {
        if (img.startsWith('data:image')) {
          const url = await uploadImage(img);
          uploadedImages.push(url);
        } else {
          uploadedImages.push(img);
        }
      }
    }

    const product = new Product({
      name,
      description,
      price,
      discountPrice: discountPrice || 0,
      category,
      image: uploadedImage,
      images: uploadedImages,
      stock,
      specs: specs || {},
      tags: tags || [],
      isFeatured: isFeatured || false,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, image, images, stock, specs, tags, isFeatured } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price !== undefined ? price : product.price;
      product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;
      product.category = category || product.category;
      product.stock = stock !== undefined ? stock : product.stock;
      product.specs = specs || product.specs;
      product.tags = tags || product.tags;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;

      // Handle image upload if modified
      if (image && image !== product.image) {
        if (image.startsWith('data:image')) {
          product.image = await uploadImage(image);
        } else {
          product.image = image;
        }
      }

      if (images) {
        let uploadedImages = [];
        for (const img of images) {
          if (img.startsWith('data:image')) {
            const url = await uploadImage(img);
            uploadedImages.push(url);
          } else {
            uploadedImages.push(img);
          }
        }
        product.images = uploadedImages;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
