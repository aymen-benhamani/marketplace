export function Select({ label, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <select {...props}
        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all"
      >{children}</select>
    </div>
  );
}