import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

export function Navbar({ onCartOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Boutique", path: "/" },
    ...(user?.role === "client" ? [{ label: "Mes Commandes", path: "/my-orders" }] : []),
    ...(user?.role === "seller" ? [{ label: "Mes Produits", path: "/my-products" }, { label: "Commandes reçues", path: "/seller-orders" }] : []),
    ...(user?.role === "admin" ? [{ label: "Admin", path: "/admin" }] : []),
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="flex items-center gap-2 font-black text-xl">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm">M</div>
            <span className="text-slate-900">Market<span className="text-orange-500">Place</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <button key={l.path} onClick={() => navigate(l.path)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors
                  ${pathname === l.path ? "bg-orange-50 text-orange-600" : "text-slate-600 hover:text-orange-500 hover:bg-slate-50"}`}
              >{l.label}</button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* ── Nom + badge → clique pour aller au profil ── */}
                <div
                  onClick={() => navigate("/profile")}
                  title="Mon profil"
                  className="hidden sm:flex items-center gap-1 text-sm text-slate-600 px-3 py-1.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-orange-50 hover:text-orange-500 transition-colors"
                >
                  <span>👋</span>
                  <span className="font-medium">{user.name}</span>
                  <Badge color={user.role === "admin" ? "red" : user.role === "seller" ? "blue" : "green"}>
                    {user.role}
                  </Badge>
                  {user.role === "seller" && user.sellerStatus !== "approved" && (
                    <Badge color={user.sellerStatus === "pending" ? "amber" : "red"}>
                      {user.sellerStatus === "pending" ? "⏳ En attente" : "❌ Rejeté"}
                    </Badge>
                  )}
                </div>

                {/* ── Panier (client uniquement) ── */}
                {user.role === "client" && (
                  <button onClick={onCartOpen} className="relative p-2.5 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors">
                    🛒
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {itemCount > 9 ? "9+" : itemCount}
                      </span>
                    )}
                  </button>
                )}

                <Button variant="ghost" size="sm" onClick={logout}>Déconnexion</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Connexion</Button>
                <Button size="sm" onClick={() => navigate("/register")}>S'inscrire</Button>
              </>
            )}

            <button className="md:hidden p-2 rounded-xl hover:bg-slate-100" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* ── Menu mobile ── */}
        {mobileOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-1">
            {navLinks.map(l => (
              <button key={l.path} onClick={() => { navigate(l.path); setMobileOpen(false); }}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-colors
                  ${pathname === l.path ? "bg-orange-50 text-orange-600" : "text-slate-600 hover:bg-slate-50"}`}
              >{l.label}</button>
            ))}
            {/* ── Profil dans le menu mobile ── */}
            {user && (
              <button
                onClick={() => { navigate("/profile"); setMobileOpen(false); }}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-colors
                  ${pathname === "/profile" ? "bg-orange-50 text-orange-600" : "text-slate-600 hover:bg-slate-50"}`}
              >
                👤 Mon Profil
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}