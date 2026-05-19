import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    if (!user) addToast("Connectez-vous pour accéder à cette page", "error");
    else if (roles && !roles.includes(user.role)) addToast("Accès non autorisé", "error");
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}