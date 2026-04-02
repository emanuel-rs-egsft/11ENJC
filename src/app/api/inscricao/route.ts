import { Resend } from "resend";

function escapeHtml(s: string) {
  return (s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatBirth(iso: string) {
  if (!iso) return "";
  // iso YYYY-MM-DD
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function buildEmailHtml(payload: any) {
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";

  const nome = (payload?.nome || "").trim();
  const apelido = (payload?.apelido || "").trim();
  const firstName = (nome.split(" ")[0] || "").trim();
  const nomeJovem = apelido || firstName || "Jovem";

  const nascimento = formatBirth(payload?.nascimento || "");
  const whatsapp = payload?.whatsapp || "";
  const email = payload?.email || "";

  const endereco =
    `${payload?.rua || ""}, ${payload?.numero || ""} - ${payload?.bairro || ""} - ${payload?.cidade || ""}`.trim();

  const macro = payload?.macro || "";
  const ger = payload?.ger || "";
  const ged = payload?.ged || "";

  const servicoMcc = payload?.servicoMcc || "";
  const camiseta = payload?.camiseta || "";

  const alergiaTem = payload?.alergiaTem || "";
  const alergiaDesc = (payload?.alergiaDesc || "").trim();
  const restricaoTem = payload?.restricaoTem || "";
  const restricaoDesc = (payload?.restricaoDesc || "").trim();

  let restricaoAlergia = "Não informado";
  const parts: string[] = [];
  if (alergiaTem === "Não tenho!") parts.push("Alergia: não");
  if (alergiaTem === "Tenho!")
    parts.push(`Alergia: ${escapeHtml(alergiaDesc || "sim")}`);
  if (restricaoTem === "Não tenho!") parts.push("Restrição: não");
  if (restricaoTem === "Tenho!")
    parts.push(`Restrição: ${escapeHtml(restricaoDesc || "sim")}`);
  if (parts.length) restricaoAlergia = parts.join(" • ");

  // ✅ só imagem no rodapé à direita
  const footerRightImg = `${siteUrl}/email/11enjc.png`;

  // cores
  const C = {
    green: "#00CF83",
    purple: "#8D48EF",
    pink: "#F22AA8",
    blue: "#00A0FF",
    yellow: "#FFC300",
  };

  return `
  <!doctype html>
  <html lang="pt-BR">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Inscrição Confirmada</title>
    </head>

    <body style="margin:0;padding:0;background:#f6f6f6;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f6f6;padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0"
              style="width:600px;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,.08);">

              <!-- TOPO (texto roxo) -->
              <tr>
                <td style="padding:20px 22px;background:#ffffff;">
                  <div style="font-size:26px;font-weight:900;color:${C.purple};line-height:30px;letter-spacing:.2px;">
                    💚 SUA INSCRIÇÃO ESTÁ CONFIRMADA
                  </div>

                  <div style="margin-top:10px;font-size:18px;color:${C.purple};line-height:24px;">
                    Aaaah! Que alegria ter você com a gente! 🎉🔥
                  </div>
                </td>
              </tr>

              <!-- BLOCO VERDE -->
              <tr>
                <td style="background:${C.green};padding:18px 22px;color:#ffffff;">
                  <div style="font-size:16px;line-height:22px;">
                    <div style="margin-bottom:10px;">
                      Olá, <b>${escapeHtml(nomeJovem)}</b> 👋
                      <br/>
                      Recebemos sua inscrição no ENJC — Encontro Nacional para Jovens Cursilhistas e queremos te dizer:
                    </div>

                    <div style="font-size:16px;font-weight:900;color:${C.pink};margin:10px 0;">
                      👉 AGORA VOCÊ JÁ FAZ PARTE DESSE ENCONTRO!
                    </div>

                    <div>
                      Estamos muito felizes com a sua presença e confiantes de que Deus já está preparando algo grande pra vivermos juntos.
                    </div>
                  </div>
                </td>
              </tr>

              <!-- DADOS -->
              <tr>
                <td style="padding:18px 22px;background:#ffffff;">
                  <div style="font-size:18px;font-weight:900;color:${C.blue};margin:0 0 10px 0;">
                    📝 CONFIRA SEUS DADOS
                  </div>

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                    style="font-size:15px;line-height:22px;color:${C.blue};">
                    <tr><td style="padding:6px 0;"><b>😊 Como gosta de ser chamado(a):</b><br/>${escapeHtml(nomeJovem)}</td></tr>
                    <tr><td style="padding:6px 0;"><b>📅 Data de nascimento:</b><br/>${escapeHtml(nascimento)}</td></tr>
                    <tr><td style="padding:6px 0;"><b>📱 WhatsApp:</b><br/>${escapeHtml(whatsapp)}</td></tr>
                    <tr><td style="padding:6px 0;"><b>📩 E-mail:</b><br/>${escapeHtml(email)}</td></tr>
                    <tr><td style="padding:6px 0;"><b>📍 Endereço:</b><br/>${escapeHtml(endereco)}</td></tr>
                    <tr><td style="padding:6px 0;"><b>🌎 Macrorregião:</b><br/>${escapeHtml(macro)}</td></tr>
                    <tr><td style="padding:6px 0;"><b>⏱ GER:</b><br/>${escapeHtml(ger)}</td></tr>
                    <tr><td style="padding:6px 0;"><b>🏛 GED / Diocese:</b><br/>${escapeHtml(ged)}</td></tr>
                    <tr><td style="padding:6px 0;"><b>🤝 Forma de atuação no Movimento:</b><br/>${escapeHtml(servicoMcc)}</td></tr>
                    <tr><td style="padding:6px 0;"><b>👕 Tamanho da camiseta:</b><br/>${escapeHtml(camiseta)}</td></tr>
                    <tr><td style="padding:6px 0;"><b>🍽 Restrição / Alergia:</b><br/>${escapeHtml(restricaoAlergia)}</td></tr>
                  </table>
                </td>
              </tr>

              <!-- AJUDA (fundo azul + título amarelo) -->
              <tr>
                <td style="background:${C.blue};padding:18px 22px;color:#ffffff;">
                  <div style="font-size:16px;font-weight:900;color:${C.yellow};margin-bottom:8px;">
                    💬 PRECISA DE AJUDA?
                  </div>
                  <div style="font-size:15px;line-height:22px;">
                    Se tiver qualquer dúvida, é só entrar em contato com sua coordenação regional.
                    <br/><br/>
                    Estamos à disposição pra te ajudar no que for preciso 😊
                  </div>
                </td>
              </tr>

              <!-- RODAPÉ (texto roxo + imagem à direita) -->
              <tr>
                <td style="padding:18px 22px;background:#ffffff;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td valign="top" style="padding-right:12px;">
                        <div style="color:${C.purple};font-size:18px;font-weight:900;margin:0 0 8px 0;">
                          💚 NOS VEMOS LÁ!
                        </div>

                        <div style="color:${C.purple};font-size:14px;line-height:20px;">
                          Que Deus abençoe sua caminhada até o encontro.<br/>
                          Seguimos unidos em oração e na missão.
                          <br/><br/>
                          Com carinho,<br/>
                          <b>Equipe ENJC</b> ✝️💚
                        </div>
                      </td>

                      <td align="right" valign="bottom" width="220">
                        <img src="${footerRightImg}" alt="11º ENJC" width="200"
                          style="display:block;width:200px;max-width:200px;height:auto;border:0;" />
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>

            <div style="font-size:12px;color:#9a9a9a;line-height:18px;margin-top:12px;max-width:600px;">
              Você está recebendo este e-mail porque se inscreveu no 11º ENJC.
            </div>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

export async function POST(req: Request) {
  try {
    let payload: any = {};
    let file: File | null = null;

    const contentType = req.headers.get("content-type") || "";

    // 🔥 JSON (buscar pré-inscrição)
    if (contentType.includes("application/json")) {
      payload = await req.json();
    }

    // 🔥 FORMDATA (inscrição normal)
    else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      formData.forEach((value, key) => {
        if (key !== "file") {
          payload[key] = value;
        }
      });

      file = formData.get("file") as File | null;
    }

    // ❌ ERRO
    else {
      return new Response(
        JSON.stringify({ ok: false, error: "Content-Type inválido" }),
        { status: 400 },
      );
    }

    const action = String(payload?.action || "create");

    const url = process.env.SHEETS_WEBAPP_URL;
    if (!url) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing SHEETS_WEBAPP_URL" }),
        { status: 500 },
      );
    }

    let comprovanteUrl = "";
    let comprovanteName = payload.comprovanteName || "";
    let comprovanteType = payload.comprovanteType || "";

    // 🔥 SE TEM ARQUIVO → ENVIA PRO APPS SCRIPT (DRIVE)
    if (file) {
      const buffer = await file.arrayBuffer();
      const base64 = `data:${file.type};base64,${Buffer.from(buffer).toString("base64")}`;

      const driveRes = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "upload_comprovante",
          file: base64,
          mimeType: file.type,
          nome: payload.nome,
          ger: payload.ger,
          ged: payload.ged,
        }),
      });

      const driveOut = await driveRes.json();

      if (!driveOut?.ok) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: "Erro ao salvar comprovante no Drive",
          }),
          { status: 500 },
        );
      }

      comprovanteUrl = driveOut.url;
      comprovanteName = driveOut.nome;
      comprovanteType = file.type;
    }

    // 🔥 ENVIA PRA PLANILHA
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        comprovanteUrl,
        comprovanteName,
        comprovanteType,
      }),
    });

    const raw = await r.text();
    let out: any = null;

    try {
      out = JSON.parse(raw);
    } catch {
      out = { ok: false, error: "Resposta inválida", raw };
    }

    if (!r.ok || out?.status !== "ok") {
      return new Response(
        JSON.stringify({ ok: false, error: out?.error || "Erro no Sheets" }),
        { status: 400 },
      );
    }

    // 🔥 PRÉ INSCRIÇÃO
    const pagamento = String(payload?.pagamento || "");
    if (pagamento === "Pagar depois ⏰") {
      return new Response(
        JSON.stringify({ ok: true, saved: true, emailSent: false }),
        { status: 200 },
      );
    }

    // 🔥 ENVIO EMAIL (mantém seu código)
    const resendKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;

    if (!resendKey || !from) {
      return new Response(
        JSON.stringify({ ok: true, saved: true, emailSent: false }),
        { status: 200 },
      );
    }

    const resend = new Resend(resendKey);

    try {
      await resend.emails.send({
        from,
        to: String(payload.email),
        subject: `${payload.nome}, você está confirmado no ENJC!`,
        html: buildEmailHtml(payload),
      });

      return new Response(
        JSON.stringify({ ok: true, saved: true, emailSent: true }),
        { status: 200 },
      );
    } catch (err: any) {
      return new Response(
        JSON.stringify({
          ok: true,
          saved: true,
          emailSent: false,
          error: err.message,
        }),
        { status: 200 },
      );
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
    });
  }
}
