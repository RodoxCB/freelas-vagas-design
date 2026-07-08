"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export function PixCopyButton({ pixKey }: { pixKey: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Button type="button" onClick={handleCopy} className="w-full sm:w-auto">
      {copied ? "Chave copiada!" : "Copiar chave Pix"}
    </Button>
  );
}
