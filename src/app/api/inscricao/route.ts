export async function POST(req: Request) {
  const payload = await req.json();

  const action = String(payload?.action || "create");

  const url = process.env.SHEETS_WEBAPP_URL!;

  // 🔥 BUSCAR PRÉ INSCRIÇÃO (NÃO SALVA)
  if (action === "buscar_pre_inscricao") {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const out = await r.json();

    return new Response(JSON.stringify(out), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 🔥 SALVAR INSCRIÇÃO
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const out = await r.json();

  if (!out || out.status !== "ok") {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Erro ao salvar",
      }),
      { status: 400 },
    );
  }

  return new Response(
    JSON.stringify({
      ok: true,
    }),
    { status: 200 },
  );
}
