"use client";

export type TabKey = "ranked" | "shortlist" | "limited";

const TABS: { key: TabKey; label: string }[] = [
  { key: "ranked", label: "Genel Liste" },
  { key: "shortlist", label: "Shortlist" },
  { key: "limited", label: "Sınırlı Veri (Genç Radar)" },
];

export default function Tabs({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}) {
  return (
    <div className="mb-4 flex gap-1 border-b border-slate-800">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-2 text-sm font-medium transition ${
            active === tab.key
              ? "border-b-2 border-emerald-400 text-emerald-400"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
