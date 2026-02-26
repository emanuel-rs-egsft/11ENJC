import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // importante (file upload)

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Missing file" },
        { status: 400 },
      );
    }

    // nome “seguro”
    const safeName = (file.name || "comprovante")
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9._-]/g, "");

    // salva no Blob
    const blob = await put(`comprovantes/${Date.now()}_${safeName}`, file, {
      access: "public",
    });

    return NextResponse.json({
      ok: true,
      url: blob.url,
      pathname: blob.pathname,
      contentType: file.type || "",
      size: file.size || 0,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 },
    );
  }
}
