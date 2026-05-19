export function Input({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <input
        {...props}
        className={`w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all
          ${error ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white hover:border-slate-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-50"}
          ${props.className || ""}`}
      />
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}