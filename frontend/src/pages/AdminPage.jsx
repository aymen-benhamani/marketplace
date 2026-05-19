import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Badge } from "../components/ui/Badge";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";

export function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authFetch } = useAuth();
  const { addToast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const [u, p] = await Promise.all([authFetch("/admin/users"), authFetch("/admin/sellers/pending")]);
      setUsers(u);
      setPendingSellers(p);
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const approveSeller = async (id) => {
    try { await authFetch(`/admin/sellers/${id}/approve`, { method: "PATCH" }); addToast("Vendeur approuvé ✓", "success"); load(); }
    catch (err) { addToast(err.message, "error"); }
  };

  const rejectSeller = async (id) => {
    try { await authFetch(`/admin/sellers/${id}/reject`, { method: "PATCH" }); addToast("Vendeur rejeté", "info"); load(); }
    catch (err) { addToast(err.message, "error"); }
  };

  const roleColors = { admin: "red", seller: "blue", client: "green" };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white text-xl">🛡️</div>
        <h1 className="text-2xl font-black text-slate-900">Panel Administrateur</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total utilisateurs", value: users.length, icon: "👥", color: "bg-blue-50 text-blue-600" },
          { label: "Vendeurs actifs", value: users.filter(u => u.role === "seller" && u.sellerStatus === "approved").length, icon: "🏪", color: "bg-emerald-50 text-emerald-600" },
          { label: "Clients", value: users.filter(u => u.role === "client").length, icon: "🛒", color: "bg-orange-50 text-orange-600" },
          { label: "En attente", value: pendingSellers.length, icon: "⏳", color: "bg-amber-50 text-amber-600" },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-4">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-xl mb-3`}>{stat.icon}</div>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mb-6">
        {[{ id: "users", label: `Utilisateurs (${users.length})` }, { id: "pending", label: `Vendeurs en attente (${pendingSellers.length})` }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors relative ${activeTab === t.id ? "bg-orange-500 text-white shadow-lg shadow-orange-100" : "bg-white border border-slate-200 text-slate-600 hover:border-orange-300"}`}>
            {t.label}
            {t.id === "pending" && pendingSellers.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{pendingSellers.length}</span>
            )}
          </button>
        ))}
      </div>
      {loading ? <Spinner /> : (
        <>
          {activeTab === "users" && (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50"><tr>{["Nom", "Email", "Rôle", "Statut", "Inscrit le"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.map(u => (
                      <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center text-white text-xs font-bold">{u.name.charAt(0).toUpperCase()}</div>
                            <span className="font-medium text-sm text-slate-800">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">{u.email}</td>
                        <td className="px-4 py-3"><Badge color={roleColors[u.role] || "slate"}>{u.role}</Badge></td>
                        <td className="px-4 py-3">{u.role === "seller" ? <StatusBadge status={u.sellerStatus || "pending"} /> : <span className="text-xs text-slate-300">—</span>}</td>
                        <td className="px-4 py-3 text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString("fr-FR")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === "pending" && (
            pendingSellers.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-2xl text-slate-400"><div className="text-5xl mb-3">✅</div><p className="font-medium">Aucun vendeur en attente</p></div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {pendingSellers.map(u => (
                  <div key={u._id} className="bg-white rounded-2xl border border-amber-200 p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center text-white text-lg font-bold">{u.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <p className="font-bold text-slate-800">{u.name}</p>
                        <p className="text-sm text-slate-400">{u.email}</p>
                        <p className="text-xs text-slate-300 mt-0.5">Inscrit le {new Date(u.createdAt).toLocaleDateString("fr-FR")}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm" onClick={() => approveSeller(u._id)}>✓ Approuver</Button>
                      <Button variant="danger" className="flex-1" size="sm" onClick={() => rejectSeller(u._id)}>✕ Rejeter</Button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}