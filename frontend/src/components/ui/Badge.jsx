export function Badge({ children, color = "orange" }) {
  const colors = {
    orange: "bg-orange-100 text-orange-700",
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-rose-100 text-rose-700",
    blue: "bg-blue-100 text-blue-700",
    slate: "bg-slate-100 text-slate-600",
    amber: "bg-amber-100 text-amber-700",
  };
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color]}`}>{children}</span>;
}