import Product from '../models/Product.js';

/**
 * Recommends related products based on category overlap, matching tags, and price similarity.
 * @param {string} productId - ID of the target product
 * @param {number} limit - Number of recommendations to return
 * @returns {Promise<Array>} - List of recommended products
 */
export const getRecommendations = async (productId, limit = 4) => {
  try {
    const targetProduct = await Product.findById(productId);
    if (!targetProduct) return [];

    // Find candidate products (excluding the current product)
    const candidates = await Product.find({
      _id: { $ne: targetProduct._id },
    }).populate('category');

    const scored = candidates.map(product => {
      let score = 0;

      // 1. Same category weight (high priority)
      if (product.category && targetProduct.category && 
          product.category._id.toString() === targetProduct.category.toString()) {
        score += 5;
      }

      // 2. Matching tags overlap
      const commonTags = product.tags.filter(tag => targetProduct.tags.includes(tag));
      score += commonTags.length * 2;

      // 3. Price similarity (closer price = higher score)
      const priceDiff = Math.abs(product.price - targetProduct.price);
      const averagePrice = (product.price + targetProduct.price) / 2;
      const relativeDiff = averagePrice > 0 ? priceDiff / averagePrice : 0;
      if (relativeDiff < 0.2) {
        score += 3;
      } else if (relativeDiff < 0.5) {
        score += 1.5;
      }

      // 4. Rating contribution
      score += (product.ratings || 0) * 0.5;

      return { product, score };
    });

    // Sort by highest score first and slice
    const recommendations = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.product);

    return recommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};
