import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_BASE } from "../config";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";

export function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/products/${id}`)
      .then(r => r.json()).then(setProduct)
      .catch(() => addToast("Produit introuvable", "error"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!product) return <div className="text-center py-20 text-slate-400">Produit introuvable</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="rounded-2xl overflow-hidden bg-slate-100 aspect-square">
          {product.image ? <img src={`https://marketplace-aymen-benhamanis-projects.vercel.app${product.image}`} alt={product.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-8xl">🛍️</div>}
        </div>
        <div className="flex flex-col gap-5">
          <div>
            <Badge color="orange">{product.category}</Badge>
            <h1 className="text-3xl font-black text-slate-900 mt-2">{product.name}</h1>
            <p className="text-slate-500 mt-2 leading-relaxed">{product.description || "Aucune description disponible."}</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-orange-500">{product.price.toFixed(2)}</span>
            <span className="text-lg text-slate-400">MAD</span>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl text-sm">
            <div><span className="text-slate-400">Livraison</span><p className="font-semibold text-slate-800">{product.deliveryPrice === 0 ? "Gratuite" : `${product.deliveryPrice} MAD`}</p></div>
            <div><span className="text-slate-400">Délai</span><p className="font-semibold text-slate-800">{product.deliveryTime}</p></div>
            <div><span className="text-slate-400">Stock</span><p className={`font-semibold ${product.stock === 0 ? "text-rose-500" : "text-emerald-600"}`}>{product.stock === 0 ? "Rupture" : `${product.stock} dispo.`}</p></div>
            <div><span className="text-slate-400">Vendeur</span><p className="font-semibold text-slate-800 truncate">{product.seller?.name}</p></div>
          </div>
          {user?.role === "client" && (
            <Button size="lg" disabled={product.stock === 0} onClick={() => { addToCart(product); addToast(`${product.name} ajouté au panier !`, "success"); }}>
              🛒 Ajouter au panier
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}