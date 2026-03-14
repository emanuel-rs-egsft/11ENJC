import { NextResponse } from "next/server";
import { getPainelData } from "@/lib/googleSheets";

function escapeCsv(value: unknown) {
  const str = String(value ?? "");
  if (str.includes('"') || str.includes(",") || str.includes("\n")) {
    return `"${str.replaceAll('"', '""')}"`;
  }
  return str;
}

export async function GET() {
  const data = await getPainelData();

  const headers = [
    "Data/Horário",
    "Nome",
    "Nome (Crachá)",
    "Data Nascimento",
    "WhatsApp",
    "Email",
    "Rua",
    "Número",
    "Bairro",
    "Cidade",
    "Macrorregional",
    "GER",
    "GED",
    "Função",
    "Cursilho",
    "Alergia",
    "Alergia (Descrição)",
    "Restrição Alimentar",
    "Restrição (Descrição)",
    "Camiseta",
    "Pagamento",
    "Comprovante",
  ];

  const rows = data.inscritosTabela.map((item) => [
    item.dataHorario,
    item.nome,
    item.cracha,
    item.nascimento,
    item.whatsapp,
    item.email,
    item.rua,
    item.numero,
    item.bairro,
    item.cidade,
    item.macro,
    item.ger,
    item.ged,
    item.funcao,
    item.cursilho,
    item.alergia,
    item.alergiaDesc,
    item.restricao,
    item.restricaoDesc,
    item.camiseta,
    item.pagamento,
    item.comprovante,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="painel-enjc.csv"',
    },
  });
}
