import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Button } from "./ui/Button";

export function CartDrawer({ open, onClose }) {
  const { cart, removeFromCart, updateQty, productsTotal, deliveryTotal, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">🛒 Mon Panier <span className="text-orange-500">({cart.length})</span></h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
            <div className="text-6xl">🛍️</div>
            <p className="font-medium">Votre panier est vide</p>
            <Button variant="ghost" size="sm" onClick={onClose}>Continuer les achats</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {cart.map(item => (
                <div key={item._id} className="flex gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-14 h-14 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0">
                    {item.image ? <img src={`http://localhost:5000${item.image}`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🛍️</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-sm text-orange-500 font-bold">{item.price} MAD</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button onClick={() => updateQty(item._id, item.quantity - 1)} className="w-6 h-6 rounded-full bg-white border border-slate-200 text-xs hover:border-orange-400 transition-colors">-</button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item._id, item.quantity + 1)} className="w-6 h-6 rounded-full bg-white border border-slate-200 text-xs hover:border-orange-400 transition-colors">+</button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} className="text-slate-300 hover:text-rose-400 text-xl transition-colors">✕</button>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-slate-100 space-y-3">
              <div className="flex justify-between text-sm text-slate-600"><span>Sous-total</span><span className="font-medium">{productsTotal.toFixed(2)} MAD</span></div>
              <div className="flex justify-between text-sm text-slate-600"><span>Livraison</span><span className="font-medium">{deliveryTotal.toFixed(2)} MAD</span></div>
              <div className="flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-100">
                <span>Total</span><span className="text-orange-500">{(productsTotal + deliveryTotal).toFixed(2)} MAD</span>
              </div>
              <Button className="w-full" size="lg" onClick={() => { onClose(); navigate("/checkout"); }}>Commander →</Button>
              <Button variant="ghost" size="sm" className="w-full" onClick={clearCart}>Vider le panier</Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}