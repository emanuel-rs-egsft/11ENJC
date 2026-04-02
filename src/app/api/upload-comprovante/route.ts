import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Missing BLOB_READ_WRITE_TOKEN" },
        { status: 500 },
      );
    }

    const form = await req.formData();

    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "Missing file (field name must be 'file')" },
        { status: 400 },
      );
    }

    // 🔥 DADOS VINDOS DO FORM
    const nome = String(form.get("nome") || "")
      .trim()
      .replace(/\s+/g, "");

    const ger = String(form.get("ger") || "")
      .trim()
      .replace(/\s+/g, "_");

    const ged = String(form.get("ged") || "")
      .trim()
      .replace(/\s+/g, "_");

    // 📅 DATA
    const dataHoje = new Date().toISOString().split("T")[0];

    // 📎 EXTENSÃO
    const ext = (file.name.split(".").pop() || "png").toLowerCase();

    // 🧠 NOME FINAL
    const safeName = `${nome}_GER_${ger}_GED_${ged}_${dataHoje}.${ext}`;

    // 🚀 UPLOAD
    const blob = await put(`comprovantes/${safeName}`, file, {
      access: "public",
      token,
      contentType: file.type || undefined,
    });

    return NextResponse.json({
      ok: true,
      url: blob.url,
      name: blob.pathname,
      contentType: file.type,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 },
    );
  }
}
