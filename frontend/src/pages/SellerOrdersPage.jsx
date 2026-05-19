import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Spinner } from "../components/ui/Spinner";

// ─── Config des statuts ───────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:   { label: "En attente",  emoji: "⏳", color: "bg-amber-100 text-amber-700 border-amber-200" },
  confirmed: { label: "Confirmée",   emoji: "✅", color: "bg-blue-100 text-blue-700 border-blue-200" },
  shipped:   { label: "Expédiée",    emoji: "🚚", color: "bg-purple-100 text-purple-700 border-purple-200" },
  delivered: { label: "Livrée",      emoji: "📦", color: "bg-green-100 text-green-700 border-green-200" },
  cancelled: { label: "Annulée",     emoji: "❌", color: "bg-red-100 text-red-700 border-red-200" },
};

// Boutons d'action selon le statut actuel
const NEXT_ACTIONS = {
  pending:   [{ status: "confirmed", label: "Confirmer",  emoji: "✅", style: "bg-blue-500 hover:bg-blue-600 text-white" },
              { status: "cancelled", label: "Annuler",    emoji: "❌", style: "bg-red-100 hover:bg-red-200 text-red-600" }],
  confirmed: [{ status: "shipped",   label: "Expédier",   emoji: "🚚", style: "bg-purple-500 hover:bg-purple-600 text-white" },
              { status: "cancelled", label: "Annuler",    emoji: "❌", style: "bg-red-100 hover:bg-red-200 text-red-600" }],
  shipped:   [{ status: "delivered", label: "Livrée",     emoji: "📦", style: "bg-green-500 hover:bg-green-600 text-white" }],
  delivered: [],
  cancelled: [],
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${cfg.color}`}>
      {cfg.emoji} {cfg.label}
    </span>
  );
}

export function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); 
  const { authFetch } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    authFetch("/orders/seller")
      .then(setOrders)
      .catch(() => addToast("Erreur chargement", "error"))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await authFetch(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      addToast(
        status === "cancelled"
          ? "Commande annulée — stock remis à jour" : "Statut mis à jour",
        status === "cancelled" ? "error" : "success"
      );
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-slate-900">📋 Commandes reçues</h1>
        <span className="text-sm text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl font-medium">
          {orders.length} commande{orders.length !== 1 ? "s" : ""}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-6xl mb-4">📭</div>
          <p className="font-medium">Aucune commande reçue</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const actions = NEXT_ACTIONS[order.status] || [];
            const isUpdating = updating === order._id;

            return (
              <div key={order._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-50">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-black text-slate-800 font-mono">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <span className="font-black text-orange-500 text-lg">
                    {(order.sellerTotal || order.total || 0).toFixed(2)} MAD
                  </span>
                </div>

                {/* ── Acheteur ── */}
                {order.buyer && (
                  <div className="px-5 py-2 bg-slate-50 text-xs text-slate-500 flex items-center gap-2">
                    <span>👤</span>
                    <span className="font-semibold text-slate-700">{order.buyer.name}</span>
                    <span>·</span>
                    <span>{order.buyer.email}</span>
                  </div>
                )}

                {/* ── Produits ── */}
                <div className="px-5 py-3 space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-700">
                        <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-md flex items-center justify-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-800">
                        {(item.price * item.quantity).toFixed(2)} MAD
                      </span>
                    </div>
                  ))}
                </div>

                {/* ── Adresse ── */}
                <div className="px-5 py-2 border-t border-slate-50 text-xs text-slate-400 flex items-center gap-1.5">
                  <span>📍</span>
                  <span>{order.shippingAddress?.name}</span>
                  <span>·</span>
                  <span>{order.shippingAddress?.address}</span>
                  <span>·</span>
                  <span>{order.shippingAddress?.phone}</span>
                </div>

                {/* ── Actions ── */}
                {actions.length > 0 && (
                  <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-400 font-medium mr-1">Action :</span>
                    {actions.map(action => (
                      <button
                        key={action.status}
                        onClick={() => updateStatus(order._id, action.status)}
                        disabled={isUpdating}
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${action.style}`}
                      >
                        {isUpdating ? "⏳" : action.emoji} {action.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Commande terminée ou annulée → pas d'action */}
                {actions.length === 0 && (
                  <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400 italic">
                    {order.status === "delivered" ? "✅ Commande terminée" : "❌ Commande annulée — stock remis à jour"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}