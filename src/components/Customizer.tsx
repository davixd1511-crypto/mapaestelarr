import { useMemo, useRef, useState } from "react";
import { Camera, Check, Upload } from "lucide-react";
import { toast } from "sonner";
import template6 from "@/assets/template-6polaroids.webp";
import templateCasar from "@/assets/template-casar.webp";
import templateNamorar from "@/assets/template-namorar.webp";
import canecaMeuAmor from "@/assets/caneca-meu-amor.webp";

type TemplateId = "polaroid6" | "casar" | "namorar";

type TemplateDef = {
  id: TemplateId;
  nome: string;
  thumb: string;
  slots: number;
  /** Para templates com painéis vermelhos, as 3 palavras finais */
  redWords?: [string, string, string];
};

const TEMPLATES: TemplateDef[] = [
  {
    id: "polaroid6",
    nome: "6 Polaroids personalizadas",
    thumb: template6,
    slots: 6,
  },
  {
    id: "casar",
    nome: "Aceita Casar Comigo?",
    thumb: templateCasar,
    slots: 3,
    redWords: ["Aceita", "Casar", "Comigo?"],
  },
  {
    id: "namorar",
    nome: "Aceita Namorar Comigo?",
    thumb: templateNamorar,
    slots: 3,
    redWords: ["Aceita", "Namorar", "Comigo?"],
  },
];

type Slot = { url: string | null; texto: string };

function emptySlots(n: number): Slot[] {
  return Array.from({ length: n }, () => ({ url: null, texto: "" }));
}

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
      <p className="text-center text-[10px] md:text-xs italic mt-2 text-foreground font-handwriting truncate">
        {slot.texto || "Seu texto aqui"}
      </p>
    </div>
  );
}

function RedPanel({ word }: { word: string }) {
  return (
    <div className="aspect-square bg-primary text-primary-foreground flex items-center justify-center rounded-sm shadow-md">
      <span
        className="text-2xl md:text-3xl font-bold italic"
        style={{ fontFamily: "'Brush Script MT', cursive" }}
      >
        {word}
      </span>
    </div>
  );
}

export function Customizer() {
  const [templateId, setTemplateId] = useState<TemplateId>("polaroid6");
  const template = useMemo(() => TEMPLATES.find((t) => t.id === templateId)!, [templateId]);

  const [slots, setSlots] = useState<Record<TemplateId, Slot[]>>({
    polaroid6: emptySlots(6),
    casar: emptySlots(3),
    namorar: emptySlots(3),
  });

  const [canecaNome, setCanecaNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [adicionado, setAdicionado] = useState(false);
  const [canecaFotos, setCanecaFotos] = useState<(string | null)[]>([null, null]);

  const handleCanecaFile = (idx: number, file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCanecaFotos((prev) => prev.map((u, i) => (i === idx ? url : u)));
  };

  const slotsAtuais = slots[templateId];

  const handleFile = (idx: number, file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSlots((prev) => ({
      ...prev,
      [templateId]: prev[templateId].map((s, i) => (i === idx ? { ...s, url } : s)),
    }));
  };

  const handleTexto = (idx: number, texto: string) => {
    setSlots((prev) => ({
      ...prev,
      [templateId]: prev[templateId].map((s, i) => (i === idx ? { ...s, texto } : s)),
    }));
  };

  const fotosPreenchidas = slotsAtuais.filter((s) => s.url).length;
  const completo = fotosPreenchidas === template.slots;

  const fotosRef = useRef<HTMLDivElement>(null);
  const canecaRef = useRef<HTMLDivElement>(null);
  const mensagemRef = useRef<HTMLDivElement>(null);
  const [errorField, setErrorField] = useState<"fotos" | "caneca" | "mensagem" | null>(null);

  const focusError = (
    field: "fotos" | "caneca" | "mensagem",
    ref: React.RefObject<HTMLDivElement | null>,
    msg: string,
  ) => {
    setErrorField(field);
    toast.error(msg);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setErrorField((f) => (f === field ? null : f)), 4000);
  };

  const handleAdicionar = () => {
    if (!completo) {
      return focusError("fotos", fotosRef, `Envie todas as ${template.slots} fotos da polaroid.`);
    }
    if (canecaFotos.some((u) => !u)) {
      return focusError("caneca", canecaRef, "Envie as 2 fotos da caneca personalizada.");
    }
    if (!mensagem.trim()) {
      return focusError("mensagem", mensagemRef, "Escreva a mensagem do cartão.");
    }
    setErrorField(null);
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 4000);
  };

  return (
    <section className="mt-12 border-t border-border pt-10">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-widest text-primary font-bold">Passo a passo</p>
        <h2 className="text-2xl md:text-3xl font-bold mt-1">Personalize sua cesta</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Escolha o modelo do quadro, envie suas fotos e finalize seu pedido.
        </p>
      </div>

      {/* PASSO 1: Template */}
      <div className="mb-10">
        <h3 className="font-semibold mb-3">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs mr-2">
            1
          </span>
          Escolha o modelo do quadro
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {TEMPLATES.map((t) => {
            const ativo = t.id === templateId;
            return (
              <button
                key={t.id}
                onClick={() => setTemplateId(t.id)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all text-left ${
                  ativo
                    ? "border-primary ring-2 ring-primary/30 shadow-lg"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="aspect-[4/3] bg-muted">
                  <img src={t.thumb} alt={t.nome} className="w-full h-full object-cover" />
                </div>
                <div className="p-2">
                  <p className="text-xs font-semibold leading-tight">{t.nome}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {t.slots} foto{t.slots > 1 ? "s" : ""}
                  </p>
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

      {/* PASSO 2: Fotos e legendas */}
      <div className="mb-10">
        <h3 className="font-semibold mb-1">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs mr-2">
            2
          </span>
          Envie suas fotos e legendas
        </h3>
        <p className="text-xs text-muted-foreground mb-4 ml-8">
          {fotosPreenchidas} de {template.slots} fotos enviadas
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          {slotsAtuais.map((slot, i) => (
            <div key={i} className="border border-border rounded-xl p-3 bg-card">
              <div className="flex gap-3">
                <label className="relative h-20 w-20 shrink-0 rounded-lg bg-muted border border-dashed border-border flex items-center justify-center cursor-pointer overflow-hidden hover:border-primary transition-colors">
                  {slot.url ? (
                    <img src={slot.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleFile(i, e.target.files?.[0] ?? null)}
                  />
                </label>
                <div className="flex-1 min-w-0">
                  <label className="text-xs text-muted-foreground">Foto {i + 1} — legenda</label>
                  <input
                    type="text"
                    maxLength={32}
                    value={slot.texto}
                    onChange={(e) => handleTexto(i, e.target.value)}
                    placeholder="Ex: Te amo infinito!"
                    className="mt-1 w-full text-sm border border-border rounded-md px-2 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PASSO 3: Prévia ao vivo */}
      <div className="mb-10">
        <h3 className="font-semibold mb-3">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs mr-2">
            3
          </span>
          Prévia ao vivo
        </h3>

        <div className="bg-gradient-to-b from-muted to-background rounded-2xl p-4 md:p-6 border border-border">
          {template.id === "polaroid6" && (
            <div className="grid grid-cols-3 gap-2 md:gap-3 max-w-md mx-auto">
              {slotsAtuais.map((s, i) => (
                <PolaroidPreview key={i} slot={s} index={i} />
              ))}
            </div>
          )}

          {(template.id === "casar" || template.id === "namorar") && template.redWords && (
            <div className="grid grid-cols-3 gap-2 md:gap-3 max-w-md mx-auto">
              {slotsAtuais.map((s, i) => (
                <PolaroidPreview key={i} slot={s} index={i} />
              ))}
              {template.redWords.map((w) => (
                <RedPanel key={w} word={w} />
              ))}
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground mt-4">
            * Esta é uma prévia. A arte final é tratada pela nossa equipe.
          </p>
        </div>
      </div>

      {/* PASSO 4: Caneca */}
      <div className="mb-10">
        <h3 className="font-semibold mb-3">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs mr-2">
            4
          </span>
          Caneca personalizada
        </h3>
        <div className="grid md:grid-cols-2 gap-4 items-center bg-card border border-border rounded-xl p-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img src={canecaMeuAmor} alt="Caneca O meu amor é teu" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="inline-block text-[11px] uppercase tracking-wider text-primary font-bold border border-primary/30 bg-primary/5 rounded-full px-3 py-1">
              Modelo selecionado
            </span>
            <h4 className="font-bold text-lg mt-2">"O meu amor é teu"</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Caneca de cerâmica branca com 2 polaroids do casal de um lado e a frase
              estampada do outro.
            </p>
            <label className="block mt-4 text-xs text-muted-foreground">
              Nome do casal (opcional)
            </label>
            <input
              type="text"
              maxLength={30}
              value={canecaNome}
              onChange={(e) => setCanecaNome(e.target.value)}
              placeholder="Ex: João & Maria"
              className="mt-1 w-full text-sm border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            <label className="block mt-4 text-xs text-muted-foreground">
              Fotos da polaroid da caneca (2 fotos)
            </label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {canecaFotos.map((url, i) => (
                <label
                  key={i}
                  className="relative aspect-square rounded-lg bg-muted border border-dashed border-border flex items-center justify-center cursor-pointer overflow-hidden hover:border-primary transition-colors"
                >
                  {url ? (
                    <img src={url} alt={`Foto caneca ${i + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Upload className="h-5 w-5" />
                      <span className="text-[10px] mt-1">Foto {i + 1}</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleCanecaFile(i, e.target.files?.[0] ?? null)}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PASSO 5: Mensagem do cartão */}
      <div className="mb-10">
        <h3 className="font-semibold mb-3">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs mr-2">
            5
          </span>
          Mensagem do cartão
        </h3>
        <textarea
          rows={4}
          maxLength={300}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Escreva aqui a mensagem que vai dentro da caixa..."
          className="w-full text-sm border border-border rounded-xl px-3 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <p className="text-xs text-muted-foreground text-right mt-1">{mensagem.length}/300</p>
      </div>

      {/* CTA */}
      <div className="sticky bottom-4 z-30">
        <button
          onClick={handleAdicionar}
          className="w-full bg-primary text-primary-foreground font-bold uppercase tracking-wide rounded-full py-4 text-sm md:text-base hover:bg-primary/90 transition-colors shadow-2xl"
        >
          {adicionado ? "✓ Adicionado ao carrinho!" : "Adicionar ao carrinho — R$ 289,90"}
        </button>
      </div>
    </section>
  );
}
