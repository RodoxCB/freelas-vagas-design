"use client";

import Image from "next/image";
import { useState } from "react";

export function ImageUpload({
  label,
  name,
  previewUrl,
  error,
  optional,
}: {
  label: string;
  name: string;
  previewUrl?: string | null;
  error?: string;
  optional?: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(previewUrl ?? null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-700">
        {label}{optional ? "" : " *"}
      </label>
      <div className="flex items-center gap-4">
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            width={80}
            height={80}
            className="h-20 w-20 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 text-xs">
            Sem foto
          </div>
        )}
        <input
          type="file"
          name={name}
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700"
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function VagaImageUpload({
  previewUrl,
  error,
}: {
  previewUrl?: string | null;
  error?: string;
}) {
  const [preview, setPreview] = useState<string | null>(previewUrl ?? null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-700">
        Arte da vaga (opcional)
      </label>
      {preview && (
        <Image
          src={preview}
          alt="Preview da vaga"
          width={400}
          height={200}
          className="h-40 w-full rounded-lg object-cover"
          unoptimized
        />
      )}
      <input
        type="file"
        name="imagem"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
