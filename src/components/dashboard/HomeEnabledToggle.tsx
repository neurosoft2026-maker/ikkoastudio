"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setHomeEnabled } from "@/app/dashboard/site-actions";

type Props = {
  initialEnabled: boolean;
};

export default function HomeEnabledToggle({ initialEnabled }: Props) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initialEnabled);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onToggle() {
    const next = !enabled;
    setEnabled(next);
    setError(null);

    startTransition(async () => {
      const result = await setHomeEnabled(next);
      if (result?.error) {
        setEnabled(!next);
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-3">
        <span className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-muted">
          Inicio {enabled ? "activo" : "inactivo"}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Activar o desactivar la página de inicio"
          disabled={pending}
          onClick={onToggle}
          className={`relative h-6 w-11 rounded-full transition-colors disabled:opacity-50 ${
            enabled ? "bg-ink" : "bg-ink/25"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
              enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
      {error && <p className="max-w-[14rem] text-right text-[10px] text-red-600">{error}</p>}
    </div>
  );
}
