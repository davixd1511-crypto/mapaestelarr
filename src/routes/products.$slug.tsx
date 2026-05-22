import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, ChevronLeft, ShieldCheck, Star, Truck } from "lucide-react";
import { getProduto, produtos, type Produto } from "@/data/produtos";
import { BrindeModal } from "@/components/BrindeModal";
import { Customizer } from "@/components/Customizer";
import { QuadroCustomizer } from "@/components/QuadroCustomizer";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const produto = getProduto(params.slug);
    if (!produto) throw notFound();
    return produto;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.nome} — Mapa Estelar` : "Produto" },
      {
        name: "description",
        content: loaderData?.descricao ?? "",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-2xl font-bold">Produto não encontrado</h1>
        <Link to="/" className="text-primary underline mt-4 inline-block">
          Voltar para a loja
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-2xl font-bold">Algo deu errado</h1>
        <p className="text-muted-foreground mt-2">{error.message}</p>
        <Link to="/" className="text-primary underline mt-4 inline-block">
          Voltar
        </Link>
      </div>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const produto = Route.useLoaderData() as Produto;
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpenModal(true), 600);
    return () => clearTimeout(t);
  }, [produto.slug]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="bg-foreground text-background text-center text-xs sm:text-sm py-2 px-4">
        FRETE GRÁTIS para todo o Brasil em compras acima de R$ 199 ✦ Parcele em até 12x
      </div>

      <header className="bg-foreground text-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4" /> Voltar
          </Link>
          <Link to="/">
            <img src={logo} alt="Mapa Estelar" className="h-12 w-auto" />
          </Link>
          <div className="w-16" />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="bg-muted rounded-2xl overflow-hidden aspect-square">
            <img src={produto.img} alt={produto.nome} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-primary leading-tight">
              {produto.nome}
            </h1>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">(238 avaliações)</span>
            </div>

            <div className="mt-6">
              <div className="text-sm text-muted-foreground line-through">{produto.de}</div>
              <div className="text-3xl md:text-4xl font-bold text-success">{produto.por}</div>
              <div className="text-sm text-muted-foreground">ou em {produto.parcelas} sem juros</div>
            </div>

            <p className="mt-6 text-sm md:text-base text-muted-foreground leading-relaxed">
              {produto.descricao}
            </p>

            <div className="mt-6 rounded-2xl border border-border bg-card p-5">
              <h2 className="font-semibold mb-3">O que está incluso:</h2>
              <ul className="space-y-2">
                {produto.inclui.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {(produto.slug === "cesta-completa-caneca-personalizada" || produto.slug === "box-love-polaroid-premium-quadro") ? (
              <a
                href="#personalizar"
                className="mt-6 w-full bg-primary text-primary-foreground font-bold uppercase tracking-wide rounded-full py-4 hover:bg-primary/90 transition-colors shadow-lg text-center"
              >
                Personalizar agora
              </a>
            ) : (
              <button
                onClick={() => setOpenModal(true)}
                className="mt-6 w-full bg-primary text-primary-foreground font-bold uppercase tracking-wide rounded-full py-4 hover:bg-primary/90 transition-colors shadow-lg"
              >
                Personalizar e Comprar
              </button>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Truck className="h-4 w-4 text-primary" /> Envio para todo Brasil
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" /> Compra 100% segura
              </div>
            </div>
          </div>
        </div>

        {produto.slug === "cesta-completa-caneca-personalizada" && (
          <div id="personalizar">
            <Customizer />
          </div>
        )}



        <section className="mt-16">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6">Você também vai amar</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {produtos
              .filter((p) => p.slug !== produto.slug)
              .map((p) => (
                <Link
                  key={p.slug}
                  to="/products/$slug"
                  params={{ slug: p.slug }}
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={p.img}
                      alt={p.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <div className="text-xs md:text-sm font-semibold text-primary line-clamp-2 min-h-[2.5rem]">
                      {p.nome}
                    </div>
                    <div className="text-success font-bold mt-1 text-sm">{p.por}</div>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </main>

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

      {openModal && <BrindeModal onClose={() => setOpenModal(false)} />}
    </div>
  );
}
