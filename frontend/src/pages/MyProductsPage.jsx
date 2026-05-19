import { useState, useEffect } from "react";
import { API_BASE } from "../config";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Modal } from "../components/ui/Modal";
import { Badge } from "../components/ui/Badge";
import { Spinner } from "../components/ui/Spinner";

const CATEGORIES = ["general", "electronics", "clothing", "food", "home", "beauty", "sports", "books"];

// Empêche les valeurs négatives
const noNeg = (val, isInt = false) => {
  const n = isInt ? parseInt(val) : parseFloat(val);
  return isNaN(n) ? "" : String(Math.max(0, n));
};

export function MyProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "general", stock: "", deliveryPrice: "", deliveryTime: "2-3 days" });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const { authFetch, token, user } = useAuth();
  const { addToast } = useToast();

  if (user?.sellerStatus === "pending") return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">⏳</div>
      <h2 className="text-xl font-black text-slate-800 mb-2">Compte en attente</h2>
      <p className="text-slate-500 text-sm">Votre compte vendeur est en cours de validation par un administrateur.</p>
    </div>
  );

  if (user?.sellerStatus === "rejected") return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">❌</div>
      <h2 className="text-xl font-black text-slate-800 mb-2">Compte rejeté</h2>
      <p className="text-slate-500 text-sm">Votre demande vendeur a été refusée. Contactez le support.</p>
    </div>
  );

  const load = () => {
    authFetch("/products/my")
      .then(setProducts)
      .catch(() => addToast("Erreur chargement", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", price: "", category: "general", stock: "", deliveryPrice: "", deliveryTime: "2-3 days" });
    setImageFile(null);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, stock: p.stock, deliveryPrice: p.deliveryPrice, deliveryTime: p.deliveryTime });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await authFetch(`/products/${editing._id}`, { method: "PUT", body: JSON.stringify(form) });
        addToast("Produit mis à jour", "success");
      } else {
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("description", form.description);
        fd.append("price", form.price);
        fd.append("category", form.category);
        fd.append("stock", form.stock);
        fd.append("deliveryPrice", form.deliveryPrice);
        fd.append("deliveryTime", form.deliveryTime);
        if (imageFile) fd.append("image", imageFile);
        const res = await fetch(`${API_BASE}/products`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur création produit");
        addToast("Produit créé !", "success");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce produit ?")) return;
    try {
      await authFetch(`/products/${id}`, { method: "DELETE" });
      addToast("Produit supprimé", "success");
      load();
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  const blockMinus = (e) => e.key === "-" && e.preventDefault();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-slate-900">🏪 Mes Produits</h1>
        <Button onClick={openCreate}>+ Nouveau produit</Button>
      </div>

      {loading ? <Spinner /> : products.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <div className="text-6xl mb-4">📦</div>
          <p className="font-medium text-slate-500 mb-4">Aucun produit encore</p>
          <Button onClick={openCreate}>Créer votre premier produit</Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>{["Produit", "Catégorie", "Prix", "Stock", "Livraison", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map(p => (
                  <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                          {p.image
                            ? <img src={`http://localhost:5000${p.image}`} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-sm">🛍️</div>}
                        </div>
                        <span className="font-medium text-sm text-slate-800 max-w-[150px] truncate">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge color="blue">{p.category}</Badge></td>
                    <td className="px-4 py-3"><span className="font-bold text-slate-900">{p.price} MAD</span></td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${p.stock === 0 ? "text-rose-500" : "text-emerald-600"}`}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{p.deliveryPrice === 0 ? "Gratuite" : `${p.deliveryPrice} MAD`}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>✏️</Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(p._id)}>🗑️</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier le produit" : "Nouveau produit"}>
        <div className="space-y-4">
          <Input
            label="Nom du produit"
            placeholder="Ex: iPhone 15 Pro"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Décrivez votre produit..."
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Prix — pas de négatif */}
            <Input
              label="Prix (MAD)"
              type="number"
              min="0"
              placeholder="0.00"
              value={form.price}
              onKeyDown={blockMinus}
              onChange={e => setForm({ ...form, price: noNeg(e.target.value) })}
            />
            {/* Stock — pas de négatif, entier */}
            <Input
              label="Stock"
              type="number"
              min="0"
              placeholder="0"
              value={form.stock}
              onKeyDown={blockMinus}
              onChange={e => setForm({ ...form, stock: noNeg(e.target.value, true) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Frais livraison — pas de négatif */}
            <Input
              label="Frais livraison (MAD)"
              type="number"
              min="0"
              placeholder="0"
              value={form.deliveryPrice}
              onKeyDown={blockMinus}
              onChange={e => setForm({ ...form, deliveryPrice: noNeg(e.target.value) })}
            />
            <Input
              label="Délai livraison"
              placeholder="2-3 jours"
              value={form.deliveryTime}
              onChange={e => setForm({ ...form, deliveryTime: e.target.value })}
            />
          </div>

          <Select label="Catégorie" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </Select>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Image {editing && <span className="text-slate-400">(laisser vide pour garder l'actuelle)</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setImageFile(e.target.files[0])}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-600 file:text-xs file:font-medium"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button className="flex-1" onClick={handleSave} disabled={saving}>
              {saving ? "Enregistrement..." : editing ? "Mettre à jour" : "Créer le produit"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}