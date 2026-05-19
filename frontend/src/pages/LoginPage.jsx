import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { authFetch, login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authFetch("/auth/login", { method: "POST", body: JSON.stringify(form) });
      login({ _id: data._id, name: data.name, email: data.email, role: data.role, sellerStatus: data.sellerStatus }, data.token);
      addToast(`Bienvenue, ${data.name} !`, "success");
      navigate("/");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-4">M</div>
          <h1 className="text-2xl font-black text-slate-900">Bon retour !</h1>
          <p className="text-slate-500 text-sm mt-1">Connectez-vous à votre compte</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl shadow-slate-100 p-8 space-y-4 border border-slate-100">
          <Input label="Email" type="email" placeholder="votre@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <Input label="Mot de passe" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? "Connexion..." : "Se connecter →"}</Button>
          <p className="text-center text-sm text-slate-500">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-orange-500 font-medium hover:underline">S'inscrire</Link>
          </p>
        </form>
      </div>
    </div>
  );
}