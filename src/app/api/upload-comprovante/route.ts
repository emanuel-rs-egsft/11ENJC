import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function formatNomeArquivo(
  nome: string,
  ger: string,
  ged: string,
  mime: string,
) {
  const nomeLimpo = (nome || "").replace(/\s+/g, "").replace(/[^\w]/g, "");

  const gerLimpo = (ger || "").replace(/\s+/g, "_").toUpperCase();

  const gedLimpo = (ged || "").replace(/\s+/g, "_").toUpperCase();

  const data = new Date().toISOString().split("T")[0];

  let ext = "png";
  if (mime.includes("jpeg") || mime.includes("jpg")) ext = "jpg";
  if (mime.includes("pdf")) ext = "pdf";

  return `${nomeLimpo}_GER_${gerLimpo}_GED_${gedLimpo}_${data}.${ext}`;
}

export async function POST(req: Request) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Missing token" },
        { status: 500 },
      );
    }

    const form = await req.formData();

    const file = form.get("file") as File | null;
    const nome = form.get("nome") as string;
    const ger = form.get("ger") as string;
    const ged = form.get("ged") as string;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "Missing file" },
        { status: 400 },
      );
    }

    const nomeFinal = formatNomeArquivo(nome, ger, ged, file.type);

    const blob = await put(`comprovantes/${nomeFinal}`, file, {
      access: "public",
      token,
      contentType: file.type || undefined,
    });

    return NextResponse.json({
      ok: true,
      url: blob.url,
      name: nomeFinal,
      contentType: file.type,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: String(err?.message || err),
      },
      { status: 500 },
    );
  }
}
