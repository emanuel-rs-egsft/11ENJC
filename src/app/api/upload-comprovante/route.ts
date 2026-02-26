import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ✅ evita dor de cabeça

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

    // nome “limpo” opcional
    const safeName = (file.name || "comprovante")
      .replace(/\s+/g, "_")
      .replace(/[^\w.\-]/g, "_");

    const blob = await put(`comprovantes/${Date.now()}_${safeName}`, file, {
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
