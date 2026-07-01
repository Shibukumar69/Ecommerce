# NexusShop | Premium Full-Stack Product Catalog

NexusShop is a production-ready, high-end Full-Stack E-Commerce Product Catalog application featuring a premium glassmorphic UI, Light/Dark theme selector, voice-guided product search, content-based AI recommendations, and secure administrator inventory managers (CRUD).

Developed using **React + Vite + TypeScript + Tailwind CSS v4 + Framer Motion** on the frontend, and **Node.js + Express.js + Mongoose (MongoDB)** on the backend.

---

## 📂 Project Architecture

```
d:/FullStack-project/
├── client/                     # React + Vite + TypeScript Frontend
│   ├── public/                 # Static assets, sw.js (PWA service worker)
│   ├── src/
│   │   ├── assets/             # SVGs, banners
│   │   ├── components/         # Reusable UI (Navbar, ProductCard, Skeleton, Toast, VoiceSearch)
│   │   ├── context/            # Global state (AuthContext, CartContext, ThemeContext)
│   │   ├── layouts/            # Page layouts (MainLayout)
│   │   ├── pages/              # Views (Landing, Products, ProductDetails, Cart, Checkout, Auth, Dashboards)
│   │   ├── routes/             # Guards (ProtectedRoute, App routes)
│   │   ├── services/           # API config (Axios interceptors)
│   │   ├── styles/             # Tailwind imports & customized keyframe themes
│   │   └── types/              # TypeScript typings
│   ├── index.html              # HTML Mount
│   └── package.json            # React bundle configurations
│
└── server/                     # Node.js + Express Backend
    ├── config/                 # DB & Cloudinary connection
    ├── controllers/            # Request handlers (auth, products, categories, orders, reviews, wishlist)
    ├── middleware/             # guards (Auth, Error, Validation, Rate Limiter)
    ├── models/                 # Mongoose Schemas (User, Product, Category, Order, Review, Wishlist)
    ├── routes/                 # Express routing binders
    ├── services/               # Recommendation engine & Cloudinary uploading
    ├── index.js                # Server entry point
    └── package.json            # Backend package scripts
```

---

## 🛠️ Environment Variables Config

### Server (`server/.env`)
Create a `.env` file in the `server/` directory:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nexus_catalog?retryWrites=true&w=majority

# JWT Token Secret
JWT_SECRET=super_secret_jwt_signature_key

# Cloudinary (Optional - falls back to default URLs if omitted)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Client (`client/.env`)
Create a `.env` file in the `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📖 API Documentation

### Auth Endpoint (`/api/auth`)
* `POST /api/auth/register` - Create user account. Body: `{ name, email, password }`
* `POST /api/auth/login` - Verify login. Body: `{ email, password }`
* `GET /api/auth/profile` - Fetch profile details. (Auth Token Required)
* `PUT /api/auth/profile` - Update name/password. (Auth Token Required)
* `GET /api/auth/users` - List all registered accounts. (Admin Role Required)

### Products Catalog (`/api/products`)
* `GET /api/products` - Query products list with filters, sorting, keyword search, and pagination.
  * Query parameters: `?keyword=...&category=...&minPrice=...&maxPrice=...&rating=...&sort=...&page=...`
* `GET /api/products/:id` - Fetch item details and its corresponding content-based AI recommendations.
* `POST /api/products` - Create catalog item. (Admin + Auth Required)
* `PUT /api/products/:id` - Update catalog item. (Admin + Auth Required)
* `DELETE /api/products/:id` - Remove item. (Admin + Auth Required)

### Categories (`/api/categories`)
* `GET /api/categories` - Fetch all collections.
* `POST /api/categories` - Create new collection. (Admin + Auth Required)
* `PUT /api/categories/:id` - Modify collection. (Admin + Auth Required)
* `DELETE /api/categories/:id` - Remove collection. (Admin + Auth Required)

### Orders & Analytics (`/api/orders`)
* `POST /api/orders` - Compile shipping details and submit order. (Auth Required)
* `PUT /api/orders/:id/pay` - Process mock transaction details. (Auth Required)
* `GET /api/orders/myorders` - Track history for logged-in user. (Auth Required)
* `GET /api/orders/:id` - Fetch detailed receipt metrics. (Auth or Admin Required)
* `GET /api/orders` - View all database invoices. (Admin Role Required)
* `GET /api/orders/analytics` - Compile revenue sums, categories shares, and monthly sales trends. (Admin Role Required)

### Reviews (`/api/reviews`)
* `POST /api/reviews` - Post rating and comment for product. (Auth Required)
* `GET /api/reviews/product/:productId` - List reviews for a product.

### Wishlist (`/api/wishlist`)
* `GET /api/wishlist` - Retrieve favorited items. (Auth Required)
* `POST /api/wishlist/toggle` - Save or unsave items. Body: `{ productId }`. (Auth Required)

---

## 🚀 Installation & Local Running

### Prerequisite
Ensure [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) (local or MongoDB Atlas) are available.

### Setup Backend
1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Configure your `.env` variables from template.
4. Launch the developer server: `npm run dev`

### Setup Frontend
1. Navigate to the client folder: `cd client`
2. Install dependencies: `npm install`
3. Configure your `.env` VITE URL endpoint.
4. Run the hot-reloading dev server: `npm run dev`
5. Open `http://localhost:5173` in your browser.

> [!TIP]
> **Developer Seed Mechanism**: Once running, log in as an administrator (or register and set role to `'admin'` directly in the database), navigate to `/admin`, and click **Seed Sample Catalog** to populate premium smartphones, laptops, audio gear, and accessory items automatically.

---

## ☁️ Deployment Guide

### 🍃 MongoDB Atlas Configuration
1. Register/Login on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Free Shared Cluster. Select your preferred Cloud Provider and Region.
3. Under **Database Access**, create a user account with a password (read/write access).
4. Under **Network Access**, add IP `0.0.0.0/0` (allows incoming requests from all environments like Render).
5. Click **Connect** on your Database Cluster, choose **Drivers / Node.js**, and copy the Connection String.
6. Swap `<password>` with your database password and use it in your server's `MONGODB_URI`.

### 🖥️ Backend Deployment on Render
1. Register/Login on [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your repository containing the backend code.
4. Configure parameters:
   * **Root Directory**: `server` (if in a monorepo workspace) or root.
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
5. In **Environment Variables**, add the environment variables defined in the Server Config section above.
6. Deploy the service. Copy the generated URL (e.g. `https://your-app.onrender.com`).

### 🎨 Frontend Deployment on Vercel
1. Register/Login on [Vercel](https://vercel.com/).
2. Click **Add New** and select **Project**. Connect your GitHub workspace.
3. Configure parameters:
   * **Root Directory**: `client`
   * **Framework Preset**: `Vite`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Under **Environment Variables**, add `VITE_API_URL` pointing to your deployed Render URL (e.g. `https://your-app.onrender.com/api`).
5. Click **Deploy**. Vercel will build the bundle, apply compression, configure tree-shaking, and serve the application globally.
