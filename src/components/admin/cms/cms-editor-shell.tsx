"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import {
  updateSiteContentSectionAction,
  type SiteContentFormState,
} from "@/actions/admin";
import { Button } from "@/components/ui";
import {
  SITE_CONTENT_DEFAULTS,
  SITE_CONTENT_GROUPS,
  type SiteContentMap,
} from "@/lib/site-content/defaults";
import { CmsFieldList } from "./cms-field-list";
import { CmsSectionPreview } from "./cms-section-preview";

function buildDraft(content: SiteContentMap): Record<string, string> {
  const draft: Record<string, string> = { ...SITE_CONTENT_DEFAULTS, ...content };
  return draft;
}

function sectionHasChanges(
  sectionId: string,
  draft: Record<string, string>,
  saved: SiteContentMap
): boolean {
  const group = SITE_CONTENT_GROUPS.find((g) => g.id === sectionId);
  if (!group) return false;
  return group.keys.some(
    (key) => (draft[key] ?? "") !== (saved[key] ?? SITE_CONTENT_DEFAULTS[key] ?? "")
  );
}

export function CmsEditorShell({ content }: { content: SiteContentMap }) {
  const [activeSection, setActiveSection] = useState<string>(SITE_CONTENT_GROUPS[0].id);
  const [saved, setSaved] = useState(content);
  const [draft, setDraft] = useState(() => buildDraft(content));
  const [message, setMessage] = useState<SiteContentFormState>({});
  const [pending, startTransition] = useTransition();

  const activeGroup = SITE_CONTENT_GROUPS.find((g) => g.id === activeSection)!;
  const hasUnsavedChanges = sectionHasChanges(activeSection, draft, saved);

  const previewContent = useMemo(() => ({ ...draft }), [draft]);

  const handleFieldChange = useCallback((key: string, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setMessage({});
  }, []);

  function handleTabChange(sectionId: string) {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        "Esta seção tem alterações não salvas. Deseja trocar de aba mesmo assim?"
      );
      if (!confirmLeave) return;
    }
    setActiveSection(sectionId);
    setMessage({});
  }

  function handleSave() {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("section_id", activeSection);
      for (const key of activeGroup.keys) {
        formData.set(key, draft[key] ?? "");
      }

      const result = await updateSiteContentSectionAction({}, formData);
      setMessage(result);

      if (result.success) {
        const nextSaved = { ...saved };
        for (const key of activeGroup.keys) {
          const val = (draft[key] ?? "").trim();
          const defaultVal = SITE_CONTENT_DEFAULTS[key] ?? "";
          if (val === defaultVal) {
            delete nextSaved[key];
          } else {
            nextSaved[key] = val;
          }
        }
        setSaved(nextSaved);
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
        {SITE_CONTENT_GROUPS.map((group) => {
          const dirty = sectionHasChanges(group.id, draft, saved);
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => handleTabChange(group.id)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                activeSection === group.id
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {group.label}
              {dirty ? " •" : ""}
            </button>
          );
        })}
      </div>

      {message.success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Seção salva. As alterações já aparecem no site.
        </div>
      )}
      {message.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {message.error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-zinc-900">{activeGroup.label}</h2>
            {hasUnsavedChanges && (
              <span className="text-xs text-amber-700">Alterações não salvas</span>
            )}
          </div>
          <CmsFieldList
            keys={activeGroup.keys}
            draft={draft}
            onFieldChange={handleFieldChange}
          />
          <div className="mt-6">
            <Button type="button" onClick={handleSave} disabled={pending}>
              {pending ? "Salvando..." : `Salvar ${activeGroup.label.toLowerCase()}`}
            </Button>
          </div>
        </section>

        <section>
          <p className="mb-3 text-sm font-medium text-zinc-700">Pré-visualização</p>
          <CmsSectionPreview sectionId={activeSection} content={previewContent} />
        </section>
      </div>
    </div>
  );
}
