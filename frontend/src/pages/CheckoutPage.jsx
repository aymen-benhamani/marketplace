import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

// Carte bancaire interactive
function CreditCardPreview({ number, name, expiry, focused }) {
  const raw = (number || "").replace(/\s/g, "");
  const display = raw.padEnd(16, "·").replace(/(.{4})/g, "$1 ").trim();
  const isVisa = raw.startsWith("4");
  const isMaster = raw.startsWith("5");

  return (
    <div className="relative w-full h-44 rounded-2xl p-5 text-white overflow-hidden select-none"
      style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
      <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #fff, transparent)" }} />
      <div className="absolute -right-4 top-10 w-24 h-24 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #fff, transparent)" }} />

      <div className="absolute top-4 right-5">
        {isVisa && <div className="text-white font-black italic text-xl tracking-tight">VISA</div>}
        {isMaster && (
          <div className="flex">
            <div className="w-8 h-8 rounded-full bg-red-500 opacity-90" />
            <div className="w-8 h-8 rounded-full bg-yellow-400 opacity-90 -ml-4" />
          </div>
        )}
        {!isVisa && !isMaster && <div className="text-white/30 font-bold text-sm">CARD</div>}
      </div>

      <div className="w-10 h-7 rounded-md mt-1 mb-4" style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)" }} />
      <div className={`font-mono text-lg tracking-widest mb-3 transition-all ${focused === "number" ? "text-orange-300" : "text-white/90"}`}>{display}</div>

      <div className="flex justify-between items-end">
        <div>
          <div className="text-white/40 text-xs uppercase tracking-widest mb-0.5">Titulaire</div>
          <div className={`text-sm font-medium uppercase tracking-wide truncate max-w-[150px] transition-all ${focused === "name" ? "text-orange-300" : "text-white"}`}>
            {name || "VOTRE NOM"}
          </div>
        </div>
        <div className="text-right">
          <div className="text-white/40 text-xs uppercase tracking-widest mb-0.5">Expire</div>
          <div className={`text-sm font-medium font-mono transition-all ${focused === "expiry" ? "text-orange-300" : "text-white"}`}>{expiry || "MM/AA"}</div>
        </div>
      </div>
    </div>
  );
}

function CardForm({ onBack, onNext }) {
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [focused, setFocused] = useState("");
  const [errors, setErrors] = useState({});

  const formatNumber = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const validate = () => {
    const e = {};
    if (card.number.replace(/\s/g, "").length < 16) e.number = "Numéro de carte invalide";
    if (!card.name.trim()) e.name = "Nom du titulaire requis";
    if (card.expiry.length < 5) e.expiry = "Date invalide";
    if (card.cvc.length < 3) e.cvc = "CVC invalide";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const fieldClass = (key) =>
    `w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all
    ${focused === key ? "border-orange-400 ring-4 ring-orange-50" : "border-slate-200"}
    ${errors[key] ? "border-red-400" : ""}`;

  return (
    <div className="space-y-4">
      <CreditCardPreview {...card} focused={focused} />

      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Numéro de carte</label>
        <input value={card.number} placeholder="1234 5678 9012 3456" maxLength={19}
          onFocus={() => setFocused("number")} onBlur={() => setFocused("")}
          onChange={e => setCard({ ...card, number: formatNumber(e.target.value) })}
          className={fieldClass("number") + " font-mono"} />
        {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Nom du titulaire</label>
        <input value={card.name} placeholder="PRÉNOM NOM"
          onFocus={() => setFocused("name")} onBlur={() => setFocused("")}
          onChange={e => setCard({ ...card, name: e.target.value.toUpperCase() })}
          className={fieldClass("name") + " uppercase"} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Expiration</label>
          <input value={card.expiry} placeholder="MM/AA" maxLength={5}
            onFocus={() => setFocused("expiry")} onBlur={() => setFocused("")}
            onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
            className={fieldClass("expiry") + " font-mono"} />
          {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">CVC</label>
          <input value={card.cvc} placeholder="•••" maxLength={3} type="password"
            onFocus={() => setFocused("cvc")} onBlur={() => setFocused("")}
            onChange={e => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 3) })}
            className={fieldClass("cvc") + " font-mono"} />
          {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 rounded-xl px-3 py-2.5">
        <span>🔒</span>
        <span>Paiement sécurisé SSL · Powered by <span className="font-bold text-[#635BFF]">Stripe</span></span>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" size="lg" className="flex-1" onClick={onBack}>← Retour</Button>
        <Button size="lg" className="flex-1" onClick={() => validate() && onNext()}>Continuer →</Button>
      </div>
    </div>
  );
}

function PayPalForm({ onBack, onNext }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email.includes("@")) e.email = "Email invalide";
    if (password.length < 4) e.password = "Mot de passe requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConnect = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onNext(); }, 1500);
  };

  const fieldClass = (key) =>
    `w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all
    ${focused === key ? "border-[#009cde] ring-4 ring-blue-50" : "border-slate-200"}
    ${errors[key] ? "border-red-400" : ""}`;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-5 text-center" style={{ background: "linear-gradient(135deg, #003087, #009cde)" }}>
        <div className="text-3xl font-black mb-1">
          <span className="text-white">Pay</span><span className="text-[#ffdd00]">Pal</span>
        </div>
        <p className="text-white/70 text-xs">Connectez-vous à votre compte PayPal</p>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Email PayPal</label>
        <input value={email} type="email" placeholder="votre@email.com"
          onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
          onChange={e => setEmail(e.target.value)}
          className={fieldClass("email")} />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Mot de passe</label>
        <input value={password} type="password" placeholder="••••••••"
          onFocus={() => setFocused("password")} onBlur={() => setFocused("")}
          onChange={e => setPassword(e.target.value)}
          className={fieldClass("password")} />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      <button className="text-[#009cde] text-xs hover:underline text-left">Mot de passe oublié ?</button>

      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 rounded-xl px-3 py-2.5">
        <span>🔒</span>
        <span>Connexion sécurisée · Vos données sont protégées par PayPal</span>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" size="lg" className="flex-1" onClick={onBack}>← Retour</Button>
        <button onClick={handleConnect} disabled={loading}
          className="flex-1 py-3 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #003087, #009cde)" }}>
          {loading ? "Connexion en cours..." : "Se connecter →"}
        </button>
      </div>
    </div>
  );
}

export function CheckoutPage() {
  const { cart, productsTotal, deliveryTotal, clearCart } = useCart();
  const { authFetch } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const [payMethod, setPayMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  if (cart.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <p className="text-slate-500 mb-4">Votre panier est vide</p>
      <Button onClick={() => navigate("/")}>Retour à la boutique</Button>
    </div>
  );

  const handleOrder = async () => {
    setLoading(true);
    try {
      const items = cart.map(i => ({ product: i._id, name: i.name, price: i.price, deliveryPrice: i.deliveryPrice || 0, quantity: i.quantity }));
      await authFetch("/orders", { method: "POST", body: JSON.stringify({ items, shippingAddress: form }) });
      clearCart();
      addToast("Commande passée avec succès !", "success");
      navigate("/my-orders");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Livraison", "Paiement", "Confirmation"];
  const payMethods = [
    { id: "cod", label: "Livraison", icon: "💵" },
    { id: "stripe", label: "Carte", icon: null },
    { id: "paypal", label: "PayPal", icon: null },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-black text-slate-900 mb-8">Finaliser la commande</h1>

      <div className="flex items-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
              ${step > i + 1 ? "bg-emerald-500 text-white" : step === i + 1 ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400"}`}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span className={`text-sm font-medium ${step === i + 1 ? "text-orange-500" : "text-slate-400"}`}>{s}</span>
            {i < steps.length - 1 && <div className="w-10 h-px bg-slate-200" />}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">

          {step === 1 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
              <h2 className="font-bold text-slate-800">📦 Adresse de livraison</h2>
              <Input label="Nom complet" placeholder="Prénom Nom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Input label="Adresse" placeholder="Rue, Ville, Code Postal" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              <Input label="Téléphone" placeholder="+212 6XX XXX XXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <Button size="lg" className="w-full" onClick={() => setStep(2)} disabled={!form.name || !form.address || !form.phone}>Continuer →</Button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
              <h2 className="font-bold text-slate-800">💳 Mode de paiement</h2>

              {/* Sélecteur méthode */}
              <div className="grid grid-cols-3 gap-3">
                {payMethods.map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id)}
                    className={`p-3 rounded-xl border-2 text-center transition-all
                      ${payMethod === m.id ? "border-orange-400 bg-orange-50 shadow-sm" : "border-slate-200 hover:border-slate-300"}`}>
                    {m.id === "stripe" ? (
                      <div className="font-black text-sm text-[#635BFF] mb-1">stripe</div>
                    ) : m.id === "paypal" ? (
                      <div className="font-black text-sm mb-1">
                        <span className="text-[#003087]">Pay</span><span className="text-[#009cde]">Pal</span>
                      </div>
                    ) : (
                      <div className="text-xl mb-1">{m.icon}</div>
                    )}
                    <div className="text-xs font-medium text-slate-500">{m.label}</div>
                  </button>
                ))}
              </div>

              <div className="pt-1">
                {payMethod === "cod" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 items-start">
                      <span className="text-2xl">💵</span>
                      <div>
                        <p className="font-semibold text-sm text-amber-800">Paiement à la livraison</p>
                        <p className="text-xs text-amber-600 mt-0.5">Préparez le montant exact lors de la réception de votre commande.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="secondary" size="lg" className="flex-1" onClick={() => setStep(1)}>← Retour</Button>
                      <Button size="lg" className="flex-1" onClick={() => setStep(3)}>Continuer →</Button>
                    </div>
                  </div>
                )}
                {payMethod === "stripe" && <CardForm onBack={() => setStep(1)} onNext={() => setStep(3)} />}
                {payMethod === "paypal" && <PayPalForm onBack={() => setStep(1)} onNext={() => setStep(3)} />}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
              <h2 className="font-bold text-slate-800">✅ Confirmation</h2>
              <div className="p-4 bg-slate-50 rounded-xl space-y-1 text-sm">
                <p><span className="text-slate-400">Livraison à :</span> <span className="font-medium">{form.name}</span></p>
                <p><span className="text-slate-400">Adresse :</span> <span className="font-medium">{form.address}</span></p>
                <p><span className="text-slate-400">Téléphone :</span> <span className="font-medium">{form.phone}</span></p>
                <p><span className="text-slate-400">Paiement :</span> <span className="font-medium">{payMethod === "cod" ? "À la livraison" : payMethod === "stripe" ? "Carte bancaire" : "PayPal"}</span></p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" size="lg" className="flex-1" onClick={() => setStep(2)}>← Retour</Button>
                <Button size="lg" className="flex-1" onClick={handleOrder} disabled={loading}>{loading ? "Traitement..." : "🎉 Passer la commande"}</Button>
              </div>
            </div>
          )}
        </div>

        {/* Récapitulatif */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 h-fit">
          <h3 className="font-bold text-slate-800 mb-4">Récapitulatif</h3>
          <div className="space-y-3 max-h-52 overflow-y-auto mb-4">
            {cart.map(item => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="text-slate-600 truncate mr-2">{item.name} × {item.quantity}</span>
                <span className="font-medium text-slate-800 flex-shrink-0">{(item.price * item.quantity).toFixed(2)} MAD</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-500"><span>Sous-total</span><span>{productsTotal.toFixed(2)} MAD</span></div>
            <div className="flex justify-between text-slate-500"><span>Livraison</span><span>{deliveryTotal.toFixed(2)} MAD</span></div>
            <div className="flex justify-between font-black text-base text-slate-900 pt-2 border-t border-slate-100">
              <span>Total</span><span className="text-orange-500">{(productsTotal + deliveryTotal).toFixed(2)} MAD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}