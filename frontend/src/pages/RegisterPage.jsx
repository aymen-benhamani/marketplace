import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Select";

export function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "client" });
  const [loading, setLoading] = useState(false);
  const { authFetch, login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authFetch("/auth/register", { method: "POST", body: JSON.stringify(form) });
      login({ _id: data._id, name: data.name, email: data.email, role: data.role, sellerStatus: data.sellerStatus }, data.token);
      if (data.role === "seller" && data.sellerStatus === "pending") {
        addToast("Compte créé ! En attente d'approbation par l'admin.", "info");
      } else {
        addToast("Compte créé avec succès !", "success");
      }
      navigate("/");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-4">M</div>
          <h1 className="text-2xl font-black text-slate-900">Créer un compte</h1>
          <p className="text-slate-500 text-sm mt-1">Rejoignez notre marketplace</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl shadow-slate-100 p-8 space-y-4 border border-slate-100">
          <Input label="Nom complet" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" placeholder="votre@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <Input label="Mot de passe" type="password" placeholder="Minimum 6 caractères" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <Select label="Rôle" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="client">Client — Acheter des produits</option>
            <option value="seller">Vendeur — Vendre des produits</option>
          </Select>
          {form.role === "seller" && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
              ⚠️ Votre compte vendeur sera en attente d'approbation par l'administrateur.
            </div>
          )}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? "Création..." : "Créer mon compte →"}</Button>
          <p className="text-center text-sm text-slate-500">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-orange-500 font-medium hover:underline">Se connecter</Link>
          </p>
        </form>
      </div>
    </div>
  );
}