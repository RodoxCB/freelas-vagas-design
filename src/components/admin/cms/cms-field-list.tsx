"use client";

import { Badge, Input, Textarea } from "@/components/ui";
import {
  SITE_CONTENT_DEFAULTS,
  SITE_CONTENT_FIELD_META,
  SITE_CONTENT_LABELS,
  type SiteContentFieldType,
} from "@/lib/site-content/defaults";
import { normalizeHexColor } from "@/lib/site-content/theme";

function ColorField({
  label,
  name,
  value,
  onChange,
  isCustomized,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  isCustomized: boolean;
}) {
  const normalized = normalizeHexColor(value) ?? value;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <label className="block text-sm font-medium text-zinc-700">{label}</label>
        {isCustomized && <Badge color="indigo">Customizado</Badge>}
      </div>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={normalized.startsWith("#") ? normalized : "#4f46e5"}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded border border-zinc-200 bg-white"
          aria-label={`${label} — seletor de cor`}
        />
        <Input
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#4f46e5"
          className="font-mono"
        />
      </div>
    </div>
  );
}

function FieldEditor({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const label = SITE_CONTENT_LABELS[fieldKey] ?? fieldKey;
  const type: SiteContentFieldType =
    SITE_CONTENT_FIELD_META[fieldKey]?.type ?? "text";
  const isCustomized = value !== (SITE_CONTENT_DEFAULTS[fieldKey] ?? "");

  if (type === "color") {
    return (
      <ColorField
        label={label}
        name={fieldKey}
        value={value}
        onChange={onChange}
        isCustomized={isCustomized}
      />
    );
  }

  const fieldHeader = (
    <div className="mb-1.5 flex items-center gap-2">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      {isCustomized && <Badge color="indigo">Customizado</Badge>}
    </div>
  );

  if (type === "textarea") {
    return (
      <div>
        {fieldHeader}
        <Textarea
          name={fieldKey}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  return (
    <div>
      {fieldHeader}
      <Input
        name={fieldKey}
        type={type === "url" ? "url" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function CmsFieldList({
  keys,
  draft,
  onFieldChange,
}: {
  keys: readonly string[];
  draft: Record<string, string>;
  onFieldChange: (key: string, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      {keys.map((key) => (
        <FieldEditor
          key={key}
          fieldKey={key}
          value={draft[key] ?? ""}
          onChange={(value) => onFieldChange(key, value)}
        />
      ))}
    </div>
  );
}
