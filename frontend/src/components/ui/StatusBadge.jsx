import { Badge } from "./Badge";

export function StatusBadge({ status }) {
  const map = {
    pending: { color: "amber", label: "En attente" },
    confirmed: { color: "blue", label: "Confirmé" },
    shipped: { color: "orange", label: "Expédié" },
    delivered: { color: "green", label: "Livré" },
    cancelled: { color: "red", label: "Annulé" },
    approved: { color: "green", label: "Approuvé" },
    rejected: { color: "red", label: "Rejeté" },
  };
  const s = map[status] || { color: "slate", label: status };
  return <Badge color={s.color}>{s.label}</Badge>;
}