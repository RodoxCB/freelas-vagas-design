"use client";

import { useActionState } from "react";
import {
  createDesignerAction,
  updateDesignerAction,
  type DesignerFormState,
} from "@/actions/designers";
import { Button, Checkbox, Input, Select, Textarea } from "@/components/ui";
import { EspecialidadesSelect } from "@/components/ui/multi-select";
import { ImageUpload } from "@/components/ui/image-upload";
import { PhoneInput } from "@/components/ui/phone-input";
import { TagSelector } from "@/components/ui/tag-selector";
import { MAX_PORTFOLIO_LINKS, NIVEIS } from "@/lib/constants";
import type { Designer } from "@/types/database";

type FormValues = {
  nome?: string;
  especialidades?: string[];
  nivel?: string;
  portfolio_urls?: string[];
  whatsapp?: string;
  linkedin_url?: string;
  bio?: string;
  tags?: string[];
  localizacao?: string;
};

export function DesignerForm({
  designer,
  availableTags,
  mode = "create",
}: {
  designer?: Designer;
  availableTags: string[];
  mode?: "create" | "edit";
}) {
  const action = mode === "edit" ? updateDesignerAction : createDesignerAction;
  const [state, formAction, pending] = useActionState<DesignerFormState, FormData>(
    action,
    { success: false }
  );

  const values = (state.values ?? {}) as FormValues;
  const errors = state.fieldErrors ?? {};

  if (state.success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <h2 className="text-lg font-semibold text-emerald-900">
          {mode === "edit" ? "Perfil atualizado!" : "Perfil criado com sucesso!"}
        </h2>
        <p className="mt-2 text-sm text-emerald-700">
          {state.hidden
            ? "Seu perfil foi salvo, mas está oculto porque falta link de portfólio válido."
            : "Seu perfil já está visível na busca."}
        </p>
        {state.id && !state.hidden && (
          <Button href={`/designers/${state.id}`} className="mt-4">
            Ver perfil
          </Button>
        )}
      </div>
    );
  }

  const portfolioUrls = values.portfolio_urls ??
    designer?.portfolio_urls ?? [""];
  while (portfolioUrls.length < 1) portfolioUrls.push("");

  return (
    <form action={formAction} className="space-y-6" encType="multipart/form-data">
      {mode === "edit" && designer && (
        <input type="hidden" name="designer_id" value={designer.id} />
      )}

      {errors._form && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors._form}
        </div>
      )}

      <ImageUpload
        label="Foto de perfil"
        name="foto"
        previewUrl={designer?.foto_url}
        nome={designer?.nome ?? values.nome}
        error={errors.foto}
        optional
      />

      <Input
        label="Nome *"
        name="nome"
        required
        defaultValue={values.nome ?? designer?.nome ?? ""}
        error={errors.nome}
        placeholder="Seu nome"
      />

      <EspecialidadesSelect
        defaultSelected={values.especialidades ?? designer?.especialidades ?? []}
        error={errors.especialidades}
      />

      <Select
        label="Nível *"
        name="nivel"
        required
        defaultValue={values.nivel ?? designer?.nivel ?? ""}
        error={errors.nivel}
      >
        <option value="" disabled>Selecione</option>
        {NIVEIS.map((nivel) => (
          <option key={nivel} value={nivel}>{nivel}</option>
        ))}
      </Select>

      <div className="space-y-3">
        <p className="text-sm font-medium text-zinc-700">
          Links de portfólio * (até {MAX_PORTFOLIO_LINKS})
        </p>
        {Array.from({ length: MAX_PORTFOLIO_LINKS }).map((_, i) => (
          <Input
            key={i}
            name={`portfolio_url_${i + 1}`}
            type="url"
            defaultValue={portfolioUrls[i] ?? ""}
            placeholder={`https://portfólio-${i + 1}.com`}
            error={i === 0 ? errors.portfolio_urls : undefined}
          />
        ))}
      </div>

      <Input
        label="LinkedIn"
        name="linkedin_url"
        type="url"
        defaultValue={values.linkedin_url ?? designer?.linkedin_url ?? ""}
        error={errors.linkedin_url}
        placeholder="https://linkedin.com/in/..."
      />

      <PhoneInput
        label="WhatsApp *"
        name="whatsapp"
        required
        defaultValue={values.whatsapp ?? designer?.whatsapp ?? ""}
        error={errors.whatsapp}
      />

      <Textarea
        label="Bio"
        name="bio"
        rows={3}
        defaultValue={values.bio ?? designer?.bio ?? ""}
        error={errors.bio}
        placeholder="Conte um pouco sobre você"
      />

      <TagSelector
        availableTags={availableTags}
        defaultSelected={
          values.tags ?? designer?.tags?.map((t) => t.nome) ?? []
        }
      />

      <Input
        label="Localização"
        name="localizacao"
        defaultValue={values.localizacao ?? designer?.localizacao ?? ""}
        placeholder="São Paulo, SP"
      />

      {(!designer?.consentimento_publicacao_at || mode === "create") && (
        <Checkbox
          name="consentimento_publicacao"
          required
          error={errors.consentimento_publicacao}
          label="Autorizo a exibição pública dos meus dados de contato e perfil na plataforma"
        />
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Salvando..." : mode === "edit" ? "Salvar alterações" : "Criar perfil"}
      </Button>
    </form>
  );
}
