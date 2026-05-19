export function Button({ children, onClick, variant = "primary", size = "md", disabled, className = "", type = "button" }) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 active:translate-y-0",
    secondary: "bg-white border-2 border-slate-200 text-slate-700 hover:border-orange-400 hover:text-orange-500",
    danger: "bg-rose-500 hover:bg-rose-600 text-white",
    ghost: "text-slate-600 hover:text-orange-500 hover:bg-orange-50",
    dark: "bg-slate-900 hover:bg-slate-800 text-white",
  };
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-base" };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
}