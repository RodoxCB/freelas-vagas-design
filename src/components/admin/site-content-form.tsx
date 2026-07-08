"use client";

import { useActionState } from "react";
import {
  updateSiteContentAction,
  type SiteContentFormState,
} from "@/actions/admin";
import { Button, Input, Textarea } from "@/components/ui";
import {
  SITE_CONTENT_GROUPS,
  SITE_CONTENT_LABELS,
  type SiteContentMap,
} from "@/lib/site-content/defaults";

export function SiteContentForm({ content }: { content: SiteContentMap }) {
  const [state, action, pending] = useActionState<SiteContentFormState, FormData>(
    updateSiteContentAction,
    {}
  );

  return (
    <form action={action} className="space-y-10">
      {state.success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Conteúdo salvo. As alterações já aparecem no site.
        </div>
      )}
      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {SITE_CONTENT_GROUPS.map((group) => (
        <section key={group.id} className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-zinc-900">{group.label}</h2>
          <div className="mt-6 space-y-4">
            {group.keys.map((key) => {
              const label = SITE_CONTENT_LABELS[key] ?? key;
              const value = content[key] ?? "";
              const isLong =
                key.includes(".text") ||
                key.includes(".body") ||
                key.includes(".lead") ||
                key.includes(".note") ||
                key.includes(".subtitle") ||
                key === "site.description";

              if (isLong) {
                return (
                  <Textarea
                    key={key}
                    label={label}
                    name={key}
                    rows={3}
                    defaultValue={value}
                  />
                );
              }

              return (
                <Input
                  key={key}
                  label={label}
                  name={key}
                  defaultValue={value}
                />
              );
            })}
          </div>
        </section>
      ))}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Salvar alterações"}
      </Button>
    </form>
  );
}
