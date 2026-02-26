"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import styles from "./InscricaoPopup.module.css";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file); // "data:image/png;base64,..."
  });
}

type StepId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

type Props = {
  open: boolean;
  step: StepId;

  onClose: () => void;
  onFinish: () => void; // ✅
  onNext: () => void;
  onBack?: () => void;
};

type FormData = {
  nome: string;
  apelido: string;
  nascimento: string; // YYYY-MM-DD
  whatsapp: string;
  email: string;

  rua: string;
  numero: string;
  bairro: string;
  cidade: string;

  macro: string;
  ger: string;
  ged: string;

  servicoMcc: string;
  cursilhoFez: string;

  alergiaTem: "" | "Tenho!" | "Não tenho!";
  alergiaDesc: string;

  restricaoTem: "" | "Tenho!" | "Não tenho!";
  restricaoDesc: string;

  camiseta: "" | "P" | "M" | "G" | "GG" | "EXG" | "EXGG";

  pagamento: "" | "Pix ⚡" | "Cartão 💳";

  comprovante: File | null;
  comprovanteUrl: string; // preview (ObjectURL)

  lgpdOk: boolean;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialData: FormData = {
  nome: "",
  apelido: "",
  nascimento: "",
  whatsapp: "",
  email: "",

  rua: "",
  numero: "",
  bairro: "",
  cidade: "",

  macro: "",
  ger: "",
  ged: "",

  servicoMcc: "",
  cursilhoFez: "",

  alergiaTem: "",
  alergiaDesc: "",
  restricaoTem: "",
  restricaoDesc: "",

  camiseta: "",

  pagamento: "",

  comprovante: null,
  comprovanteUrl: "",

  lgpdOk: false,
};

function cleanDigits(s: string) {
  return (s || "").replace(/\D/g, "");
}

function isValidEmail(s: string) {
  const v = (s || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v);
}

function isValidBirthDate(iso: string) {
  if (!iso) return false;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;

  // não pode ser no futuro
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d <= today;
}

export default function InscricaoPopup({
  open,
  step,
  onClose,
  onFinish,
  onNext,
  onBack,
}: Props) {
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const startedRef = useRef(false);

  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validateStep(stepId: StepId): FormErrors {
    const e: FormErrors = {};

    // Step 2: nome completo (nome + sobrenome)
    if (stepId === 2) {
      const nome = data.nome.trim();
      const words = nome.split(/\s+/).filter(Boolean);
      if (nome.length < 6 || words.length < 2) {
        e.nome = "Digite seu nome completo (nome + sobrenome).";
      }
    }

    // Step 3: apelido
    if (stepId === 3) {
      const a = data.apelido.trim();
      if (a.length < 2) e.apelido = "Digite como você gosta de ser chamado(a).";
    }

    // Step 4: nascimento
    if (stepId === 4) {
      if (!isValidBirthDate(data.nascimento)) {
        e.nascimento = "Informe uma data válida (não no futuro).";
      }
    }

    // Step 5: whatsapp (DDD + número 10/11 dígitos)
    if (stepId === 5) {
      const digits = cleanDigits(data.whatsapp);
      if (!(digits.length === 10 || digits.length === 11)) {
        e.whatsapp = "Digite um WhatsApp com DDD (ex: 51999999999).";
      }
    }

    // Step 6: email
    if (stepId === 6) {
      if (!isValidEmail(data.email)) e.email = "Digite um e-mail válido.";
    }

    // Step 7: endereço
    if (stepId === 7) {
      if (!data.rua.trim()) e.rua = "Preencha a rua.";
      if (!data.numero.trim()) e.numero = "Preencha o número.";
      if (!data.bairro.trim()) e.bairro = "Preencha o bairro.";
      if (!data.cidade.trim()) e.cidade = "Preencha a cidade.";
    }

    // Step 8: macro > ger > ged
    if (stepId === 8) {
      if (!data.macro.trim()) e.macro = "Selecione sua Macrorregional.";
      if (!data.ger.trim()) e.ger = "Selecione seu GER.";
      if (!data.ged.trim()) e.ged = "Selecione seu GED.";
    }

    // Step 9: servico mcc > Cursilho que fez
    if (stepId === 9) {
      const birthYear = data.nascimento
        ? new Date(data.nascimento).getFullYear()
        : 0;
      const canYoungRep = birthYear > 1996;

      if (!data.servicoMcc.trim()) {
        e.servicoMcc = "Selecione como você serve hoje no Movimento.";
      }

      if (data.servicoMcc === "Representante Jovem" && !canYoungRep) {
        e.servicoMcc =
          "Representante Jovem só está disponível para quem nasceu após 1996.";
      }

      if (data.servicoMcc.trim()) {
        const c = data.cursilhoFez.trim();
        if (c.length < 4) {
          e.cursilhoFez =
            "Descreva qual Cursilho você fez (ex: Jovem nº…, Adulto nº…).";
        }
      }
    }

    // ✅ Step 10 (AGORA NO LUGAR CERTO)
    if (stepId === 10) {
      if (!data.alergiaTem) {
        e.alergiaTem = "Escolha uma opção.";
      }

      if (data.alergiaTem === "Tenho!") {
        if (data.alergiaDesc.trim().length < 3) {
          e.alergiaDesc = "Descreva sua alergia (bem curtinho já serve).";
        }
      }

      const alergiaOk =
        data.alergiaTem === "Não tenho!" ||
        (data.alergiaTem === "Tenho!" && data.alergiaDesc.trim().length >= 3);

      // Só mostra/valida restrição quando alergiaOk
      if (alergiaOk) {
        if (!data.restricaoTem) {
          e.restricaoTem = "Escolha uma opção.";
        }

        if (data.restricaoTem === "Tenho!") {
          if (data.restricaoDesc.trim().length < 3) {
            e.restricaoDesc =
              "Descreva sua restrição alimentar (bem curtinho já serve).";
          }
        }
      }
    }

    // Step 11 - Selecionar Camiseta
    if (stepId === 11) {
      if (!data.camiseta) {
        e.camiseta = "Selecione um tamanho.";
      }
    }

    // Step 12 - Pagamento
    if (stepId === 12) {
      if (!data.pagamento) {
        e.pagamento = "Selecione uma forma de pagamento.";
      }
    }

    //Step 13 - Comprovante
    if (stepId === 13) {
      if (!data.comprovante) {
        e.comprovante = "Envie o print ou imagem do seu pagamento.";
      }
    }

    //Step 14 - LGPD
    if (stepId === 14) {
      if (!data.lgpdOk) {
        e.lgpdOk = "Você precisa concordar para continuar.";
      }
    }
    return e;
  }

  function canGoNext(stepId: StepId) {
    if (stepId === 1) return true;
    if (stepId === 15) return true;
    return Object.keys(validateStep(stepId)).length === 0;
  }

  function attemptNext() {
    if (step === 1) {
      onNext();
      return;
    }
    const e = validateStep(step);
    setErrors(e);
    if (Object.keys(e).length === 0) onNext();
  }

  function onEnterNext(
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    attemptNext();
  }

  async function submitInscricao() {
    if (isSubmitting || isSubmitted) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (!data.comprovante) {
        setErrors((prev) => ({
          ...prev,
          comprovante: "Envie o comprovante antes de concluir.",
        }));
        setIsSubmitting(false);
        return;
      }

      // 1) Upload do comprovante pro Blob
      const fd = new FormData();
      fd.append("file", data.comprovante);

      const up = await fetch("/api/upload-comprovante", {
        method: "POST",
        body: fd,
      });

      const upRaw = await up.text();
      let upOut: any = null;

      try {
        upOut = JSON.parse(upRaw);
      } catch {
        upOut = { ok: false, error: "Upload não retornou JSON", raw: upRaw };
      }

      if (!up.ok || !upOut?.ok || !upOut?.url) {
        setSubmitError(upOut?.error || "Falha ao enviar comprovante (upload)");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        nome: data.nome,
        apelido: data.apelido,
        nascimento: data.nascimento,
        whatsapp: data.whatsapp,
        email: data.email,

        rua: data.rua,
        numero: data.numero,
        bairro: data.bairro,
        cidade: data.cidade,

        macro: data.macro,
        ger: data.ger,
        ged: data.ged,

        servicoMcc: data.servicoMcc,
        cursilhoFez: data.cursilhoFez,

        alergiaTem: data.alergiaTem,
        alergiaDesc: data.alergiaDesc,
        restricaoTem: data.restricaoTem,
        restricaoDesc: data.restricaoDesc,

        camiseta: data.camiseta,
        pagamento: data.pagamento,

        lgpdOk: data.lgpdOk,

        // 👇 AGORA É URL (não base64)
        comprovanteUrl: upOut.url,
        comprovanteType: data.comprovante.type,
      };

      const res = await fetch("/api/inscricao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const raw = await res.text();
      let out: any = null;
      try {
        out = JSON.parse(raw);
      } catch {
        out = { ok: false, error: "Resposta não é JSON", raw };
      }

      if (!res.ok || !out?.ok) {
        setSubmitError(out?.error || "Erro desconhecido");
        setIsSubmitting(false);
        return;
      }

      // ✅ sucesso
      setIsSubmitted(true);
      setIsSubmitting(false);
    } catch (err) {
      setSubmitError("Erro ao enviar. Tenta de novo 🙏");
      setIsSubmitting(false);
    }
  }

  function finishAndReset() {
    setData(initialData);
    setErrors({});
    setIsSubmitted(false);
    setSubmitError(null);
    startedRef.current = false; // libera pra próxima inscrição
    onFinish();
  }
  // Step Final Concluindo e Conclusão...
  useEffect(() => {
    if (!open) return;

    // sempre que abrir o popup, reseta flags do submit
    if (step === 1) {
      setIsSubmitting(false);
      setIsSubmitted(false);
      setSubmitError(null);
      startedRef.current = false;
    }

    // ✅ entrou no step 15 -> envia automaticamente 1x
    if (step === 15 && !startedRef.current) {
      startedRef.current = true;
      submitInscricao();
    }
  }, [open, step]);

  //Envio de Comprovante
  useEffect(() => {
    return () => {
      if (data.comprovanteUrl) URL.revokeObjectURL(data.comprovanteUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ESC fecha
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();

      if (e.key === "Enter" && step === 15) {
        e.preventDefault();
        if (isSubmitted && !isSubmitting) finishAndReset();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, step, isSubmitting, isSubmitted]);

  // trava scroll do body
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // quando abrir modal, opcionalmente resetar erros
  useEffect(() => {
    if (!open) return;
    setErrors({});
  }, [open, step]);

  if (!open) return null;

  const nextDisabled = !canGoNext(step);

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Inscrição"
      >
        {/* HEADER fixo (nunca rola) */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <ProgressBar step={step} total={14} />
          </div>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Fechar"
          >
            <Image
              src="/assets/formulario/fechar.svg"
              alt=""
              fill
              className={styles.contain}
              priority
            />
          </button>
        </header>

        {/* BODY rolável (se precisar) */}
        <div className={styles.body} data-step={step}>
          {step === 1 && <StepBoasVindas />}

          {step === 2 && (
            <StepNome
              value={data.nome}
              error={errors.nome}
              onChange={(v) => setField("nome", v)}
              onEnterNext={onEnterNext}
            />
          )}

          {step === 3 && (
            <StepApelido
              value={data.apelido}
              error={errors.apelido}
              onChange={(v) => setField("apelido", v)}
              onEnterNext={onEnterNext}
            />
          )}

          {step === 4 && (
            <StepNascimento
              apelido={data.apelido || "meu amigo(a)"}
              value={data.nascimento}
              error={errors.nascimento}
              onChange={(v) => setField("nascimento", v)}
              onEnterNext={onEnterNext}
            />
          )}

          {step === 5 && (
            <StepWhatsapp
              value={data.whatsapp}
              error={errors.whatsapp}
              onChange={(v) => setField("whatsapp", v)}
              onEnterNext={onEnterNext}
            />
          )}

          {step === 6 && (
            <StepEmail
              value={data.email}
              error={errors.email}
              onChange={(v) => setField("email", v)}
              onEnterNext={onEnterNext}
            />
          )}

          {step === 7 && (
            <StepEndereco
              data={data}
              errors={errors}
              setField={setField}
              onEnterNext={onEnterNext}
            />
          )}

          {step === 8 && (
            <StepMccRelacao
              macro={data.macro}
              ger={data.ger}
              ged={data.ged}
              errMacro={errors.macro}
              errGer={errors.ger}
              errGed={errors.ged}
              onMacro={(v) => {
                setField("macro", v);
                setField("ger", "");
                setField("ged", "");
              }}
              onGer={(v) => setField("ger", v)}
              onGed={(v) => setField("ged", v)}
            />
          )}

          {step === 9 && (
            <StepServicoMcc
              apelido={data.apelido || "meu amigo(a)"}
              nascimento={data.nascimento}
              servico={data.servicoMcc}
              cursilhoFez={data.cursilhoFez}
              errServico={errors.servicoMcc}
              errCursilho={errors.cursilhoFez}
              onServico={(v) => {
                setField("servicoMcc", v);
                setField("cursilhoFez", ""); // limpa a pergunta 2 ao trocar serviço
              }}
              onCursilho={(v) => setField("cursilhoFez", v)}
              onEnterNext={onEnterNext}
            />
          )}

          {step === 10 && (
            <StepAlergiaRestricao
              alergiaTem={data.alergiaTem}
              alergiaDesc={data.alergiaDesc}
              restricaoTem={data.restricaoTem}
              restricaoDesc={data.restricaoDesc}
              errAlergiaTem={errors.alergiaTem}
              errAlergiaDesc={errors.alergiaDesc}
              errRestricaoTem={errors.restricaoTem}
              errRestricaoDesc={errors.restricaoDesc}
              onAlergiaTem={(v) => {
                setField("alergiaTem", v as any);
                setField("alergiaDesc", "");
                setField("restricaoTem", "");
                setField("restricaoDesc", "");
              }}
              onAlergiaDesc={(v) => setField("alergiaDesc", v)}
              onRestricaoTem={(v) => {
                setField("restricaoTem", v as any);
                setField("restricaoDesc", "");
              }}
              onRestricaoDesc={(v) => setField("restricaoDesc", v)}
              onEnterNext={onEnterNext}
            />
          )}

          {step === 11 && (
            <StepCamiseta
              value={data.camiseta}
              error={errors.camiseta}
              onChange={(v) => setField("camiseta", v as any)}
              onEnterNextAttempt={attemptNext}
            />
          )}

          {step === 12 && (
            <StepPagamento
              nome={data.apelido || data.nome.split(" ")[0] || "amigo(a)"}
              value={data.pagamento}
              error={errors.pagamento}
              onChange={(v) => setField("pagamento", v as any)}
              onEnterNextAttempt={attemptNext}
            />
          )}

          {step === 13 && (
            <StepComprovante
              nome={data.apelido || data.nome.split(" ")[0] || "amigo(a)"}
              fileName={data.comprovante?.name || ""}
              previewUrl={data.comprovanteUrl}
              error={errors.comprovante}
              onPick={(file, url) => {
                setField("comprovante", file);
                setField("comprovanteUrl", url);
              }}
              onEnterNextAttempt={attemptNext}
            />
          )}

          {step === 14 && (
            <StepLgpd
              checked={data.lgpdOk}
              error={errors.lgpdOk}
              onToggle={() => setField("lgpdOk", !data.lgpdOk)}
              onEnterNextAttempt={attemptNext}
            />
          )}

          {step === 15 && (
            <StepEncerramento
              nome={data.apelido || data.nome.split(" ")[0] || "amigo(a)"}
              mode={isSubmitted ? "done" : "pending"}
            />
          )}
        </div>

        {/* FOOTER fixo (nunca rola) */}
        <footer
          className={`${styles.footer} ${
            step === 1 || step === 15 ? styles.footerStart : styles.footerNav
          }`}
        >
          {step === 1 ? (
            <button
              type="button"
              className={`${styles.primaryBtn} ${styles.pulse}`}
              onClick={attemptNext}
              aria-label="Começar"
            >
              <span className={styles.primaryText}>Vaaaamos lá!</span>
            </button>
          ) : step === 15 ? (
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={finishAndReset}
              aria-label={isSubmitted ? "Concluir" : "Concluindo"}
              disabled={!isSubmitted || isSubmitting}
            >
              <span className={styles.primaryText}>
                {isSubmitting ? "Concluindo..." : "Concluir"}
              </span>

              {isSubmitting && (
                <span className={styles.spinner} aria-hidden="true" />
              )}
            </button>
          ) : (
            <>
              <button
                type="button"
                className={styles.navBtnLeft}
                onClick={onBack}
                aria-label="Voltar"
                disabled={!onBack}
              >
                <Image
                  src="/assets/formulario/anterior.svg"
                  alt=""
                  fill
                  className={styles.contain}
                />
              </button>

              <button
                type="button"
                className={styles.navBtnRight}
                onClick={attemptNext}
                aria-label="Próximo"
                disabled={nextDisabled}
              >
                <Image
                  src="/assets/formulario/proximo.svg"
                  alt=""
                  fill
                  className={styles.contain}
                />
              </button>
            </>
          )}
        </footer>
      </section>
    </div>
  );
}

/* =========================
   BARRA DE ROGRESSO
========================= */
function ProgressBar({ step, total }: { step: number; total: number }) {
  // Step 1 = 0% (começou agora)
  // Step 15 = 100%
  const pct = Math.max(0, Math.min(1, (step - 1) / (total - 1)));
  const width = `${pct * 100}%`;

  return (
    <div
      className={styles.progressWrap}
      aria-label={`Progresso: ${step} de ${total}`}
    >
      <div className={styles.progressTrack} aria-hidden="true">
        <div className={styles.progressFill} style={{ width }} />
      </div>

      {/* opcional (se quiser mostrar 2/15 bem pequeno) */}
      {/* <span className={styles.progressText}>{step}/{total}</span> */}
    </div>
  );
}

/* =========================
   STEP 01 (Boas vindas)
========================= */
function StepBoasVindas() {
  return (
    <div className={styles.step1Grid}>
      <div className={styles.step1Image} aria-hidden="true">
        <Image
          src="/assets/formulario/imagem-boasvindas.png"
          alt=""
          fill
          className={styles.cover}
          priority
        />
      </div>

      <div className={styles.step1Text}>
        <h2 className={styles.title}>Ei! Que alegria te ver aqui!!!</h2>

        <p className={styles.answer}>
          Você está dando mais um passo lindo na sua caminhada! 💛
          <br />
          <br />
          Prometemos que vai ser rapidinho… e cada resposta vai nos ajudar a
          preparar tudo com carinho pra você.
          <br />
          <br />
          Respira fundo… bora começar? 🔥
        </p>
      </div>
    </div>
  );
}

/* =========================
   STEP 02 — Nome completo
========================= */
function StepNome({
  value,
  error,
  onChange,
  onEnterNext,
}: {
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onEnterNext: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={styles.stepForm}>
      <h2 className={styles.formTitle}>
        Antes de qualquer coisa…
        <br />
        Me conta: qual é o seu nome completo, do jeitinho que está no documento?
      </h2>

      <div className={styles.field}>
        <input
          type="text"
          name="nome"
          placeholder="Escreva aqui o seu nome completo."
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onEnterNext}
          autoComplete="name"
        />
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

/* =========================
   STEP 03 — Apelido
========================= */
function StepApelido({
  value,
  error,
  onChange,
  onEnterNext,
}: {
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onEnterNext: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={styles.stepForm}>
      <h2 className={styles.formTitle}>
        E agora uma mais importante...
        <br />
        Como você gosta de ser chamado(a)?
      </h2>

      <div className={styles.field}>
        <input
          type="text"
          name="apelido"
          placeholder="Aquele nome que todo mundo usa quando te chama!"
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onEnterNext}
          autoComplete="nickname"
        />
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

/* =========================
   STEP 04 — Nascimento
========================= */
function StepNascimento({
  apelido,
  value,
  error,
  onChange,
  onEnterNext,
}: {
  apelido: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onEnterNext: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={styles.stepForm}>
      <h2 className={styles.formTitle}>
        Boa, {apelido}!
        <br />
        Pra gente te conhecer melhor… quando você nasceu?
      </h2>

      <div className={styles.field}>
        <input
          type="date"
          name="nascimento"
          className={styles.inputDate}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onEnterNext}
        />
        {error && <p className={styles.error}>{error}</p>}
      </div>

      <p className={styles.helper}>Data de nascimento (dia/mês/ano).</p>
    </div>
  );
}

/* =========================
   STEP 05 — WhatsApp
========================= */
function StepWhatsapp({
  value,
  error,
  onChange,
  onEnterNext,
}: {
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onEnterNext: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={styles.stepForm}>
      <h2 className={styles.formTitle}>
        Qual é o seu WhatsApp com DDD?
        <br />É por lá que a gente vai te avisar das novidades!
      </h2>

      <div className={styles.field}>
        <input
          type="tel"
          name="whatsapp"
          placeholder="(51) 99999-9999"
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onEnterNext}
          autoComplete="tel"
          inputMode="tel"
        />
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

/* =========================
   STEP 06 — Email
========================= */
function StepEmail({
  value,
  error,
  onChange,
  onEnterNext,
}: {
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onEnterNext: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={styles.stepForm}>
      <h2 className={styles.formTitle}>
        E seu melhor e-mail?
        <br />
        Prometemos não lotar sua caixa!
      </h2>

      <div className={styles.field}>
        <input
          type="email"
          name="email"
          placeholder="seuemail@exemplo.com"
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onEnterNext}
          autoComplete="email"
          inputMode="email"
        />
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

/* =========================
   STEP 07 — Endereço
========================= */
function StepEndereco({
  data,
  errors,
  setField,
  onEnterNext,
}: {
  data: FormData;
  errors: FormErrors;
  setField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onEnterNext: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={styles.stepForm}>
      <h2 className={styles.formTitle}>
        Agora me diz…
        <br />
        Qual é o seu endereço completo?
      </h2>

      <div className={styles.grid2}>
        <div className={styles.fieldSpan2}>
          <label className={styles.label}>
            Rua
            <input
              type="text"
              name="rua"
              placeholder="Ex: Av. Tavares de Lima"
              className={styles.input}
              autoComplete="address-line1"
              value={data.rua}
              onChange={(e) => setField("rua", e.target.value)}
              onKeyDown={onEnterNext}
            />
            {errors.rua && <p className={styles.error}>{errors.rua}</p>}
          </label>
        </div>

        <label className={styles.label}>
          Número
          <input
            type="text"
            name="numero"
            placeholder="Ex: 449"
            className={styles.input}
            inputMode="numeric"
            autoComplete="address-line2"
            value={data.numero}
            onChange={(e) => setField("numero", e.target.value)}
            onKeyDown={onEnterNext}
          />
          {errors.numero && <p className={styles.error}>{errors.numero}</p>}
        </label>

        <label className={styles.label}>
          Bairro
          <input
            type="text"
            name="bairro"
            placeholder="Ex: Centro"
            className={styles.input}
            autoComplete="address-level3"
            value={data.bairro}
            onChange={(e) => setField("bairro", e.target.value)}
            onKeyDown={onEnterNext}
          />
          {errors.bairro && <p className={styles.error}>{errors.bairro}</p>}
        </label>

        <label className={styles.label}>
          Cidade
          <input
            type="text"
            name="cidade"
            placeholder="Ex: Jundiaí/SP"
            className={styles.input}
            autoComplete="address-level2"
            value={data.cidade}
            onChange={(e) => setField("cidade", e.target.value)}
            onKeyDown={onEnterNext}
          />
          {errors.cidade && <p className={styles.error}>{errors.cidade}</p>}
        </label>
      </div>
    </div>
  );
}

/* =========================
   STEP 08 — MCC (macro > ger > ged)
========================= */
function norm(s: string) {
  try {
    return s
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim();
  } catch {
    return s.toLowerCase().trim();
  }
}

function uniqueSorted(list: string[]) {
  return Array.from(new Set(list)).sort((a, b) => a.localeCompare(b));
}

type SelectSearchProps = {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  onEnterNext?: () => void; // ✅ novo
};

function SelectSearch({
  label,
  placeholder,
  options,
  value,
  onChange,
  onEnterNext,
}: SelectSearchProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const filtered = useMemo(() => {
    const q = norm(query);
    const base = uniqueSorted(options);
    if (!q) return base;
    return base.filter((opt) => norm(opt).includes(q));
  }, [options, query]);

  useEffect(() => {
    if (value && value !== query) setQuery(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    function onDown(e: MouseEvent | TouchEvent) {
      const el = rootRef.current;
      if (!el) return;
      const target = e.target as Node | null;
      if (target && !el.contains(target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, []);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const list = listRef.current;
    if (!list) return;
    const item = list.querySelector<HTMLElement>(`[data-idx="${activeIndex}"]`);
    if (!item) return;

    const itemTop = item.offsetTop;
    const itemBottom = itemTop + item.offsetHeight;

    const viewTop = list.scrollTop;
    const viewBottom = viewTop + list.clientHeight;

    if (itemTop < viewTop) list.scrollTop = itemTop;
    else if (itemBottom > viewBottom)
      list.scrollTop = itemBottom - list.clientHeight;
  }, [activeIndex, open]);

  function commit(opt: string) {
    onChange(opt);
    setQuery(opt);
    setOpen(false);
    setActiveIndex(-1);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      setActiveIndex(0);
      return;
    }

    // ✅ Enter com dropdown fechado = avançar
    if (!open && e.key === "Enter") {
      e.preventDefault();
      onEnterNext?.();
      return;
    }

    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < 0 ? 0 : Math.min(i + 1, filtered.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && filtered[activeIndex])
        commit(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div className={styles.selectBlock} ref={rootRef}>
      <div className={styles.selectLabel}>{label}</div>

      <div className={styles.selectWrapper}>
        <div className={styles.inputWrap} data-open={open ? "1" : "0"}>
          <input
            type="text"
            className={`${styles.input} ${styles.inputWithIcon}`}
            value={query}
            placeholder={placeholder}
            autoComplete="off"
            onFocus={() => {
              setOpen(true);
              setActiveIndex((i) => (i < 0 ? 0 : i));
            }}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown}
            aria-expanded={open}
            aria-autocomplete="list"
          />

          <span className={styles.chevron} aria-hidden="true" />
        </div>

        {open && (
          <div className={styles.dropdown} ref={listRef} role="listbox">
            {filtered.length > 0 ? (
              filtered.map((opt, idx) => (
                <button
                  type="button"
                  key={opt}
                  className={`${styles.option} ${idx === activeIndex ? styles.optionActive : ""}`}
                  data-idx={idx}
                  role="option"
                  aria-selected={idx === activeIndex}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => commit(opt)}
                >
                  {opt}
                </button>
              ))
            ) : (
              <div className={styles.empty}>Nenhuma opção encontrada 😅</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StepMccRelacao({
  macro,
  ger,
  ged,
  errMacro,
  errGer,
  errGed,
  onMacro,
  onGer,
  onGed,
}: {
  macro: string;
  ger: string;
  ged: string;
  errMacro?: string;
  errGer?: string;
  errGed?: string;
  onMacro: (v: string) => void;
  onGer: (v: string) => void;
  onGed: (v: string) => void;
}) {
  const MACROS = uniqueSorted([
    "Macrorregião Centro-Oeste",
    "Macrorregião Nordeste",
    "Macrorregião Norte",
    "Macrorregião Sudeste",
    "Macrorregião Sul",
  ]);

  const GER_BY_MACRO: Record<string, string[]> = {
    "Macrorregião Centro-Oeste": [
      "GER CENTRO-OESTE",
      "GER OESTE 2",
      "GER OESTE 1",
    ],
    "Macrorregião Norte": ["GER NORTE 1 E 2", "GER NORDESTE 3 NORTE 5"],
    "Macrorregião Nordeste": [
      "GER NORDESTE 3 NORTE 5",
      "GER NORDESTE 2",
      "GER NORDESTE 3.1",
      "GER NORDESTE 3.2",
      "GER NORDESTE 1",
      "GER NORDESTE 5 NORTE 3",
      "GER NORDESTE 4",
    ],
    "Macrorregião Sul": [
      "GER SUL 3 RS 1",
      "GER SUL 3 RS 2",
      "GER SUL 4",
      "GER SUL 2 PARANÁ 1",
      "GER SUL 2 PARANÁ 2",
    ],
    "Macrorregião Sudeste": [
      "GER LESTE 3 ESPÍRITO SANTO",
      "GER LESTE 2 MINAS GERAIS 1",
      "GER LESTE 2 MINAS GERAIS 2",
      "GER LESTE 1 RIO DE JANEIRO",
      "GER SUL 1 SÃO PAULO",
      "GER SUL 1 APARECIDA",
      "SUL 1 BOTUCATU",
      "SUL 1 CAMPINAS",
      "SUL 1 RIBEIRÃO PRETO",
      "GER SUL 1 SÃO JOSÉ DO RIO PRETO",
      "GER SUL 1 SOROCABA",
    ],
  };

  const GED_BY_MACRO: Record<string, string[]> = {
    "Macrorregião Centro-Oeste": [
      "GED ANÁPOLIS",
      "GED BRASÍLIA",
      "GED IPAMERI",
      "GED ITUMBIARA",
      "GED JATAÍ",
      "GED GOIÂNIA",
      "GED SÃO LUIS DOS MONTES BELOS",
      "GED TAGUATINGA",
      "GED UNAI",
      "GED BARRA DOS GARÇAS",
      "GED CUIABÁ",
      "GED PRIMAVERA‐PARANATINGA",
      "GED RONDONÓPOLIS‐GUIRATINGA",
      "GED SÃO LUIZ DE CÁCERES",
      "GED CAMPO GRANDE",
      "GED DOURADOS",
      "GED NAVIRAÍ",
      "GED COXIM",
    ],
    "Macrorregião Norte": [
      "GED MACAPÁ",
      "GED PARINTIS",
      "GED BELÉM",
      "GED BRAGANÇA",
      "GED SANTARÉM",
      "GED IMPERATRIZ",
      "GED RIO ARAGUAINA",
      "GED TOCANTINÓPOLIS",
    ],
    "Macrorregião Nordeste": [
      "GED MACEIÓ",
      "GED PALMEIRA DOS ÍNDIOS",
      "GED SENHOR DO BOMFIM",
      "GED SALVADOR",
      "GED FEIRA DE SANTANA",
      "GED PAULO AFONSO",
      "GED SERRINHA",
      "GED EUNÁPOLIS",
      "GED ILHÉUS",
      "GED ITABUNA",
      "GED JEQUIÉ",
      "GED TEIXEIRA DE FREITAS",
      "GED VITÓRIA DA CONQUISTA",
      "GED FORTALEZA",
      "GED IGUATU",
      "GED CRATO",
      "GED QUIXADÁ",
      "GED IMPERATRIZ",
      "GED RIO ARAGUAINA",
      "GED TOCANTINÓPOLIS",
      "GED PATOS",
      "GED CAMPINA GRANDE",
      "GED RECIFE | OLINDA",
      "GED DE CARUARU",
      "GED DE GARANHUS",
      "GED TERESINA",
      "GED MOSSORÓ",
      "GED ARACAJÚ",
      "GED ESTÂNCIA",
    ],
    "Macrorregião Sul": [
      "GED CASCAVEL",
      "GED FOZ DE IGUAÇU",
      "GED GUARAPUAVA",
      "GED PALMAS DE FRANCISCO BELTRÃO",
      "GED PONTA GROSSA",
      "GED SÃO JOSÉ DOS PINHAIS",
      "GED TOLEDO",
      "GED UNIÃO DA VITÓRIA",
      "GED APUCARANA",
      "GED CORNÉLIO PROCÓPIO",
      "GED JACAREZINHO",
      "GED MARINGÁ",
      "GED PARANAVAI",
      "GED UMUARANA",
      "GED CAMPO MOURÃO",
      "GED BLUMENAU",
      "GED CAÇADOR",
      "GED CRICIÚMA",
      "GED FLORIANÓPOLIS",
      "GED JOINVILE",
      "GED RIO DO SUL",
      "GED TUBARÃO",
      "GED OSÓRIO",
      "GED PORTO ALEGRE",
      "GED VACARIA",
      "GED PASSO FUNDO",
      "GED NOVO HUMBURGO",
      "GED MONTENEGRO",
      "GED FREDERICO WESTPHALEN",
      "GED EREXIM",
      "GED CAXIAS DO SUL",
      "GED CRUZ ALTA",
      "GED SANTA CRUZ DO SUL",
      "GED URUGUAIANA",
      "GED CACHOEIRA DO SUL",
      "GED SANTA MARIA",
      "GED PELOTAS",
      "GED SANTO ÂNGELO",
    ],
    "Macrorregião Sudeste": [
      "GED CACHOEIRO DE ITAPEMIRIM",
      "GED COLATINA",
      "GED SÃO MATEUS",
      "GED VITÓRIA",
      "GED MONTES CLAROS",
      "GED OLIVEIRA",
      "GED PATOS DE MINAS",
      "GED SETE LAGOAS",
      "GED TEOFILO OTONI",
      "GED BELO HORIZONTE",
      "GED DIVINÓPOLIS",
      "GED GOVERNADOR VALADARES",
      "GED GUAXUPÉ",
      "GED ITUIUTABA",
      "GED LUZ",
      "GED UBERABA",
      "GED UBERLÂNDIA",
      "GED DA CAMPANHA",
      "GED LEOPOLDINA",
      "GED JUIZ DE FORA",
      "GED MARIANA",
      "GED POUSO ALEGRE",
      "GED SÃO JOÃO DEL REI",
      "GED CAMPOS",
      "GED RIO DE JANEIRO",
      "GED VALENÇA",
      "GED PETRÓPOLIS",
      "GED BARRA DO PIRAÍ/VOLTA REDONDA",
      "GED NITERÓI",
      "GED CAXIAS",
      "GED NOVA IGUAÇU",
      "GED ITAGUAI",
      "GED LAPA",
      "GED APARECIDA",
      "GED SÃO JOSÉ DOS CAMPOS",
      "GED ARAÇATUBA",
      "GED BARURU",
      "GED BOTUCATU",
      "GED LINS",
      "GED OURINHOS",
      "GED PRESIDENTE PRUDENTE",
      "GED JUNDIAÍ",
      "GED PIRACICABA",
      "GED CAMPINAS",
      "GED SÃO CARLOS",
      "GED BRAGANÇA",
      "GED FRANCA",
      "GED JABOTICABAL",
      "GED RIBEIRÃO PRETO",
      "GED SÃO JOSÉ DO RIO PRETO",
      "GED JALES",
      "GED BARRETOS",
      "GED BARRETOS VOTUPORANGA",
      "GED ITAPETININGA",
      "GED SOROCABA",
    ],
  };

  const gerOptions = useMemo(
    () => uniqueSorted(GER_BY_MACRO[macro] ?? []),
    [macro],
  );
  const gedOptions = useMemo(
    () => uniqueSorted(GED_BY_MACRO[macro] ?? []),
    [macro],
  );

  return (
    <div className={styles.stepForm}>
      <h2 className={styles.formTitle}>
        Agora queremos saber mais sobre sua relação com o MCC...
        <br />
        Qual é a sua Macrorregional?
      </h2>

      <div className={styles.field}>
        <SelectSearch
          label="Macrorregional"
          placeholder="Digite para buscar…"
          options={MACROS}
          value={macro}
          onChange={(v) => onMacro(v)}
        />
        {errMacro && <p className={styles.error}>{errMacro}</p>}
      </div>

      {macro && (
        <>
          <h2 className={`${styles.formTitle} ${styles.formTitleStack}`}>
            E o seu GER?
          </h2>

          <div className={styles.field}>
            <SelectSearch
              label="GER"
              placeholder="Digite para buscar…"
              options={gerOptions}
              value={ger}
              onChange={(v) => onGer(v)}
            />
            {errGer && <p className={styles.error}>{errGer}</p>}
          </div>
        </>
      )}

      {macro && ger && (
        <>
          <h2 className={`${styles.formTitle} ${styles.formTitleStack}`}>
            E o seu GED?
          </h2>

          <div className={styles.field}>
            <SelectSearch
              label="GED"
              placeholder="Digite para buscar…"
              options={gedOptions}
              value={ged}
              onChange={(v) => onGed(v)}
            />
            {errGed && <p className={styles.error}>{errGed}</p>}
          </div>
        </>
      )}
    </div>
  );
}

/* =========================
   STEP 09 — MCC (Funcao > Cursilho que fez)
========================= */
function StepServicoMcc({
  apelido,
  nascimento,
  servico,
  cursilhoFez,
  errServico,
  errCursilho,
  onServico,
  onCursilho,
  onEnterNext,
}: {
  apelido: string;
  nascimento: string; // YYYY-MM-DD
  servico: string;
  cursilhoFez: string;
  errServico?: string;
  errCursilho?: string;
  onServico: (v: string) => void;
  onCursilho: (v: string) => void;
  onEnterNext: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  const birthYear = nascimento ? new Date(nascimento).getFullYear() : 0;
  const canYoungRep = birthYear > 1996;

  // opções (Representante Jovem só entra se permitido)
  const serviceOptions = uniqueSorted(
    [
      "Coordenador(a)",
      "Vice-coordenador(a)",
      "Assessor(a) Eclesiástico",
      canYoungRep ? "Representante Jovem" : null,
    ].filter(Boolean) as string[],
  );

  return (
    <div className={styles.stepForm}>
      <h2 className={styles.formTitle}>
        Muito bom, {apelido}!
        <br />
        Agora me conta: como você serve hoje dentro do Movimento?
      </h2>

      <div className={styles.field}>
        <SelectSearch
          label="Como você serve hoje"
          placeholder="Digite para buscar…"
          options={serviceOptions}
          value={servico}
          onChange={(v) => onServico(v)}
        />
        {errServico && <p className={styles.error}>{errServico}</p>}

        {!canYoungRep && (
          <p className={styles.helper}>
            “Representante Jovem” só aparece para quem nasceu após 1996.
          </p>
        )}
      </div>

      {/* Pergunta 2 aparece depois da seleção */}
      {servico && (
        <>
          <h2 className={`${styles.formTitle} ${styles.formTitleStack}`}>
            Qual foi o Cursilho que você fez?
          </h2>

          <div className={styles.field}>
            <input
              type="text"
              className={styles.input}
              placeholder="Ex: Jovem nº…, Adulto nº…"
              value={cursilhoFez}
              onChange={(e) => onCursilho(e.target.value)}
              onKeyDown={onEnterNext}
              autoComplete="off"
            />
            {errCursilho && <p className={styles.error}>{errCursilho}</p>}
          </div>
        </>
      )}
    </div>
  );
}

/* =========================
   STEP 10 — Alegria e Restricao Alimentar
========================= */

function StepAlergiaRestricao({
  alergiaTem,
  alergiaDesc,
  restricaoTem,
  restricaoDesc,
  errAlergiaTem,
  errAlergiaDesc,
  errRestricaoTem,
  errRestricaoDesc,
  onAlergiaTem,
  onAlergiaDesc,
  onRestricaoTem,
  onRestricaoDesc,
  onEnterNext,
}: {
  alergiaTem: "" | "Tenho!" | "Não tenho!";
  alergiaDesc: string;
  restricaoTem: "" | "Tenho!" | "Não tenho!";
  restricaoDesc: string;

  errAlergiaTem?: string;
  errAlergiaDesc?: string;
  errRestricaoTem?: string;
  errRestricaoDesc?: string;

  onAlergiaTem: (v: "" | "Tenho!" | "Não tenho!") => void;
  onAlergiaDesc: (v: string) => void;
  onRestricaoTem: (v: "" | "Tenho!" | "Não tenho!") => void;
  onRestricaoDesc: (v: string) => void;

  onEnterNext: (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}) {
  const SIM_NAO = ["Tenho!", "Não tenho!"];

  const alergiaOk =
    alergiaTem === "Não tenho!" ||
    (alergiaTem === "Tenho!" && alergiaDesc.trim().length >= 3);

  return (
    <div className={styles.stepForm}>
      {/* Pergunta 1 (padrão) */}
      <h2 className={styles.formTitle}>
        Agora uma parte importante!
        <br />
        Você tem alguma alergia que a gente precisa saber?
      </h2>

      <div className={styles.field}>
        <SelectSearch
          label="" // ✅ remove “Alergia” em cima
          placeholder="Selecione…"
          options={SIM_NAO}
          value={alergiaTem}
          onChange={(v) => onAlergiaTem(v as any)}
        />
        {errAlergiaTem && <p className={styles.error}>{errAlergiaTem}</p>}
      </div>

      {alergiaTem === "Tenho!" && (
        <div className={styles.field}>
          <input
            className={styles.input}
            value={alergiaDesc}
            onChange={(e) => onAlergiaDesc(e.target.value)}
            onKeyDown={onEnterNext}
            placeholder="Descreva sua alergia (ex: camarão, lactose, etc.)"
            autoComplete="off"
          />
          {errAlergiaDesc && <p className={styles.error}>{errAlergiaDesc}</p>}
        </div>
      )}

      {/* Pergunta 2 (mesmo padrão da 1) */}
      {alergiaOk && (
        <>
          <h2 className={styles.formTitle}>
            Você tem alguma restrição alimentar?
          </h2>

          <div className={styles.field}>
            <SelectSearch
              label="" // ✅ remove “Restrição alimentar” em cima
              placeholder="Selecione…"
              options={SIM_NAO}
              value={restricaoTem}
              onChange={(v) => onRestricaoTem(v as any)}
            />
            {errRestricaoTem && (
              <p className={styles.error}>{errRestricaoTem}</p>
            )}
          </div>

          {restricaoTem === "Tenho!" && (
            <div className={styles.field}>
              <input
                className={styles.input}
                value={restricaoDesc}
                onChange={(e) => onRestricaoDesc(e.target.value)}
                onKeyDown={onEnterNext}
                placeholder="Descreva sua restrição (ex: sem glúten, vegetariano, etc.)"
                autoComplete="off"
              />
              {errRestricaoDesc && (
                <p className={styles.error}>{errRestricaoDesc}</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* =========================
   STEP 11 — Camiseta
========================= */
function StepCamiseta({
  value,
  error,
  onChange,
  onEnterNextAttempt,
}: {
  value: "" | "P" | "M" | "G" | "GG" | "EXG" | "EXGG";
  error?: string;
  onChange: (v: "" | "P" | "M" | "G" | "GG" | "EXG" | "EXGG") => void;
  onEnterNextAttempt: () => void;
}) {
  const OPTIONS = ["P", "M", "G", "GG", "EXG", "EXGG"];

  return (
    <div className={styles.stepForm}>
      <h2 className={styles.formTitle}>
        Bora escolher tua camiseta!
        <br />
        Qual tamanho você usa?
      </h2>

      <div className={styles.field}>
        <SelectSearch
          label="" // ✅ sem “label” em cima
          placeholder="Selecione…"
          options={OPTIONS}
          value={value}
          onChange={(v) => onChange(v as any)}
          onEnterNext={onEnterNextAttempt} // ✅ Enter avança
        />
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

/* =========================
   STEP 12 — Pagamento
========================= */
function StepPagamento({
  nome,
  value,
  error,
  onChange,
  onEnterNextAttempt,
}: {
  nome: string;
  value: "" | "Pix ⚡" | "Cartão 💳";
  error?: string;
  onChange: (v: "" | "Pix ⚡" | "Cartão 💳") => void;
  onEnterNextAttempt: () => void;
}) {
  const OPTIONS = ["Pix ⚡", "Cartão 💳"];

  return (
    <div className={styles.stepForm}>
      <h2 className={styles.formTitle}>
        Estamos quase no final, {nome}!
        <br />
        Qual forma de pagamento você prefere?
      </h2>

      <div className={styles.field}>
        <SelectSearch
          label="" // sem label em cima
          placeholder="Selecione…"
          options={OPTIONS}
          value={value}
          onChange={(v) => onChange(v as any)}
          onEnterNext={onEnterNextAttempt} // Enter avança
        />
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

/* =========================
   STEP 13 — Comprovante
========================= */
function StepComprovante({
  nome,
  fileName,
  previewUrl,
  error,
  onPick,
  onEnterNextAttempt,
}: {
  nome: string;
  fileName: string;
  previewUrl: string;
  error?: string;
  onPick: (file: File | null, url: string) => void;
  onEnterNextAttempt: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function openPicker() {
    inputRef.current?.click();
  }

  function handleFile(f: File | null) {
    if (!f) return;

    // aceita imagem (print/foto)
    if (!f.type.startsWith("image/")) {
      onPick(null, "");
      return;
    }

    // cria preview
    const url = URL.createObjectURL(f);
    onPick(f, url);
  }

  return (
    <div className={styles.stepForm}>
      <h2 className={styles.formTitle}>
        Estamos quase lá, {nome}!
        <br />
        Agora é só enviar o comprovante (pode ser print ou imagem)
      </h2>

      {/* input invisível */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.fileInputHidden}
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          handleFile(f);
          // permite escolher o mesmo arquivo novamente
          e.currentTarget.value = "";
        }}
      />

      {/* card clicável */}
      <div className={styles.uploadArea}>
        <button
          type="button"
          className={styles.uploadCard}
          onClick={openPicker}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              openPicker();
            }
          }}
          aria-label={fileName ? "Trocar comprovante" : "Enviar comprovante"}
        >
          <span className={styles.uploadIcon} aria-hidden="true">
            {/* se você estiver usando <img> pro svg, mantém assim */}
            <img
              src="/assets/formulario/upload.svg"
              alt=""
              className={styles.uploadSvg}
            />
          </span>

          <div className={styles.uploadText}>
            <div className={styles.uploadTitle}>
              Envie o print ou imagem do seu pagamento
            </div>
            <div className={styles.uploadSub}>
              {fileName
                ? `Selecionado: ${fileName}`
                : "Clique aqui para selecionar um arquivo"}
            </div>
          </div>
        </button>

        {fileName && (
          <button
            type="button"
            className={styles.changeBtn}
            onClick={openPicker}
            aria-label="Trocar imagem"
          >
            Trocar imagem
          </button>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {/* preview opcional */}
      {previewUrl && (
        <div className={styles.previewWrap}>
          <Image
            src={previewUrl}
            alt="Prévia do comprovante"
            width={520}
            height={320}
            className={styles.previewImg}
          />
        </div>
      )}

      {/* Enter para tentar avançar (depois que já anexou) */}
      {fileName && (
        <button
          type="button"
          className={styles.hiddenEnterCatcher}
          onClick={onEnterNextAttempt}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onEnterNextAttempt();
            }
          }}
        />
      )}
    </div>
  );
}

/* =========================
   STEP 14 — LGPD
========================= */

function StepLgpd({
  checked,
  error,
  onToggle,
  onEnterNextAttempt,
}: {
  checked: boolean;
  error?: string;
  onToggle: () => void;
  onEnterNextAttempt: () => void;
}) {
  return (
    <div className={styles.stepForm}>
      <h2 className={styles.formTitle}>
        Seus dados estão seguros com a gente 🔒💛
      </h2>

      <p className={styles.answer}>
        Ao continuar, você concorda que suas informações serão usadas apenas
        para organização e comunicação do evento, conforme a LGPD.
      </p>

      <button
        type="button"
        className={styles.checkRow}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onEnterNextAttempt(); // ✅ Enter tenta avançar
          }
          if (e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            onToggle(); // espaço alterna
          }
        }}
        aria-pressed={checked}
      >
        <span className={styles.checkBox} data-checked={checked ? "1" : "0"}>
          {checked ? "☑️" : "⬜"}
        </span>
        <span className={styles.checkText}>Concordo</span>
      </button>

      {error && <p className={styles.error}>{error}</p>}

      {/* dica opcional */}
      {!checked && (
        <p className={styles.helper}>Marque “Concordo” para continuar.</p>
      )}
    </div>
  );
}

/* =========================
   STEP 15 — ENCERRAMENTO
========================= */

function StepEncerramento({
  nome,
  mode,
}: {
  nome: string;
  mode: "pending" | "done";
}) {
  return (
    <div className={styles.step1Grid}>
      <div className={styles.step1Image} aria-hidden="true">
        <Image
          src="/assets/formulario/imagem-boasvindas.png"
          alt=""
          fill
          className={styles.cover}
          priority
        />
      </div>

      <div className={styles.step1Text}>
        {mode === "pending" ? (
          <>
            <h2 className={styles.title}>
              CALMAA! ⏳💛
              <br />
              <br />
              {nome}, aguarde...
            </h2>

            <p className={styles.answer}>
              Estamos analisando os seus dados e já vamos confirmar sua
              inscrição! 🙏✨
            </p>
          </>
        ) : (
          <>
            <h2 className={styles.title}>
              AAAAH! 🎉🔥
              <br />
              <br />
              {nome}, sua inscrição está confirmada!
            </h2>

            <p className={styles.answer}>
              Agora é preparar o coração… porque Deus já está preparando algo
              grande pra você 🙏💛
              <br />
              <br />
              Em breve enviaremos mais informações no seu E-mail.
              <br />
              <br />
              Nos vemos lá!
            </p>
          </>
        )}
      </div>
    </div>
  );
}
