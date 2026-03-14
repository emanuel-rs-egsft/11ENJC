import { google } from "googleapis";

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

function getSingleValue(
  valueRanges: { range?: string | null; values?: string[][] | null }[],
  range: string,
) {
  const found = valueRanges.find((item) => item.range === range);
  return found?.values?.[0]?.[0] ?? "";
}

async function getRanges(ranges: string[]) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

  const response = await sheets.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges,
  });

  return response.data.valueRanges ?? [];
}

async function getRange(range: string) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  return response.data.values ?? [];
}

export async function getPainelData() {
  const abaResumo = "'11º ENJC - Informações Gerais'";
  const abaInscritos = "'Inscritos'";

  const rangesResumo = [
    `${abaResumo}!C13`,
    `${abaResumo}!C20`,
    `${abaResumo}!H13`,
    `${abaResumo}!H17`,
    `${abaResumo}!K14`,
    `${abaResumo}!K15`,
    `${abaResumo}!K16`,
    `${abaResumo}!K17`,
    `${abaResumo}!K18`,
    `${abaResumo}!K19`,
  ];

  const [resumoRanges, inscritosRows] = await Promise.all([
    getRanges(rangesResumo),
    getRange(`${abaInscritos}!A2:V`),
  ]);

  const preInscritos = getSingleValue(resumoRanges, `${abaResumo}!C13`);
  const inscritos = getSingleValue(resumoRanges, `${abaResumo}!C20`);
  const geds = getSingleValue(resumoRanges, `${abaResumo}!H13`);
  const gers = getSingleValue(resumoRanges, `${abaResumo}!H17`);
  const camisetaP = getSingleValue(resumoRanges, `${abaResumo}!K14`);
  const camisetaM = getSingleValue(resumoRanges, `${abaResumo}!K15`);
  const camisetaG = getSingleValue(resumoRanges, `${abaResumo}!K16`);
  const camisetaGG = getSingleValue(resumoRanges, `${abaResumo}!K17`);
  const camisetaEXG = getSingleValue(resumoRanges, `${abaResumo}!K18`);
  const camisetaEXGG = getSingleValue(resumoRanges, `${abaResumo}!K19`);

  const inscritosTabela = inscritosRows
    .filter((row) => row.some((cell) => String(cell || "").trim() !== ""))
    .map((row) => ({
      dataHorario: row[0] ?? "",
      nome: row[1] ?? "",
      cracha: row[2] ?? "",
      nascimento: row[3] ?? "",
      whatsapp: row[4] ?? "",
      email: row[5] ?? "",
      rua: row[6] ?? "",
      numero: row[7] ?? "",
      bairro: row[8] ?? "",
      cidade: row[9] ?? "",
      macro: row[10] ?? "",
      ger: row[11] ?? "",
      ged: row[12] ?? "",
      funcao: row[13] ?? "",
      cursilho: row[14] ?? "",
      alergia: row[15] ?? "",
      alergiaDesc: row[16] ?? "",
      restricao: row[17] ?? "",
      restricaoDesc: row[18] ?? "",
      camiseta: row[19] ?? "",
      pagamento: row[20] ?? "",
      comprovante: row[21] ?? "",
    }));

  return {
    resumo: {
      preInscritos,
      inscritos,
      geds,
      gers,
      camisetas: {
        P: camisetaP,
        M: camisetaM,
        G: camisetaG,
        GG: camisetaGG,
        EXG: camisetaEXG,
        EXGG: camisetaEXGG,
      },
    },
    inscritosTabela,
  };
}
