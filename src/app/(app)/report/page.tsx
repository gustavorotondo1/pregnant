"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReportPage() {
  const reportRef = useRef<HTMLDivElement | null>(null);

  const exportPdf = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = 190;
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, width, height);
    pdf.save("relatorio-gestacao.pdf");
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-lora)" }}>
          Relatorio para consulta
        </h1>
        <p className="text-sm text-[var(--text-2)]">Gere PDF resumido para compartilhar com seu medico.</p>
      </header>

      <Card>
        <Button onClick={exportPdf}>Exportar PDF</Button>
      </Card>

      <Card>
        <div ref={reportRef} className="space-y-2 text-sm text-[var(--text-2)]">
          <p><strong>Resumo de saude:</strong> pressao e glicemia estaveis.</p>
          <p><strong>Evolucao de peso:</strong> dentro da faixa esperada.</p>
          <p><strong>Sinais relevantes:</strong> sem alertas no periodo.</p>
          <p><strong>Consultas:</strong> comparecimento regular.</p>
        </div>
      </Card>
    </div>
  );
}
