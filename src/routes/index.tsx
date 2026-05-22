import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShoppingCart, Search, Menu, Star, Truck, ShieldCheck, CreditCard } from "lucide-react";
import logo from "@/assets/logo.png";
import banner1 from "@/assets/banner-1.png";
import banner2 from "@/assets/banner-2.png";
import banner3 from "@/assets/banner-3.png";
import produto1 from "@/assets/produto-1.png";
import produto2 from "@/assets/produto-2.png";
import produto3 from "@/assets/produto-3.png";
import produto4 from "@/assets/produto-4.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mapa Estelar — Presentes personalizados que emocionam" },
      {
        name: "description",
        content:
          "Cestas, quadros e presentes personalizados para datas especiais. Surpreenda quem você ama com um presente mais do que perfeito.",
      },
    ],
  }),
  component: Index,
});

const banners = [banner1, banner2, banner3];

const produtos = [
  {
    img: produto1,
    nome: "Cesta Premium + Caneca Personalizada",
    de: "R$ 309,88",
    por: "R$ 289,90",
    parcelas: "12x de R$ 27,73",
  },
  {
    img: produto2,
    nome: "Cesta Completa (Polaroid) + Quadro Grátis",
    de: "R$ 299,88",
    por: "R$ 259,90",
    parcelas: "12x de R$ 24,86",
  },
  {
    img: produto3,
    nome: "Cesta Luxo (Polaroid) + Quadro Grátis",
    de: "R$ 309,88",
    por: "R$ 299,90",
    parcelas: "12x de R$ 28,69",
  },
  {
    img: produto4,
    nome: "Cesta Premium (Polaroid) + Urso de Pelúcia",
    de: "R$ 309,88",
    por: "R$ 289,90",
    parcelas: "12x de R$ 27,73",
  },
];

function Index() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Anúncio topo */}
      <div className="bg-foreground text-background text-center text-xs sm:text-sm py-2 px-4">
        FRETE GRÁTIS para todo o Brasil em compras acima de R$ 199 ✦ Parcele em até 12x
      </div>

      {/* Cabeçalho com logo centralizada */}
      <header className="bg-foreground text-background">
        <div className="container mx-auto px-4 py-4 grid grid-cols-3 items-center">
          <button aria-label="Menu" className="justify-self-start md:hidden">
            <Menu className="h-6 w-6" />
          </button>
          <nav className="hidden md:flex gap-6 text-sm font-medium justify-self-start">
            <a href="#produtos" className="hover:text-primary transition-colors">Presentes</a>
            <a href="#produtos" className="hover:text-primary transition-colors">Quadros</a>
            <a href="#" className="hover:text-primary transition-colors">Sobre</a>
          </nav>

          <a href="/" className="justify-self-center">
            <img src={logo} alt="Mapa Estelar" className="h-14 md:h-16 w-auto" />
          </a>

          <div className="justify-self-end flex items-center gap-4">
            <button aria-label="Buscar" className="hover:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button aria-label="Carrinho" className="relative hover:text-primary transition-colors">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Banner carrossel */}
      <section className="relative overflow-hidden bg-muted">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${slide * 100}%)` }}
        >
          {banners.map((b, i) => (
            <img
              key={i}
              src={b}
              alt={`Banner ${i + 1}`}
              className="w-full flex-shrink-0 object-cover"
            />
          ))}
        </div>

        {/* Indicadores */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              aria-label={`Ir para slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === slide ? "w-8 bg-primary" : "w-2 bg-background/70"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Benefícios */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: Truck, t: "Frete Grátis", s: "Acima de R$ 199" },
            { icon: CreditCard, t: "Até 12x", s: "Sem juros no cartão" },
            { icon: ShieldCheck, t: "Compra Segura", s: "Site protegido" },
            { icon: Star, t: "+10 mil clientes", s: "Avaliação 5 estrelas" },
          ].map(({ icon: Icon, t, s }) => (
            <div key={t} className="flex flex-col items-center gap-1">
              <Icon className="h-6 w-6 text-primary" />
              <div className="text-sm font-semibold">{t}</div>
              <div className="text-xs text-muted-foreground">{s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Produtos */}
      <section id="produtos" className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-widest text-primary font-semibold mb-2">
            Mais vendidos
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">Presentes Completos</h2>
          <p className="text-muted-foreground mt-2">
            Personalize e surpreenda quem você ama.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {produtos.map((p) => (
            <article
              key={p.nome}
              className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={p.img}
                  alt={p.nome}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 md:p-5 flex flex-col flex-1 text-center">
                <h3 className="font-semibold text-sm md:text-base text-primary leading-snug min-h-[2.5rem]">
                  {p.nome}
                </h3>
                <div className="flex justify-center gap-0.5 my-2 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground line-through">{p.de}</div>
                <div className="text-lg md:text-xl font-bold text-success">{p.por}</div>
                <div className="text-xs text-muted-foreground mb-4">ou em {p.parcelas}</div>
                <button className="mt-auto bg-foreground text-background font-semibold rounded-full py-3 px-4 text-sm hover:bg-primary transition-colors">
                  Personalizar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-foreground text-background mt-8">
        <div className="container mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
          <div>
            <img src={logo} alt="Mapa Estelar" className="h-14 w-auto mb-4" />
            <p className="text-sm text-background/70">
              Presentes personalizados que transformam datas em memórias inesquecíveis.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Atendimento</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>Segunda a Sexta, 9h às 18h</li>
              <li>contato@mapaestelar.com.br</li>
              <li>WhatsApp: (11) 99999-9999</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Institucional</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-primary">Trocas e devoluções</a></li>
              <li><a href="#" className="hover:text-primary">Política de privacidade</a></li>
              <li><a href="#" className="hover:text-primary">Rastrear pedido</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10 py-4 text-center text-xs text-background/60">
          © {new Date().getFullYear()} Mapa Estelar. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
