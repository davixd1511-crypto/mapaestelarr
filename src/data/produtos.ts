import produto1 from "@/assets/cesta-premium-caneca-nova.webp";
import produto3 from "@/assets/cesta-luxo-polaroid-quadro.webp";
import produto4 from "@/assets/produto-4.png";

export type Produto = {
  slug: string;
  img: string;
  nome: string;
  de: string;
  por: string;
  parcelas: string;
  descricao: string;
  inclui: string[];
};

export const produtos: Produto[] = [
  {
    slug: "cesta-completa-caneca-personalizada",
    img: produto1,
    nome: "Cesta Premium + Caneca Personalizada",
    de: "R$ 289,00",
    por: "R$ 123,54",
    parcelas: "12x de R$ 10,30",
    descricao:
      "A combinação perfeita para surpreender quem você ama: uma cesta recheada de doces e uma caneca personalizada com a foto e o nome do casal. Cada detalhe pensado para emocionar.",
    inclui: [
      "1 Caixa de madeira MDF com pisca-pisca de LED",
      "6 fotos polaroid personalizadas",
      "1 Caneca personalizada com foto e nome",
      "Mix de chocolates Nestlé, Lacta e Ferrero Rocher",
      "Cartão personalizado com mensagem",
    ],
  },
  {
    slug: "box-love-polaroid-premium-quadro",
    img: produto3,
    nome: "Cesta Luxo (Polaroid) + Quadro Grátis",
    de: "R$ 289,00",
    por: "R$ 98,32",
    parcelas: "12x de R$ 8,20",
    descricao:
      "A versão luxo do nosso Box Love: caixa maior, mais chocolates, polaroids e um quadro premium personalizado de cortesia. Para um amor que merece o melhor.",
    inclui: [
      "1 Caixa de madeira MDF tamanho luxo com LED",
      "6 fotos polaroid personalizadas",
      "1 Quadro premium personalizado (BRINDE)",
      "Mix luxo de chocolates Ferrero, Lacta e Nestlé",
      "Cartão personalizado com mensagem",
    ],
  },
  {
    slug: "cesta-completa-polaroid-urso-de-pelucia",
    img: produto4,
    nome: "Cesta Premium (Polaroid) + Urso de Pelúcia",
    de: "R$ 289,00",
    por: "R$ 100,15",
    parcelas: "12x de R$ 8,35",
    descricao:
      "Cesta completa com fotos polaroid e um lindo urso de pelúcia segurando um coração 'Love You'. O presente perfeito para arrancar sorrisos e lágrimas de alegria.",
    inclui: [
      "1 Caixa de madeira MDF com iluminação LED",
      "6 fotos polaroid personalizadas",
      "1 Urso de pelúcia com coração 'Love You'",
      "Mix premium de chocolates",
      "Cartão personalizado com mensagem",
    ],
  },
];

export const getProduto = (slug: string) => produtos.find((p) => p.slug === slug);
