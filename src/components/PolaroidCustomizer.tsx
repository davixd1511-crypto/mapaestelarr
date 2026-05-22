import { useMemo, useRef, useState } from "react";
import { Camera, Check, Upload } from "lucide-react";
import { toast } from "sonner";
import template6 from "@/assets/template-6polaroids.webp";
import templateCasar from "@/assets/template-casar.webp";
import templateNamorar from "@/assets/template-namorar.webp";

type TemplateId = "polaroid6" | "casar" | "namorar";

type TemplateDef = {
  id: TemplateId;
  nome: string;
  thumb: string;
  slots: number;
  redWords?: [string, string, string];
};

const TEMPLATES: TemplateDef[] = [
  { id: "polaroid6", nome: "6 Polaroids personalizadas", thumb: template6, slots: 6 },
  { id: "casar", nome: "Aceita Casar Comigo?", thumb: templateCasar, slots: 3, redWords: ["Aceita", "Casar", "Comigo?"] },
  { id: "namorar", nome: "Aceita Namorar Comigo?", thumb: templateNamorar, slots: 3, redWords: ["Aceita", "Namorar", "Comigo?"] },
];

type Slot = { url: string | null; texto: string };
const emptySlots = (n: number): Slot[] => Array.from({ length: n }, () => ({ url: null, texto: "" }));

function PolaroidPreview({ slot, index }: { slot: Slot; index: number }) {
  return (
    <div className="bg-white p-2 pb-4 shadow-md rounded-sm rotate-[-1deg] hover:rotate-0 transition-transform">
      <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
        {slot.url ? (
          <img src={slot.url} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
        ) : (
          <Camera className="h-8 w-8 text-muted-foreground/50" />
        )}
      </div>
      <p className="text-center text-[10px] md:text-xs italic mt-2 text-foreground truncate" style={{ fontFamily: "'Brush Script MT', cursive" }}>
        {slot.texto || "Seu texto aqui"}
      </p>
    </div>
  );
}

function RedPanel({ word }: { word: string }) {
  return (
    <div className="aspect-square bg-primary text-primary-foreground flex items-center justify-center rounded-sm shadow-md">
      <span className="text-2xl md:text-3xl font-bold italic" style={{ fontFamily: "'Brush Script MT', cursive" }}>
        {word}
      </span>
    </div>
  );
}

export function PolaroidCustomizer({ preco = "R$ 100,15" }: { preco?: string }) {
  const [templateId, setTemplateId] = useState<TemplateId>("polaroid6");
  const template = useMemo(() => TEMPLATES.find((t) => t.id === templateId)!, [templateId]);

  const [slots, setSlots] = useState<Record<TemplateId, Slot[]>>({
    polaroid6: emptySlots(6),
    casar: emptySlots(3),
    namorar: emptySlots(3),
  });
  const [mensagem, setMensagem] = useState("");
  const [adicionado, setAdicionado] = useState(false);

  const slotsAtuais = slots[templateId];

  const handleFile = (idx: number, file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSlots((prev) => ({ ...prev, [templateId]: prev[templateId].map((s, i) => (i === idx ? { ...s, url } : s)) }));
  };
  const handleTexto = (idx: number, texto: string) => {
    setSlots((prev) => ({ ...prev, [templateId]: prev[templateId].map((s, i) => (i === idx ? { ...s, texto } : s)) }));
  };

  const fotosPreenchidas = slotsAtuais.filter((s) => s.url).length;
  const completo = fotosPreenchidas === template.slots;

  const fotosRef = useRef<HTMLDivElement>(null);
  const mensagemRef = useRef<HTMLDivElement>(null);
  const [errorField, setErrorField] = useState<"fotos" | "mensagem" | null>(null);

  const focusError = (field: "fotos" | "mensagem", ref: React.RefObject<HTMLDivElement | null>, msg: string) => {
    setErrorField(field);
    toast.error(msg);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setErrorField((f) => (f === field ? null : f)), 4000);
  };

  const handleAdicionar = () => {
    if (!completo) return focusError("fotos", fotosRef, `Envie todas as ${template.slots} fotos da polaroid.`);
    if (!mensagem.trim()) return focusError("mensagem", mensagemRef, "Escreva a mensagem do cartão.");
    setErrorField(null);
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 4000);
  };

  return (
    <section className="mt-12 border-t border-border pt-10">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-widest text-primary font-bold">Passo a passo</p>
        <h2 className="text-2xl md:text-3xl font-bold mt-1">Personalize sua cesta</h2>
        <p className="text-sm text-muted-foreground mt-2">Escolha o modelo da polaroid, envie suas fotos e finalize.</p>
      </div>

      <div className="mb-10">
        <h3 className="font-semibold mb-3">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs mr-2">1</span>
          Escolha o modelo da polaroid
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {TEMPLATES.map((t) => {
            const ativo = t.id === templateId;
            return (
              <button
                key={t.id}
                onClick={() => setTemplateId(t.id)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all text-left ${ativo ? "border-primary ring-2 ring-primary/30 shadow-lg" : "border-border hover:border-primary/50"}`}
              >
                <div className="aspect-[4/3] bg-muted">
                  <img src={t.thumb} alt={t.nome} className="w-full h-full object-cover" />
                </div>
                <div className="p-2">
                  <p className="text-xs font-semibold leading-tight">{t.nome}</p>
                  <p className="text-[10px] text-muted-foreground">{t.slots} foto{t.slots > 1 ? "s" : ""}</p>
                </div>
                {ativo && (
                  <span className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-10 scroll-mt-24" ref={fotosRef}>
        <h3 className="font-semibold mb-1">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs mr-2">2</span>
          Envie suas fotos e legendas
        </h3>
        <p className="text-xs text-muted-foreground mb-4 ml-8">{fotosPreenchidas} de {template.slots} fotos enviadas</p>

        <div className="grid sm:grid-cols-2 gap-3">
          {slotsAtuais.map((slot, i) => (
            <div key={i} className="border border-border rounded-xl p-3 bg-card">
              <div className="flex gap-3">
                <label className={`relative h-20 w-20 shrink-0 rounded-lg bg-muted border border-dashed flex items-center justify-center cursor-pointer overflow-hidden hover:border-primary transition-colors ${!slot.url && errorField === "fotos" ? "border-destructive ring-2 ring-destructive/30" : "border-border"}`}>
                  {slot.url ? <img src={slot.url} alt="" className="w-full h-full object-cover" /> : <Upload className="h-5 w-5 text-muted-foreground" />}
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFile(i, e.target.files?.[0] ?? null)} />
                </label>
                <div className="flex-1 min-w-0">
                  <label className="text-xs text-muted-foreground">Foto {i + 1} — legenda</label>
                  <input type="text" maxLength={32} value={slot.texto} onChange={(e) => handleTexto(i, e.target.value)} placeholder="Ex: Te amo infinito!" className="mt-1 w-full text-sm border border-border rounded-md px-2 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h3 className="font-semibold mb-3">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs mr-2">3</span>
          Prévia ao vivo
        </h3>
        <div className="bg-gradient-to-b from-muted to-background rounded-2xl p-4 md:p-6 border border-border">
          {template.id === "polaroid6" && (
            <div className="grid grid-cols-3 gap-2 md:gap-3 max-w-md mx-auto">
              {slotsAtuais.map((s, i) => <PolaroidPreview key={i} slot={s} index={i} />)}
            </div>
          )}
          {(template.id === "casar" || template.id === "namorar") && template.redWords && (
            <div className="grid grid-cols-3 gap-2 md:gap-3 max-w-md mx-auto">
              {slotsAtuais.map((s, i) => <PolaroidPreview key={i} slot={s} index={i} />)}
              {template.redWords.map((w) => <RedPanel key={w} word={w} />)}
            </div>
          )}
          <p className="text-center text-xs text-muted-foreground mt-4">* Esta é uma prévia. A arte final é tratada pela nossa equipe.</p>
        </div>
      </div>

      <div className="mb-10 scroll-mt-24" ref={mensagemRef}>
        <h3 className="font-semibold mb-3">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs mr-2">4</span>
          Mensagem do cartão
        </h3>
        <textarea
          rows={4}
          maxLength={300}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Escreva aqui a mensagem que vai dentro da caixa..."
          className={`w-full text-sm border rounded-xl px-3 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 ${errorField === "mensagem" && !mensagem.trim() ? "border-destructive ring-2 ring-destructive/30" : "border-border"}`}
        />
        <p className="text-xs text-muted-foreground text-right mt-1">{mensagem.length}/300</p>
      </div>

      <div className="sticky bottom-4 z-30">
        <button
          onClick={handleAdicionar}
          className="w-full bg-primary text-primary-foreground font-bold uppercase tracking-wide rounded-full py-4 text-sm md:text-base hover:bg-primary/90 transition-colors shadow-2xl"
        >
          {adicionado ? "✓ Adicionado ao carrinho!" : `Adicionar ao carrinho — ${preco}`}
        </button>
      </div>
    </section>
  );
}
