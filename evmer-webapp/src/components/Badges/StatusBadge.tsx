import type { ReactNode } from "react";

type StatusTone = "brand" | "emerald" | "amber" | "red" | "slate";

interface StatusBadgeProps {
  children: ReactNode;
  tone?: StatusTone;
}

const toneClasses: Record<StatusTone, string> = {
  brand: "bg-brand-50 text-brand-700 ring-brand-600/20",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  slate: "bg-slate-100 text-slate-700 ring-slate-500/20",
};

export const StatusBadge = ({ children, tone = "brand" }: StatusBadgeProps) => (
  <span
    className={
      "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset " +
      toneClasses[tone]
    }
  >
    {children}
  </span>
);

export const EquipmentStatusBadge = ({ status }: { status: string }) => {
  const normalizedStatus = status.toUpperCase();
  let tone: StatusTone = "brand";

  if (normalizedStatus === "SLOBODAN") tone = "emerald";
  if (["ZAUZET", "REZERVISAN"].includes(normalizedStatus)) tone = "amber";
  if (["NEISPRAVAN", "RASHODOVAN"].includes(normalizedStatus)) tone = "red";

  return <StatusBadge tone={tone}>{status}</StatusBadge>;
};

export const ReservationStatusBadge = ({ status }: { status: string }) => {
  const normalizedStatus = status.toUpperCase();
  let tone: StatusTone = "brand";

  if (normalizedStatus === "REALIZOVANA") tone = "emerald";
  if (["OTKAZANA", "ISTEKLA"].includes(normalizedStatus)) tone = "red";

  return <StatusBadge tone={tone}>{status}</StatusBadge>;
};

export const CalibrationStatusBadge = ({ status }: { status: string }) => {
  const normalizedStatus = status.toUpperCase();
  let tone: StatusTone = "brand";

  if (normalizedStatus === "VAZECA") tone = "emerald";
  if (normalizedStatus === "USKORO_ISTICE") tone = "amber";
  if (normalizedStatus === "ISTEKLA") tone = "red";
  if (["NIJE_POTREBNA", "PODACI_NISU_UNETI"].includes(normalizedStatus)) {
    tone = "slate";
  }

  return <StatusBadge tone={tone}>{status}</StatusBadge>;
};

export const FaultStatusBadge = ({ active }: { active: boolean }) => (
  <StatusBadge tone={active ? "amber" : "emerald"}>
    {active ? "Aktivan" : "Rešen"}
  </StatusBadge>
);
