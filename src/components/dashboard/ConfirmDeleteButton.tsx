"use client";

import { useState, useTransition } from "react";

type Props = {
  action: (formData: FormData) => Promise<void> | void;
  id: string;
  label?: string;
  confirmMessage: string;
  className?: string;
};

export default function ConfirmDeleteButton({
  action,
  id,
  label = "Eliminar",
  confirmMessage,
  className = "font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-muted hover:text-red-700",
}: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted">{confirmMessage}</span>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          const formData = new FormData();
          formData.set("id", id);
          startTransition(async () => {
            await action(formData);
            setOpen(false);
          });
        }}
        className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-red-700 disabled:opacity-50"
      >
        {pending ? "Eliminando…" : "Confirmar"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => setOpen(false)}
        className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink disabled:opacity-50"
      >
        Cancelar
      </button>
    </div>
  );
}
