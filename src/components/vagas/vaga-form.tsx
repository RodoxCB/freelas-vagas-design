"use client";

import { useActionState } from "react";
import { createVagaAction, type VagaFormState } from "@/actions/vagas";
import { Button, Checkbox, Input, Select, Textarea } from "@/components/ui";
import { VagaImageUpload } from "@/components/ui/image-upload";
import { PhoneInput } from "@/components/ui/phone-input";
import { TIPOS_VAGA } from "@/lib/constants";

const TIPO_LABELS: Record<string, string> = {
  freela: "Freela",
  estagio: "Estágio",
  clt: "CLT",
};

export function VagaForm() {
  const [state, action, pending] = useActionState<VagaFormState, FormData>(
    createVagaAction,
    { success: false }
  );

  const values = state.values ?? {};
  const errors = state.fieldErrors ?? {};

  if (state.success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <h2 className="text-lg font-semibold text-emerald-900">Vaga publicada!</h2>
        <p className="mt-2 text-sm text-emerald-700">
          Sua vaga ficará visível por 45 dias. Você será responsável por
          receber e responder os candidatos pelos canais informados.
        </p>
        {state.id && (
          <Button href={`/vagas/${state.id}`} className="mt-4">
            Ver vaga
          </Button>
        )}
      </div>
    );
  }

  return (
    <form action={action} className="space-y-6" encType="multipart/form-data">
      {errors._form && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors._form}
        </div>
      )}

      <VagaImageUpload error={errors.imagem} />

      <Input
        label="Título *"
        name="titulo"
        required
        defaultValue={values.titulo ?? ""}
        error={errors.titulo}
        placeholder="Designer UX/UI para startup"
      />

      <Select
        label="Tipo *"
        name="tipo"
        required
        defaultValue={values.tipo ?? ""}
        error={errors.tipo}
      >
        <option value="" disabled>Selecione</option>
        {TIPOS_VAGA.map((tipo) => (
          <option key={tipo} value={tipo}>{TIPO_LABELS[tipo]}</option>
        ))}
      </Select>

      <Textarea
        label="Descrição *"
        name="descricao"
        required
        rows={5}
        defaultValue={values.descricao ?? ""}
        error={errors.descricao}
        placeholder="Descreva a vaga e o que você espera"
      />

      <Textarea
        label="Requisitos"
        name="requisitos"
        rows={4}
        defaultValue={values.requisitos ?? ""}
        placeholder="Experiência, ferramentas..."
      />

      <Input
        label="Email de contato *"
        name="contato_email"
        type="email"
        required
        defaultValue={values.contato_email ?? ""}
        error={errors.contato_email}
        placeholder="contato@empresa.com"
      />

      <PhoneInput
        label="Telefone de contato *"
        name="contato_telefone"
        required
        defaultValue={values.contato_telefone ?? ""}
        error={errors.contato_telefone}
      />

      <p className="text-sm text-zinc-500">
        Você será responsável por receber e responder os candidatos pelos canais informados.
      </p>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Essa vaga ficará visível por 45 dias.
      </div>

      <Checkbox
        name="consentimento_publicacao"
        required
        error={errors.consentimento_publicacao}
        label="Autorizo a exibição pública do email e telefone de contato desta vaga"
      />

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Publicando..." : "Publicar vaga"}
      </Button>
    </form>
  );
}
