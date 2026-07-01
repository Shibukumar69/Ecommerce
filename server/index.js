import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB Database
await connectDB();

const ensureDevUser = async () => {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const devUser = {
    name: 'shibu kumar',
    email: 'shibukumar3935@gmail.com',
    password: '1111Shibu',
    role: 'user',
  };

  const existingUser = await User.findOne({ email: devUser.email }).select('+password');

  if (!existingUser) {
    await User.create(devUser);
    console.log(`Seeded development login for ${devUser.email}`);
    return;
  }

  const passwordMatches = await bcrypt.compare(devUser.password, existingUser.password);

  if (!passwordMatches) {
    existingUser.password = devUser.password;
    await existingUser.save();
    console.log(`Reset development login password for ${devUser.email}`);
  }
};

await ensureDevUser();

const app = express();

// Middleware configuration
app.use(helmet());
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];

if (process.env.CLIENT_URL && process.env.CLIENT_URL !== '*') {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    // If CLIENT_URL is '*' in env, allow any origin dynamically to support credentials
    if (process.env.CLIENT_URL === '*') {
      return callback(null, true);
    }
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Dynamically allow all Vercel domains
    if (origin.endsWith('.vercel.app') || origin.startsWith('https://ecommerce-')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' })); // Allows base64 image data parsing
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
