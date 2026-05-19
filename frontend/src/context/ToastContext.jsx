import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id}
            className={`px-4 py-3 rounded-xl text-white text-sm font-medium shadow-2xl flex items-center gap-2 transition-all duration-300
              ${t.type === "success" ? "bg-emerald-500" : t.type === "error" ? "bg-rose-500" : "bg-slate-700"}`}
          >
            <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "●"}</span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}