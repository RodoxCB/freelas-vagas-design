export type PhotoFormResult =
  | { file: Blob; fileName: string; mimeType: string }
  | { file: null; selected: boolean };

function getUploadEntry(
  entry: FormDataEntryValue | null
): { blob: Blob; fileName: string; mimeType: string } | null {
  if (entry === null || typeof entry !== "object") return null;
  if (!("size" in entry) || !("arrayBuffer" in entry)) return null;

  const blob = entry as Blob;
  if (blob.size <= 0) return null;

  const fileName = entry instanceof File ? entry.name : "upload";
  const mimeType = blob.type || "application/octet-stream";

  return { blob, fileName, mimeType };
}

export function getPhotoFromFormData(formData: FormData): PhotoFormResult {
  const selected = formData.get("foto_selected") === "1";
  const entry = getUploadEntry(formData.get("foto"));

  if (entry) {
    return { file: entry.blob, fileName: entry.fileName, mimeType: entry.mimeType };
  }

  return { file: null, selected };
}

export function photoUploadFieldError(selected: boolean): string | null {
  if (!selected) return null;
  return "A foto não foi enviada. Use JPEG, PNG ou WebP com até 5 MB.";
}
