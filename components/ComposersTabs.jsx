"use client";

import { useEffect, useState } from "react";

const IDS = ["composers", "lyricists", "performers"];

// Καρτέλες Συνθέτες | Ποιητές | Ερμηνευτές. Και τα τρία panels αποδίδονται
// στο HTML (static export/SEO)· η επιλογή ζει στο URL (#tab ή ?tab=).
export default function ComposersTabs({ labels, ariaLabel, panels }) {
  const [tab, setTab] = useState("composers");

  useEffect(() => {
    const read = () => {
      let v = window.location.hash.replace(/^#/, "");
      if (!IDS.includes(v)) v = new URLSearchParams(window.location.search).get("tab");
      setTab(IDS.includes(v) ? v : "composers");
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const select = (id) => {
    setTab(id);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("tab");
      url.hash = id === "composers" ? "" : id;
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    } catch {}
  };

  return (
    <div>
      <div role="tablist" aria-label={ariaLabel} className="flex flex-wrap gap-2 border-b border-ink/15 mb-10">
        {IDS.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            onClick={() => select(id)}
            className={`px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] border-b-2 -mb-px transition-colors ${
              tab === id ? "border-brand text-brand" : "border-transparent text-ink/50 hover:text-ink"
            }`}
          >
            {labels[id]}
          </button>
        ))}
      </div>
      {IDS.map((id) => (
        <div key={id} role="tabpanel" id={`panel-${id}`} aria-labelledby={`tab-${id}`} hidden={tab !== id}>
          {panels[id]}
        </div>
      ))}
    </div>
  );
}
