import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Check, Music, Search, Upload, X } from "lucide-react";
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

type Track = {
  id: number;
  name: string;
  artist: string;
  artwork: string;
};

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

export function QuadroCustomizer() {
  const [templateId, setTemplateId] = useState<TemplateId>("polaroid6");
  const template = useMemo(() => TEMPLATES.find((t) => t.id === templateId)!, [templateId]);

  const [slots, setSlots] = useState<Record<TemplateId, Slot[]>>({
    polaroid6: emptySlots(6),
    casar: emptySlots(3),
    namorar: emptySlots(3),
  });

  // QUADRO Spotify-style
  const [quadroFoto, setQuadroFoto] = useState<string | null>(null);
  const [quadroNomes, setQuadroNomes] = useState("");
  const [songQuery, setSongQuery] = useState("");
  const [songResults, setSongResults] = useState<Track[]>([]);
  const [songLoading, setSongLoading] = useState(false);
  const [songError, setSongError] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<Track | null>(null);

  const [mensagem, setMensagem] = useState("");
  const [adicionado, setAdicionado] = useState(false);

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

  const handleQuadroFoto = (file: File | null) => {
    if (!file) return;
    setQuadroFoto(URL.createObjectURL(file));
  };

  // Busca de músicas (iTunes Search API — sem chave)
  const debounceRef = useRef<number | null>(null);
  useEffect(() => {
    if (selectedSong) return;
    const q = songQuery.trim();
    if (q.length < 2) {
      setSongResults([]);
      setSongError(null);
      return;
    }
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      setSongLoading(true);
      setSongError(null);
      try {
        const res = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=8`,
        );
        if (!res.ok) throw new Error("Falha na busca");
        const data: { results: Array<{ trackId: number; trackName: string; artistName: string; artworkUrl100: string }> } = await res.json();
        const tracks: Track[] = (data.results ?? []).map((r) => ({
          id: r.trackId,
          name: r.trackName,
          artist: r.artistName,
          artwork: (r.artworkUrl100 || "").replace("100x100", "300x300"),
        }));
        setSongResults(tracks);
      } catch (e) {
        setSongError("Não foi possível buscar agora. Tente novamente.");
      } finally {
        setSongLoading(false);
      }
    }, 350);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [songQuery, selectedSong]);

  const fotosPreenchidas = slotsAtuais.filter((s) => s.url).length;

  const fotosRef = useRef<HTMLDivElement>(null);
  const quadroRef = useRef<HTMLDivElement>(null);
  const mensagemRef = useRef<HTMLDivElement>(null);
  type ErrField = "fotos" | "musica" | "nomes" | "quadroFoto" | "mensagem";
  const [errorField, setErrorField] = useState<ErrField | null>(null);

  const focusError = (
    field: ErrField,
    ref: React.RefObject<HTMLDivElement | null>,
    msg: string,
  ) => {
    setErrorField(field);
    toast.error(msg);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setErrorField((f) => (f === field ? null : f)), 4000);
  };

  const handleAdicionar = () => {
    if (fotosPreenchidas !== template.slots) {
      return focusError("fotos", fotosRef, `Envie todas as ${template.slots} fotos da polaroid.`);
    }
    if (!selectedSong) {
      return focusError("musica", quadroRef, "Selecione a música do quadro.");
    }
    if (!quadroNomes.trim()) {
      return focusError("nomes", quadroRef, "Digite os nomes do casal.");
    }
    if (!quadroFoto) {
      return focusError("quadroFoto", quadroRef, "Envie a imagem do quadro.");
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
          Escolha o modelo da polaroid, personalize seu quadro com música e finalize seu pedido.
        </p>
      </div>

      {/* PASSO 1: Template polaroid */}
      <div className="mb-10">
        <h3 className="font-semibold mb-3">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs mr-2">1</span>
          Escolha o modelo das polaroids
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {TEMPLATES.map((t) => {
            const ativo = t.id === templateId;
            return (
              <button
                key={t.id}
                onClick={() => setTemplateId(t.id)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all text-left ${
                  ativo ? "border-primary ring-2 ring-primary/30 shadow-lg" : "border-border hover:border-primary/50"
                }`}
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

      {/* PASSO 2: Fotos polaroids */}
      <div className="mb-10">
        <h3 className="font-semibold mb-1">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs mr-2">2</span>
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

      {/* PASSO 3: Prévia polaroids */}
      <div className="mb-10">
        <h3 className="font-semibold mb-3">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs mr-2">3</span>
          Prévia ao vivo
        </h3>
        <div className="bg-gradient-to-b from-muted to-background rounded-2xl p-4 md:p-6 border border-border">
          {template.id === "polaroid6" && (
            <div className="grid grid-cols-3 gap-2 md:gap-3 max-w-md mx-auto">
              {slotsAtuais.map((s, i) => (<PolaroidPreview key={i} slot={s} index={i} />))}
            </div>
          )}
          {(template.id === "casar" || template.id === "namorar") && template.redWords && (
            <div className="grid grid-cols-3 gap-2 md:gap-3 max-w-md mx-auto">
              {slotsAtuais.map((s, i) => (<PolaroidPreview key={i} slot={s} index={i} />))}
              {template.redWords.map((w) => (<RedPanel key={w} word={w} />))}
            </div>
          )}
          <p className="text-center text-xs text-muted-foreground mt-4">
            * Esta é uma prévia. A arte final é tratada pela nossa equipe.
          </p>
        </div>
      </div>

      {/* PASSO 4: QUADRO Spotify-style */}
      <div className="mb-10">
        <h3 className="font-semibold mb-3">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs mr-2">4</span>
          Personalize seu quadro
        </h3>

        <div className="grid md:grid-cols-2 gap-5 bg-card border border-border rounded-xl p-4">
          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Selecione a música</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={selectedSong ? `${selectedSong.name} — ${selectedSong.artist}` : songQuery}
                  onChange={(e) => {
                    setSelectedSong(null);
                    setSongQuery(e.target.value);
                  }}
                  placeholder="Digite o nome da música ou artista"
                  className="w-full text-sm border border-border rounded-md pl-9 pr-9 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                {selectedSong && (
                  <button
                    onClick={() => { setSelectedSong(null); setSongQuery(""); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Limpar música"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {!selectedSong && songQuery.trim().length >= 2 && (
                <div className="mt-2 border border-border rounded-md bg-background max-h-64 overflow-y-auto divide-y divide-border">
                  {songLoading && <div className="p-3 text-xs text-muted-foreground">Buscando…</div>}
                  {songError && <div className="p-3 text-xs text-destructive">{songError}</div>}
                  {!songLoading && !songError && songResults.length === 0 && (
                    <div className="p-3 text-xs text-muted-foreground">Nenhuma música encontrada.</div>
                  )}
                  {songResults.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setSelectedSong(t); setSongResults([]); }}
                      className="w-full flex items-center gap-3 p-2 hover:bg-muted text-left"
                    >
                      <img src={t.artwork} alt={t.name} className="h-10 w-10 rounded object-cover" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{t.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{t.artist}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-muted-foreground mt-1">
                O QRcode não aparecerá na prévia, apenas na arte final.
              </p>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">Nomes do casal</label>
              <input
                type="text"
                maxLength={40}
                value={quadroNomes}
                onChange={(e) => setQuadroNomes(e.target.value)}
                placeholder="Ex: Melina e Lucas"
                className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">Envie a imagem do quadro</label>
              <label className="relative h-40 w-full rounded-lg bg-muted border-2 border-dashed border-border flex items-center justify-center cursor-pointer overflow-hidden hover:border-primary transition-colors">
                {quadroFoto ? (
                  <img src={quadroFoto} alt="Foto do quadro" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Upload className="h-6 w-6" />
                    <span className="text-xs mt-1">Clique para enviar</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleQuadroFoto(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          </div>

          {/* Preview Quadro */}
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 text-center">Prévia do quadro</div>
            <div className="mx-auto max-w-[260px] bg-black p-3 rounded-md shadow-2xl">
              <div className="border border-white/30 p-2">
                <div className="border border-white/20 p-3">
                  <p
                    className="text-white text-center text-lg mb-2"
                    style={{ fontFamily: "'Brush Script MT', cursive" }}
                  >
                    {quadroNomes || "Seus nomes"}
                  </p>
                  <div className="aspect-square bg-neutral-800 overflow-hidden flex items-center justify-center">
                    {quadroFoto ? (
                      <img src={quadroFoto} alt="Quadro" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="h-10 w-10 text-white/30" />
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-white text-[11px] font-semibold uppercase tracking-wide truncate">
                      {selectedSong?.name || "Nome da música"}
                    </p>
                    {selectedSong?.artist && (
                      <p className="text-white/60 text-[10px] truncate">{selectedSong.artist}</p>
                    )}
                  </div>
                  <div className="mt-2 h-[2px] bg-white/30 rounded-full">
                    <div className="h-full w-1/3 bg-white rounded-full" />
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-3 text-white">
                    <span className="text-base">♡</span>
                    <span className="text-base">⏮</span>
                    <span className="h-7 w-7 rounded-full bg-white text-black flex items-center justify-center text-xs">▶</span>
                    <span className="text-base">⏭</span>
                    <span className="text-base">⊖</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-[11px] text-muted-foreground mt-2 flex items-center justify-center gap-1">
              <Music className="h-3 w-3" /> Quadro estilo Spotify
            </p>
          </div>
        </div>
      </div>

      {/* PASSO 5: Mensagem */}
      <div className="mb-10">
        <h3 className="font-semibold mb-3">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs mr-2">5</span>
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

      <div className="sticky bottom-4 z-30">
        <button
          onClick={handleAdicionar}
          className="w-full bg-primary text-primary-foreground font-bold uppercase tracking-wide rounded-full py-4 text-sm md:text-base hover:bg-primary/90 transition-colors shadow-2xl"
        >
          {adicionado ? "✓ Adicionado ao carrinho!" : "Adicionar ao carrinho — R$ 98,32"}
        </button>
      </div>
    </section>
  );
}
