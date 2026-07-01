import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Product from './models/Product.js';

dotenv.config();

const seedDB = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected.');

    // Clear existing data
    console.log('Clearing old categories and products...');
    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log('Seeding categories...');
    const categoriesData = [
      {
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Next-generation flagship smartphones and mobile accessories.',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Laptops',
        slug: 'laptops',
        description: 'Premium notebooks, workstations, and high-performance ultrabooks.',
        image: 'https://images.unsplash.com/photo-1496181130204-7552cc15f0e1?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Audio Gear',
        slug: 'audio-gear',
        description: 'Noise cancelling over-ear headphones, audio setups, and wireless earbuds.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Inductive charging docks, adapters, and smart watches.',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
      },
    ];

    const seededCats = await Category.insertMany(categoriesData);
    console.log(`Seeded ${seededCats.length} categories.`);

    // Map Category IDs
    const catsMap = seededCats.reduce((acc, c) => {
      acc[c.name] = c._id;
      return acc;
    }, {});

    const productsData = [];

    // 1. Smartphones (15 Items - Price range: ₹24,999 to ₹94,999)
    const phoneImages = [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1565849906660-446927977786?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600',
    ];

    const phoneModels = [
      'Nexus Pro Max', 'Nova Foldable', 'Aura Lite', 'Zeta Fold 5G', 'Titan Bold',
      'Quantum Photon', 'Nebula Orbit', 'Apex Fusion', 'Vortex Prime', 'Elysian Air',
      'Horizon Prism', 'Stellar Ray', 'Aero Swift', 'Pulse Core', 'Solar Flare'
    ];

    for (let i = 0; i < 15; i++) {
      const basePrice = 24999 + (i * 5000);
      const discount = i % 3 === 0 ? basePrice - 4000 : 0;
      productsData.push({
        name: `${phoneModels[i]} 5G`,
        description: `Premium smartphone features a stunning high-refresh AMOLED screen, AI-enhanced camera array, and flagship octa-core performance for mobile multitasking.`,
        price: basePrice,
        discountPrice: discount,
        category: catsMap['Smartphones'],
        image: phoneImages[i % phoneImages.length],
        stock: 10 + (i * 5),
        tags: ['phone', 'smartphone', 'mobile', 'flagship', 'android', 'nexus'],
        specs: new Map([
          ['screen', `${6.1 + (i * 0.05)} inch Display`],
          ['cpu', `A${14 + i} OctaCore`],
          ['ram', `${8 + (i % 3) * 4}GB RAM`],
        ]),
        isFeatured: i % 4 === 0,
      });
    }

    // 2. Laptops (15 Items - Price range: ₹44,999 to ₹1,56,999)
    const laptopImages = [
      'https://images.unsplash.com/photo-1496181130204-7552cc15f0e1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1504707748692-419802cf939d?auto=format&fit=crop&q=80&w=600',
    ];

    const laptopModels = [
      'UltraBook Air 14', 'Zenith Pro 16', 'Vapor Rig 15', 'Horizon Slate', 'Coda Book 13',
      'Quantum Node', 'Pixel Slate 14', 'Viper Blade 17', 'Titan Force', 'Nomad Touch',
      'Synapse Pro', 'Helix Flip', 'Spectre Elite', 'Vortex Studio', 'Carbon Nano'
    ];

    for (let i = 0; i < 15; i++) {
      const basePrice = 44999 + (i * 8000);
      const discount = i % 4 === 0 ? basePrice - 8000 : 0;
      productsData.push({
        name: laptopModels[i],
        description: `Premium high-performance notebook built for software development, graphic rendering, coding compile sessions, and immersive entertainment.`,
        price: basePrice,
        discountPrice: discount,
        category: catsMap['Laptops'],
        image: laptopImages[i % laptopImages.length],
        stock: 5 + (i * 3),
        tags: ['laptop', 'notebook', 'computer', 'coding', 'ultrabook'],
        specs: new Map([
          ['screen', `${13.3 + (i % 3) * 1.5} inch IPS`],
          ['ram', `${16 + (i % 2) * 16}GB RAM`],
          ['storage', `${512 + (i % 3) * 512}GB SSD`],
        ]),
        isFeatured: i % 4 === 0,
      });
    }

    // 3. Audio Gear (15 Items - Price range: ₹2,499 to ₹23,499)
    const audioImages = [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=600',
    ];

    const audioModels = [
      'Hologram Headset', 'SoundBox Aura', 'Pulse Earbuds', 'Echo Soundbar', 'Acoustic Studio',
      'Wave Pods', 'Beat Cannon', 'Sub-Zero Woofer', 'SoundStage Pro', 'Nomad Mini Speaker',
      'Aerobuds', 'Cinema Surround', 'Sonic Link', 'Vibe Buds', 'Resonance Over-Ear'
    ];

    for (let i = 0; i < 15; i++) {
      const basePrice = 2499 + (i * 1500);
      const discount = i % 3 === 0 ? basePrice - 500 : 0;
      productsData.push({
        name: audioModels[i],
        description: `Experience high-fidelity spatial audio and hybrid active noise cancellation, perfect for gaming streams, work calls, or wireless workout setups.`,
        price: basePrice,
        discountPrice: discount,
        category: catsMap['Audio Gear'],
        image: audioImages[i % audioImages.length],
        stock: 30 + (i * 10),
        tags: ['audio', 'headphones', 'earbuds', 'speaker', 'wireless', 'music'],
        specs: new Map([
          ['connectivity', 'Bluetooth 5.3'],
          ['battery', `${20 + i * 2} Hours`],
          ['features', 'ANC / Waterproof'],
        ]),
        isFeatured: i % 4 === 0,
      });
    }

    // 4. Accessories (15 Items - Price range: ₹999 to ₹12,199)
    const accImages = [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600',
    ];

    const accModels = [
      'Charging Pad Pro', 'Horizon Watch v2', 'ClickPro Keyboard', 'Sight VR Goggles', 'GripPro Mouse',
      'Hub-Multi Adapter', 'Desk Mat Glass', 'Stylus Pencil X', 'Secure Case', 'Smart Tag Tracker',
      'Backpack Techpack', 'Cable Organizer', 'Laptop Cooling Stand', 'Watch Loop Strap', 'Ring Health Tracker'
    ];

    for (let i = 0; i < 15; i++) {
      const basePrice = 999 + (i * 800);
      const discount = i % 3 === 0 ? basePrice - 200 : 0;
      productsData.push({
        name: accModels[i],
        description: `Increase your desk ergonomics and smart connectivity with premium materials, compact structures, and state-of-the-art designs.`,
        price: basePrice,
        discountPrice: discount,
        category: catsMap['Accessories'],
        image: accImages[i % accImages.length],
        stock: 40 + (i * 8),
        tags: ['accessories', 'desk-setup', 'charging', 'smart-watch', 'keyboard'],
        specs: new Map([
          ['compatibility', 'Universal USB-C / wireless'],
          ['material', 'Recycled aluminum / silicon'],
          ['warranty', '1 Year manufacturer warranty'],
        ]),
        isFeatured: i % 4 === 0,
      });
    }

    const seededProds = await Product.insertMany(productsData);
    console.log(`Seeded ${seededProds.length} products.`);

    console.log('Database seeding successfully finished!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();
