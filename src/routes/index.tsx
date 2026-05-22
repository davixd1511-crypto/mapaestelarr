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
        <div className="container mx-auto px-4 py-10 grid md:grid-cols-4 gap-8">
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
              <li>
                <a
                  href="https://wa.me/5516998568711?text=Ol%C3%A1!%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20os%20presentes%20da%20Mapa%20Estelar."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-primary transition-colors"
                  aria-label="Falar no WhatsApp"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4 text-success"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.04 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  (16) 99856-8711
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Institucional</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-primary">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-primary">Política de Reembolso</a></li>
              <li><a href="#" className="hover:text-primary">Política de Frete</a></li>
              <li><a href="#" className="hover:text-primary">Termos de serviço</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Empresa</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>Mapa Estelar Oficial LTDA</li>
              <li>CNPJ: 41.813.535/0001-69</li>
              <li>Todos os direitos reservados.</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10 py-4 text-center text-xs text-background/60">
          © {new Date().getFullYear()} Mapa Estelar Oficial LTDA. Todos os direitos reservados.
        </div>
      </footer>

      {/* Botão flutuante WhatsApp */}
      <a
        href="https://wa.me/5516998568711?text=Ol%C3%A1!%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20os%20presentes%20da%20Mapa%20Estelar."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-success text-background shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.04 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}

