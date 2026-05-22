import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, ChevronLeft, ShieldCheck, Star, Truck } from "lucide-react";
import { getProduto, produtos } from "@/data/produtos";
import { BrindeModal } from "@/components/BrindeModal";
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
  const produto = Route.useLoaderData();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpenModal(true), 600);
    return () => clearTimeout(t);
  }, [produto.slug]);

  return (
    <div className="min-h-screen bg-background text-foreground">
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

      <main className="container mx-auto px-4 py-8 md:py-12">
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

            <button
              onClick={() => setOpenModal(true)}
              className="mt-6 w-full bg-primary text-primary-foreground font-bold uppercase tracking-wide rounded-full py-4 hover:bg-primary/90 transition-colors shadow-lg"
            >
              Personalizar e Comprar
            </button>

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

      {openModal && <BrindeModal onClose={() => setOpenModal(false)} />}
    </div>
  );
}
