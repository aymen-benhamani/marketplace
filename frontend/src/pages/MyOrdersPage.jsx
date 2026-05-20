import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Spinner } from "../components/ui/Spinner";

const STATUS_LABELS = {
  pending:   "en attente",
  confirmed: "confirmée ✓",
  shipped:   "expédiée 🚚",
  delivered: "livrée ✅",
  cancelled: "annulée ✕",
};

export function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const { authFetch } = useAuth();
  const { addToast } = useToast();

  // On garde les anciens statuts en mémoire pour détecter les changements
  const prevStatuses = useRef({});

  const loadOrders = async (showNotif = false) => {
    try {
      const data = await authFetch("/orders/my");

      if (showNotif) {
        // Compare les statuts avec les anciens
        data.forEach(order => {
          const oldStatus = prevStatuses.current[order._id];
          if (oldStatus && oldStatus !== order.status) {
            addToast(
              `Commande #${order._id.slice(-6).toUpperCase()} est maintenant ${STATUS_LABELS[order.status] || order.status}`,
              order.status === "cancelled" ? "error" : "success"
            );
          }
        });
      }

      // Met à jour la mémoire des statuts
      const newStatuses = {};
      data.forEach(order => { newStatuses[order._id] = order.status; });
      prevStatuses.current = newStatuses;

      setOrders(data);
    } catch {
      addToast("Erreur chargement commandes", "error");
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    loadOrders(false);
  }, []);

  // Polling toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => loadOrders(true), 30000);
    return () => clearInterval(interval); // nettoyage quand on quitte la page
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-slate-900">📦 Mes Commandes</h1>
        <button
          onClick={() => loadOrders(true)}
          className="text-xs text-slate-400 hover:text-orange-500 transition-colors flex items-center gap-1"
        >
          🔄 Actualiser
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-6xl mb-4">📭</div>
          <p className="font-medium">Aucune commande pour l'instant</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl border border-slate-100 hover:border-orange-200 transition-colors overflow-hidden">
              <div className="flex items-center justify-between p-5 cursor-pointer" onClick={() => setSelected(selected === order._id ? null : order._id)}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-xl">📦</div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Commande #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <span className="font-black text-orange-500">{order.total.toFixed(2)} MAD</span>
                  <span className="text-slate-300 text-lg">{selected === order._id ? "▲" : "▼"}</span>
                </div>
              </div>

              {selected === order._id && (
                <div className="border-t border-slate-100 p-5 bg-slate-50 space-y-3">
                  <h3 className="text-sm font-semibold text-slate-700">Produits commandés</h3>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-white rounded-lg overflow-hidden">
                        {item.product?.image
                          ? <img src={`https://marketplace-aymen-benhamanis-projects.vercel.app${item.product.image}`} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-xs">🛍️</div>}
                      </div>
                      <span className="text-slate-700 flex-1">{item.name} × {item.quantity}</span>
                      <span className="font-medium">{(item.price * item.quantity).toFixed(2)} MAD</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-200 text-sm text-slate-500">
                    <p>📍 {order.shippingAddress?.address} — {order.shippingAddress?.phone}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}