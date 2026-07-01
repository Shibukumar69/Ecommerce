import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layouts and guards
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import { LoginPage, SignupPage, ForgotPasswordPage } from './pages/AuthPages';
import DashboardUser from './pages/DashboardUser';
import DashboardAdmin from './pages/DashboardAdmin';

// Custom 404 Error Page
const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4 gap-4 animate-fade-in">
      <div className="text-8xl font-black bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent font-display">
        404
      </div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-display">Lost in the Nexus?</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
        The page you are looking for has either dissolved into another collection or never existed in the catalog.
      </p>
      <Link
        to="/"
        className="rounded-xl bg-violet-600 hover:bg-violet-550 px-6 py-3 text-xs font-bold text-white shadow mt-2 transition-all"
      >
        Go Back Home
      </Link>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Main Routing Layout */}
              <Route path="/" element={<MainLayout />}>
                {/* Public Routes */}
                <Route index element={<LandingPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetailsPage />} />
                <Route path="cart" element={<CartPage />} />
                
                {/* Authentication Routes */}
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />

                {/* User Protected Routes */}
                <Route
                  path="checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardUser />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <DashboardAdmin />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
