import { useEffect, useState } from "react";
import { X } from "lucide-react";
import portaJoias from "@/assets/porta-joias.png";

function formatTime(date: Date) {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatCountdown(ms: number) {
  if (ms <= 0) return "00:00";
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function BrindeModal({ onClose }: { onClose: () => void }) {
  const [deadline] = useState(() => new Date(Date.now() + 10 * 60 * 1000));
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const restante = deadline.getTime() - now.getTime();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl p-6 md:p-8 animate-scale-in">
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <span className="inline-block text-[11px] md:text-xs font-bold uppercase tracking-wider text-primary border border-primary/30 bg-primary/5 rounded-full px-4 py-1.5">
            Esquenta Dia dos Namorados 2026
          </span>

          <h3 className="mt-4 text-2xl md:text-3xl font-bold text-primary leading-tight">
            Compre essa cesta e <br /> ganhe um porta-jóias <span className="underline">GRÁTIS</span>
          </h3>

          <p className="mt-3 text-sm text-muted-foreground">
            Finalize seu pedido <strong className="text-foreground">até às {formatTime(deadline)}</strong>{" "}
            e receba um presente especial para tornar esse momento ainda mais inesquecível.
          </p>

          <div className="mt-5 flex items-center gap-4 bg-muted/50 border border-border rounded-2xl p-3 text-left">
            <div className="h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-background border border-border">
              <img src={portaJoias} alt="Porta Jóias em MDF" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">Porta Jóias em MDF</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground line-through">R$ 39,90</span>
                <span className="text-success font-bold">R$ 0,00</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Brinde especial para deixar seu presente ainda mais romântico
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Últimas unidades promocionais disponíveis
          </p>

          <div className="mt-3 flex items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">Tempo restante:</span>
            <span className="font-mono font-bold text-primary text-base tabular-nums">
              {formatCountdown(restante)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="mt-5 w-full bg-primary text-primary-foreground font-bold uppercase tracking-wide rounded-full py-4 text-sm hover:bg-primary/90 transition-colors shadow-lg"
          >
            Quero garantir meu brinde
          </button>
        </div>
      </div>
    </div>
  );
}
