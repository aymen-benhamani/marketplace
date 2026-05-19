import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function ProfilePage() {
  const { user, authFetch, login, token } = useAuth();
  const { addToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });

  const roleConfig = {
    admin:  { color: "bg-rose-100 text-rose-600 border-rose-200",  icon: "🛡️", label: "Administrateur" },
    seller: { color: "bg-blue-100 text-blue-600 border-blue-200",  icon: "🏪", label: "Vendeur" },
    client: { color: "bg-emerald-100 text-emerald-600 border-emerald-200", icon: "🛒", label: "Client" },
  };

  const statusConfig = {
    approved: { color: "bg-emerald-100 text-emerald-600", label: "✓ Approuvé" },
    pending:  { color: "bg-amber-100 text-amber-600",     label: "⏳ En attente" },
    rejected: { color: "bg-rose-100 text-rose-600",       label: "✕ Rejeté" },
  };

  const role = roleConfig[user?.role] || roleConfig.client;
  const status = statusConfig[user?.sellerStatus];

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      return addToast("Tous les champs sont requis", "error");
    }
    setLoading(true);
    try {
      const updated = await authFetch("/users/profile", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      // Met à jour le contexte Auth avec les nouvelles infos
      login({ ...user, name: updated.name, email: updated.email }, token);
      addToast("Profil mis à jour ✓", "success");
      setEditing(false);
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: user?.name || "", email: user?.email || "" });
    setEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl">
          {role.icon}
        </div>
        <h1 className="text-2xl font-black text-slate-900">Mon Profil</h1>
      </div>

      {/* Avatar + infos principales */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-4">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center text-white text-3xl font-black flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black text-slate-900 truncate">{user?.name}</h2>
            <p className="text-slate-400 text-sm truncate">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${role.color}`}>
                {role.icon} {role.label}
              </span>
              {user?.role === "seller" && status && (
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
                  {status.label}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-4">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800">Informations personnelles</h3>
          {!editing && (
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              ✏️ Modifier
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {editing ? (
            <>
              <Input
                label="Nom complet"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Votre nom"
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="votre@email.com"
              />
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1" onClick={handleCancel}>
                  Annuler
                </Button>
                <Button className="flex-1" onClick={handleSave} disabled={loading}>
                  {loading ? "Enregistrement..." : "Sauvegarder ✓"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">Nom complet</p>
                  <p className="font-semibold text-slate-800">{user?.name}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">Email</p>
                  <p className="font-semibold text-slate-800 truncate">{user?.email}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">Rôle</p>
                  <p className="font-semibold text-slate-800 capitalize">{role.label}</p>
                </div>
                {user?.role === "seller" && (
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">Statut vendeur</p>
                    <p className="font-semibold text-slate-800">{status?.label}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Message selon statut vendeur */}
      {user?.role === "seller" && user?.sellerStatus === "pending" && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3">
          <span className="text-2xl">⏳</span>
          <div>
            <p className="font-semibold text-amber-800 text-sm">Compte en attente d'approbation</p>
            <p className="text-amber-600 text-xs mt-0.5">Un administrateur va examiner votre demande. Vous serez notifié une fois approuvé.</p>
          </div>
        </div>
      )}

      {user?.role === "seller" && user?.sellerStatus === "rejected" && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex gap-3">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold text-rose-800 text-sm">Compte rejeté</p>
            <p className="text-rose-600 text-xs mt-0.5">Votre demande vendeur a été refusée. Contactez le support pour plus d'informations.</p>
          </div>
        </div>
      )}

      {user?.role === "seller" && user?.sellerStatus === "approved" && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold text-emerald-800 text-sm">Compte vendeur actif</p>
            <p className="text-emerald-600 text-xs mt-0.5">Votre compte est approuvé. Vous pouvez publier et gérer vos produits.</p>
          </div>
        </div>
      )}

    </div>
  );
}