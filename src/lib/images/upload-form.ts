export type PhotoFormResult =
  | { file: File }
  | { file: null; selected: boolean };

export function getPhotoFromFormData(formData: FormData): PhotoFormResult {
  const selected = formData.get("foto_selected") === "1";
  const entry = formData.get("foto");

  if (entry instanceof File && entry.size > 0) {
    return { file: entry };
  }

  return { file: null, selected };
}

export function photoUploadFieldError(selected: boolean): string | null {
  if (!selected) return null;
  return "A foto não foi enviada. Use JPEG, PNG ou WebP com até 5 MB.";
}
