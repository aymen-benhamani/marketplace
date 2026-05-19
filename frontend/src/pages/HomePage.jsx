import { useState, useEffect, useCallback } from "react";
import { API_BASE } from "../config";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { ProductCard } from "../components/ProductCard";
import { Badge } from "../components/ui/Badge";
import { Spinner } from "../components/ui/Spinner";

export function HomePage() {
  const [products, setProducts]     = useState([]);
  const [popular, setPopular]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [loadingPop, setLoadingPop] = useState(true);
  const [activeTab, setActiveTab]   = useState("all"); // "all" | "popular"
  const [search, setSearch]         = useState("");
  const [category, setCategory]     = useState("");
  const [sortBy, setSortBy]         = useState("");
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const categories = ["general", "electronics", "clothing", "food", "home", "beauty", "sports", "books"];

  // ── Charger tous les produits ──────────────────────────────
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search)   params.append("search", search);
      if (category) params.append("category", category);
      const res  = await fetch(`${API_BASE}/products?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const sorted = [...(data.products || data)].sort((a, b) => {
        if (sortBy === "alpha-asc")  return a.name.localeCompare(b.name);
        if (sortBy === "alpha-desc") return b.name.localeCompare(a.name);
        if (sortBy === "price-asc")  return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0;
      });
      setProducts(sorted);
    } catch {
      addToast("Erreur lors du chargement des produits", "error");
    } finally {
      setLoading(false);
    }
  }, [search, category, sortBy, addToast]);

  // ── Charger les produits populaires ───────────────────────
  const loadPopular = useCallback(async () => {
    setLoadingPop(true);
    try {
      const res  = await fetch(`${API_BASE}/products/popular?limit=8`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPopular(data.products || data);
    } catch {
      addToast("Erreur lors du chargement des populaires", "error");
    } finally {
      setLoadingPop(false);
    }
  }, [addToast]);

  useEffect(() => {
    const t = setTimeout(loadProducts, 300);
    return () => clearTimeout(t);
  }, [loadProducts]);

  useEffect(() => {
    loadPopular();
  }, [loadPopular]);

  const sortLabel = {
    "alpha-asc":  "A → Z",
    "alpha-desc": "Z → A",
    "price-asc":  "Prix ↑",
    "price-desc": "Prix ↓",
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    addToast(`${product.name} ajouté au panier`, "success");
  };

  const displayed    = activeTab === "popular" ? popular : products;
  const isLoadingTab = activeTab === "popular" ? loadingPop : loading;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* HERO BANNER */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-400 rounded-3xl p-8 mb-10 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full opacity-10 text-[10rem] flex items-center justify-center">🛍️</div>
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-black mb-2">Découvrez nos produits</h1>
          <p className="text-orange-100 mb-6 text-sm md:text-base">Les meilleures offres, livrées chez vous rapidement.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="flex-1 px-5 py-3 rounded-xl text-slate-900 text-sm outline-none focus:ring-4 focus:ring-white/30"
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="px-4 py-3 rounded-xl text-slate-900 text-sm outline-none bg-white"
            >
              <option value="">Toutes catégories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl text-slate-900 text-sm outline-none bg-white"
            >
              <option value="">Trier par...</option>
              <option value="alpha-asc">Nom A → Z</option>
              <option value="alpha-desc">Nom Z → A</option>
              <option value="price-asc">Prix croissant ↑</option>
              <option value="price-desc">Prix décroissant ↓</option>
            </select>
          </div>
        </div>
      </div>

      {/* ONGLETS */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "all"
              ? "bg-orange-500 text-white shadow-lg shadow-orange-100"
              : "bg-white border border-slate-200 text-slate-600 hover:border-orange-300"
          }`}
        >
          Tous les produits
          <span className="ml-2 text-xs opacity-70">({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("popular")}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "popular"
              ? "bg-amber-500 text-white shadow-lg shadow-amber-100"
              : "bg-white border border-slate-200 text-slate-600 hover:border-amber-300"
          }`}
        >
          🔥 Populaires
          <span className="text-xs opacity-70">({popular.length})</span>
          {popular.length > 0 && activeTab !== "popular" && (
            <span className="ml-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          )}
        </button>
      </div>

      {/* FILTRES ACTIFS — uniquement sur l'onglet "all" */}
      {activeTab === "all" && (search || category || sortBy) && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-sm text-slate-500">Filtres actifs :</span>
          {search   && <Badge color="orange">🔍 {search}</Badge>}
          {category && <Badge color="blue">📦 {category}</Badge>}
          {sortBy   && <Badge color="slate">↕ {sortLabel[sortBy]}</Badge>}
          <button
            onClick={() => { setSearch(""); setCategory(""); setSortBy(""); }}
            className="text-xs text-slate-400 hover:text-rose-500 underline"
          >
            Effacer tout
          </button>
        </div>
      )}

      {/* DESCRIPTION onglet populaires */}
      {activeTab === "popular" && (
        <p className="text-sm text-slate-500 mb-6">
          Classés par nombre de ventes · mis à jour en temps réel
        </p>
      )}

      {/* GRILLE PRODUITS */}
      {isLoadingTab ? <Spinner /> : displayed.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-6xl mb-4">{activeTab === "popular" ? "🔥" : "🔍"}</div>
          <p className="font-medium">
            {activeTab === "popular"
              ? "Aucun produit populaire pour le moment"
              : "Aucun produit trouvé"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {displayed.map((p, index) => (
            <div key={p._id} className="relative">

              {/* Badge rang pour les populaires */}
              {activeTab === "popular" && (
                <div className={`absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-md ${
                  index === 0 ? "bg-yellow-400 text-yellow-900" :
                  index === 1 ? "bg-slate-300 text-slate-700"   :
                  index === 2 ? "bg-amber-600 text-white"        :
                                "bg-slate-100 text-slate-500"
                }`}>
                  {index + 1}
                </div>
              )}

              <ProductCard
                product={p}
                onAddToCart={handleAddToCart}
              />

              {/* Nombre de ventes sous la carte */}
              {activeTab === "popular" && p.sold > 0 && (
                <div className="mt-1.5 text-center">
                  <span className="text-xs text-amber-600 font-semibold">
                    🔥 {p.sold} vente{p.sold > 1 ? "s" : ""}
                  </span>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}