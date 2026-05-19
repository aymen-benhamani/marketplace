import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { Navbar } from "./components/Navbar";
import { CartDrawer } from "./components/CartDrawer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { MyOrdersPage } from "./pages/MyOrdersPage";
import { MyProductsPage } from "./pages/MyProductsPage";
import { SellerOrdersPage } from "./pages/SellerOrdersPage";
import { AdminPage } from "./pages/AdminPage";
import { ProfilePage } from "./pages/ProfilePage"; // ✅ ajouté

// Layout commun : Navbar + footer + CartDrawer
function RootLayout() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <main>
        <Outlet />
      </main>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <footer className="border-t border-slate-100 bg-white mt-20 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2 font-black text-slate-700">
            <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center text-white text-xs">
              M
            </div>
            Market<span className="text-orange-500">Place</span>
          </div>
          <p>© {new Date().getFullYear()} MarketPlace. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route element={<RootLayout />}>
                {/* Routes publiques */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />

                {/* Routes protégées — client */}
                <Route path="/checkout" element={<ProtectedRoute roles={["client"]}><CheckoutPage /></ProtectedRoute>} />
                <Route path="/my-orders" element={<ProtectedRoute roles={["client"]}><MyOrdersPage /></ProtectedRoute>} />

                {/* Routes protégées — seller */}
                <Route path="/my-products" element={<ProtectedRoute roles={["seller"]}><MyProductsPage /></ProtectedRoute>} />
                <Route path="/seller-orders" element={<ProtectedRoute roles={["seller"]}><SellerOrdersPage /></ProtectedRoute>} />

                {/* Routes protégées — admin */}
                <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminPage /></ProtectedRoute>} />

                {/* ✅ Route profil — tous les rôles */}
                <Route path="/profile" element={<ProtectedRoute roles={["client", "seller", "admin"]}><ProfilePage /></ProtectedRoute>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}