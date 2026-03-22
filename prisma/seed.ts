import { PrismaClient } from "@prisma/client";
import { ITENS_CATALOG, CAMINHOES_CATALOG } from "../lib/constants";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Caminhoes
  for (const c of CAMINHOES_CATALOG) {
    await db.caminhao.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        nome: c.nome,
        tipo: c.tipo,
        capacidadeM3: c.capacidadeM3,
        capacidadeKg: c.capacidadeKg,
        comprimentoCm: c.comprimentoCm,
        larguraCm: c.larguraCm,
        alturaCm: c.alturaCm,
        imagemUrl: null,
      },
    });
  }
  console.log(`✅ ${CAMINHOES_CATALOG.length} caminhões criados`);

  // Seed Items
  for (const item of ITENS_CATALOG) {
    await db.item.upsert({
      where: { id: undefined as any },
      update: {},
      create: {
        nome: item.nome,
        categoria: item.categoria,
        iconeUrl: item.iconeUrl,
        larguraCm: item.larguraCm,
        alturaCm: item.alturaCm,
        profundidadeCm: item.profundidadeCm,
        pesoKg: item.pesoKg,
        volumeM3: item.volumeM3,
      },
    }).catch(() => {}); // skip duplicates
  }
  console.log(`✅ ${ITENS_CATALOG.length} itens criados`);

  // Seed Transportadoras
  const transportadoras = [
    { nome: "MudaRápido", notaMedia: 4.8, totalAvaliacoes: 312, cidade: "São Paulo", tiposCaminhao: ["fiorino", "hr", "tres-quartos", "bau"] },
    { nome: "TransFácil", notaMedia: 4.6, totalAvaliacoes: 198, cidade: "São Paulo", tiposCaminhao: ["hr", "tres-quartos", "bau"] },
    { nome: "MudançaExpress", notaMedia: 4.5, totalAvaliacoes: 421, cidade: "São Paulo", tiposCaminhao: ["fiorino", "hr"] },
    { nome: "FreteBom", notaMedia: 4.7, totalAvaliacoes: 89, cidade: "São Paulo", tiposCaminhao: ["tres-quartos", "bau"] },
    { nome: "MudaSeguro", notaMedia: 4.9, totalAvaliacoes: 156, cidade: "São Paulo", tiposCaminhao: ["fiorino", "hr", "tres-quartos"] },
  ];

  for (const t of transportadoras) {
    await db.transportadora.create({ data: t }).catch(() => {});
  }
  console.log(`✅ ${transportadoras.length} transportadoras criadas`);

  console.log("🎉 Seed concluído!");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
