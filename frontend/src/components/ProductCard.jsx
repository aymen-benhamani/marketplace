import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

export function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-50 transition-all duration-300">
      <div
        className="relative h-52 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden cursor-pointer"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        {product.image
          ? <img src={`https://marketplace-aymen-benhamanis-projects.vercel.app${product.image}`} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center text-6xl">🛍️</div>
        }
        <div className="absolute top-3 left-3"><Badge color="orange">{product.category}</Badge></div>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-sm bg-black/60 px-3 py-1 rounded-full">Rupture de stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3
          className="font-bold text-slate-800 text-sm mb-1 truncate cursor-pointer hover:text-orange-500 transition-colors"
          onClick={() => navigate(`/product/${product._id}`)}
        >
          {product.name}
        </h3>
        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{product.description || "Aucune description"}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-black text-slate-900">{product.price.toFixed(2)}</span>
            <span className="text-sm text-slate-400 ml-1">MAD</span>
          </div>
          {user?.role === "client" && (
            <Button size="sm" onClick={() => onAddToCart(product)} disabled={product.stock === 0}>+ Panier</Button>
          )}
        </div>
        {product.deliveryPrice > 0 && <p className="text-xs text-slate-400 mt-1">+ {product.deliveryPrice} MAD livraison · {product.deliveryTime}</p>}
        {product.deliveryPrice === 0 && <p className="text-xs text-emerald-500 mt-1 font-medium">✓ Livraison gratuite</p>}
      </div>
    </div>
  );
}