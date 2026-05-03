"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CheckItem {
  id: string;
  label: string;
  checked: boolean;
  note?: string;
}

const initialChecklist: CheckItem[] = [
  // Tipo de parto
  { id: "vaginal", label: "Prefiro parto vaginal (normal)", checked: false },
  { id: "cesarean", label: "Prefiro cesárea", checked: false },
  { id: "cesarean_medical", label: "Aceito cesárea somente por indicação médica", checked: true },
  // Anestesia
  { id: "epidural", label: "Desejo anestesia peridural", checked: false },
  { id: "no_epidural", label: "Prefiro não usar anestesia", checked: false },
  { id: "epidural_option", label: "Quero a opção de anestesia disponível", checked: true },
  // Acompanhante
  { id: "partner", label: "Desejo acompanhante no parto", checked: true },
  { id: "doula", label: "Desejo doula presente", checked: false },
  { id: "photos", label: "Acompanhante pode fotografar/filmar", checked: true },
  // Movimentação e posição
  { id: "move_freely", label: "Quero me movimentar livremente durante o trabalho de parto", checked: true },
  { id: "water_birth", label: "Interesse em parto na água / banheira de relaxamento", checked: false },
  { id: "birthing_ball", label: "Uso de bola de parto", checked: true },
  // Recém-nascido
  { id: "skin_skin", label: "Contato pele a pele imediato após o nascimento", checked: true },
  { id: "delayed_cord", label: "Clampeamento tardio do cordão umbilical", checked: true },
  { id: "breastfeed_first", label: "Amamentação na primeira hora de vida", checked: true },
  { id: "no_formula", label: "Não oferecer fórmula sem minha autorização", checked: true },
  { id: "baby_with_me", label: "Bebê permanece comigo o tempo todo (alojamento conjunto)", checked: true },
  // Intervenções
  { id: "no_episiotomy", label: "Evitar episiotomia (corte)", checked: true },
  { id: "no_enema", label: "Não desejo enema (lavagem intestinal)", checked: false },
  { id: "no_shaving", label: "Não desejo tricotomia (raspagem)", checked: false },
  { id: "minimal_interventions", label: "Minimizar intervenções desnecessárias", checked: true },
];

export default function BirthPlanPage() {
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [hospital, setHospital] = useState("");
  const [doctor, setDoctor] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [checklist, setChecklist] = useState<CheckItem[]>(initialChecklist);
  const [exporting, setExporting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const toggle = (id: string) =>
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));

  const exportPdf = async () => {
    if (!printRef.current) return;
    setExporting(true);
    await new Promise((r) => setTimeout(r, 100));
    const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 190;
    const pageHeight = (canvas.height * pageWidth) / canvas.width;
    const a4Height = 277;
    if (pageHeight <= a4Height) {
      pdf.addImage(imgData, "PNG", 10, 10, pageWidth, pageHeight);
    } else {
      // Multi-page
      let yOffset = 0;
      const scale = canvas.width / pageWidth;
      while (yOffset < canvas.height) {
        const sliceHeight = Math.min(a4Height * scale, canvas.height - yOffset);
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceHeight;
        const ctx = sliceCanvas.getContext("2d");
        ctx?.drawImage(canvas, 0, -yOffset);
        const sliceData = sliceCanvas.toDataURL("image/png");
        if (yOffset > 0) pdf.addPage();
        pdf.addImage(sliceData, "PNG", 10, 10, pageWidth, (sliceHeight / scale));
        yOffset += sliceHeight;
      }
    }
    pdf.save("plano-de-parto.pdf");
    setExporting(false);
  };

  const selected = checklist.filter((c) => c.checked);
  const categories = [
    { title: "Tipo de parto", ids: ["vaginal", "cesarean", "cesarean_medical"] },
    { title: "Anestesia", ids: ["epidural", "no_epidural", "epidural_option"] },
    { title: "Acompanhante", ids: ["partner", "doula", "photos"] },
    { title: "Movimentação e posição", ids: ["move_freely", "water_birth", "birthing_ball"] },
    { title: "Recém-nascido", ids: ["skin_skin", "delayed_cord", "breastfeed_first", "no_formula", "baby_with_me"] },
    { title: "Intervenções", ids: ["no_episiotomy", "no_enema", "no_shaving", "minimal_interventions"] },
  ];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-lora)" }}>
          Plano de parto
        </h1>
        <p className="text-sm text-[var(--text-2)]">
          Registre suas preferências e exporte em PDF para levar ao hospital.
        </p>
      </header>

      {/* Dados do cabeçalho */}
      <Card>
        <h2 className="mb-3 text-base font-semibold">Informações gerais</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            Nome da gestante
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome completo" />
          </label>
          <label className="grid gap-1 text-sm">
            Data provável do parto
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            Hospital / Maternidade
            <Input value={hospital} onChange={(e) => setHospital(e.target.value)} placeholder="Nome da maternidade" />
          </label>
          <label className="grid gap-1 text-sm">
            Médico(a) responsável
            <Input value={doctor} onChange={(e) => setDoctor(e.target.value)} placeholder="Nome do médico" />
          </label>
        </div>
      </Card>

      {/* Checklist por categoria */}
      <Card>
        <h2 className="mb-4 text-base font-semibold">Preferências</h2>
        <div className="space-y-5">
          {categories.map((cat) => (
            <div key={cat.title}>
              <h3 className="mb-2 text-sm font-semibold text-[var(--text-3)] uppercase tracking-wide">{cat.title}</h3>
              <div className="space-y-2">
                {checklist
                  .filter((item) => cat.ids.includes(item.id))
                  .map((item) => (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--border-1)] p-3 transition hover:bg-[var(--surface-2)]"
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggle(item.id)}
                        className="mt-0.5 h-4 w-4 accent-[var(--brand-600)]"
                      />
                      <span className="text-sm">{item.label}</span>
                    </label>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Observações */}
      <Card>
        <h2 className="mb-2 text-base font-semibold">Observações e pedidos especiais</h2>
        <Textarea
          rows={4}
          value={extraNotes}
          onChange={(e) => setExtraNotes(e.target.value)}
          placeholder="Ex: músicas preferidas, aromaterapia, pedidos específicos à equipe..."
        />
      </Card>

      <Button onClick={exportPdf} disabled={exporting}>
        {exporting ? "Gerando PDF..." : "Exportar plano em PDF"}
      </Button>

      {/* Área de impressão (oculta visualmente mas usada pelo html2canvas) */}
      <div
        ref={printRef}
        className="rounded-2xl border border-[var(--border-1)] bg-white p-8 text-gray-800"
        style={{ fontFamily: "sans-serif", fontSize: "13px" }}
      >
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "22px", marginBottom: "4px" }}>Plano de Parto</h1>
        {name && <p><strong>Gestante:</strong> {name}</p>}
        {dueDate && <p><strong>Data provável do parto:</strong> {new Date(dueDate + "T12:00:00").toLocaleDateString("pt-BR")}</p>}
        {hospital && <p><strong>Maternidade:</strong> {hospital}</p>}
        {doctor && <p><strong>Médico(a):</strong> {doctor}</p>}

        <hr style={{ margin: "16px 0", borderColor: "#ddd" }} />

        <h2 style={{ fontSize: "15px", marginBottom: "8px" }}>Minhas preferências</h2>
        {categories.map((cat) => {
          const catSelected = selected.filter((s) => cat.ids.includes(s.id));
          if (catSelected.length === 0) return null;
          return (
            <div key={cat.title} style={{ marginBottom: "10px" }}>
              <p style={{ fontWeight: "bold", marginBottom: "4px" }}>{cat.title}</p>
              <ul style={{ paddingLeft: "18px", margin: 0 }}>
                {catSelected.map((s) => <li key={s.id}>{s.label}</li>)}
              </ul>
            </div>
          );
        })}

        {extraNotes && (
          <>
            <hr style={{ margin: "16px 0", borderColor: "#ddd" }} />
            <h2 style={{ fontSize: "15px", marginBottom: "8px" }}>Observações</h2>
            <p style={{ whiteSpace: "pre-wrap" }}>{extraNotes}</p>
          </>
        )}

        <hr style={{ margin: "16px 0", borderColor: "#ddd" }} />
        <p style={{ fontSize: "11px", color: "#999" }}>
          Este plano de parto foi elaborado com amor e respeito à autonomia da gestante.
          Agradeço à equipe por ler e considerar minhas preferências.
        </p>
      </div>
    </div>
  );
}
