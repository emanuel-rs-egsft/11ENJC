import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const url = process.env.SHEETS_WEBAPP_URL;

    if (!url) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Missing SHEETS_WEBAPP_URL",
        }),
        { status: 500 },
      );
    }

    // 🔥 ENVIA PRO APPS SCRIPT (COM URL DO BLOB)
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        comprovanteUrl: payload.comprovanteUrl,
        comprovanteName: payload.comprovanteName,
        comprovanteType: payload.comprovanteType,
      }),
    });

    const raw = await r.text();
    console.log("APPS SCRIPT:", raw);

    let out: any;
    try {
      out = JSON.parse(raw);
    } catch {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Resposta inválida do Apps Script",
          raw,
        }),
        { status: 500 },
      );
    }

    if (out?.status !== "ok") {
      return new Response(
        JSON.stringify({
          ok: false,
          error: out?.message || "Erro ao salvar",
        }),
        { status: 400 },
      );
    }

    // ✉️ EMAIL
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (payload.email) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: payload.email,
        subject: "Inscrição confirmada",
        html: `<p>Inscrição confirmada com sucesso!</p>`,
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        saved: true,
      }),
      { status: 200 },
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: String(err?.message || err),
      }),
      { status: 500 },
    );
  }
}
