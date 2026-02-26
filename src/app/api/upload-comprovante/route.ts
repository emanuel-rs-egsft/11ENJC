import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // importante no Vercel

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "Missing file" },
        { status: 400 },
      );
    }

    // nome único (evita sobrescrever)
    const safeName = `${Date.now()}-${file.name}`.replace(/\s+/g, "-");

    const blob = await put(safeName, file, {
      access: "public",
    });

    return NextResponse.json({
      ok: true,
      url: blob.url,
      name: file.name,
      type: file.type,
      size: file.size,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 },
    );
  }
}
