"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DocumentsPage() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-lora)" }}>
          Exames e documentos
        </h1>
        <p className="text-sm text-[var(--text-2)]">
          Upload de ultrassons, exames laboratoriais e fotos da barriga com organizacao por trimestre.
        </p>
      </header>

      <Card>
        <h2 className="mb-3 text-base font-semibold">Upload de arquivos</h2>
        <input
          type="file"
          multiple
          onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
          className="mb-3 block w-full rounded-xl border border-[var(--border-1)] px-3 py-2"
        />
        <Button type="button">Enviar para storage</Button>
      </Card>

      <Card>
        <h2 className="mb-3 text-base font-semibold">Galeria local</h2>
        <ul className="space-y-2 text-sm text-[var(--text-2)]">
          {files.length === 0 ? <li>Nenhum arquivo selecionado.</li> : files.map((file) => <li key={file.name}>{file.name}</li>)}
        </ul>
      </Card>
    </div>
  );
}
