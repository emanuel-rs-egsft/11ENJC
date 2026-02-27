"use client";

import Image from "next/image";
import styles from "./Duvidas.module.css";
import { useMemo, useState } from "react";

import DuvidasHandwrite from "@/components/ui/Duvidas/DuvidasHandwrite";

import UnderlineAmarelaDrawn from "@/components/ui/DrawnEfeitos/UnderlineAmarelo";
import SetaRoxaDrawn from "@/components/ui/DrawnEfeitos/SetaRoxaDrawn";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M6 9l6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Duvidas() {
  const faqs = useMemo(
    () => [
      {
        q: "O que é o ENJC?",
        a: `O Encontro Nacional para Jovens Cursilhistas (ENJC) é um momento de formação, espiritualidade, partilha e vivência da missão.

É um encontro pensado por jovens e para jovens, que vivem o Cursilho e assumem, com alegria, a missão de evangelizar os ambientes. `,
      },
      {
        q: "Quem pode participar do ENJC?",
        a: `O ENJC é destinado aos jovens que atuam nos GERs e GEDs, de modo especial:

• Representantes Jovens Regionais
• Representantes Jovens Diocesanos
• Representantes Jovens das Macro-regiões
• Coordenadores, Vice-coordenadores ou Assessores Jovens dos GERs

Cada jovem participa representando sua realidade e sua caminhada dentro do MCC.`,
      },
      {
        q: "Como funcionam as vagas?",
        a: `Inicialmente, cada GER recebe um número definido de vagas.
Caso sobrem vagas, elas poderão ser redistribuídas para os GERs que demonstrarem interesse, sempre buscando a unidade e a participação de todos.`,
      },
      {
        q: "O ENJC é um retiro?",
        a: `Não. O ENJC não é um retiro, mas sim um encontro formativo e missionário.
Teremos momentos de oração, sim, mas também oficinas, dinâmicas, partilhas e muita interação entre os jovens cursilhistas de todo o Brasil.`,
      },
      {
        q: "O que teremos durante o ENJC?",
        a: `Durante o encontro, os jovens irão vivenciar:

✝️ Momentos de oração e reflexão
🧠 Oficinas formativas e dinâmicas
🤝 Interação entre jovens de diferentes regiões
💬 Partilhas de experiências e realidades
🎁 Brindes e lembranças especiais

Tudo isso com o objetivo de fortalecer a fé, a missão e a unidade.`,
      },
      {
        q: "Qual é o principal objetivo do ENJC?",
        a: `O ENJC tem como objetivo formar, animar e fortalecer os jovens cursilhistas, para que voltem às suas dioceses ainda mais comprometidos com:

• A vivência do Cursilho
• A evangelização dos ambientes
• O serviço na Igreja e no MCC`,
      },
      {
        q: "Como faço minha inscrição?",
        a: `A inscrição será feita pelo botão “Inscreva-se” aqui no site.
Após preencher o formulário, todas as informações serão analisadas conforme a organização do evento e a distribuição das vagas.`,
      },
      {
        q: "Onde será realizado o ENJC?",
        a: `O 11º ENJC será realizado na Casa Congregação das Irmãs Agostinianas Missionárias

• Diocese de Jundiai
• Rua Josué Zambom, 150 – Colônia 13219-801
• JUNDIAÍ – SP

Observações Importantes:
Dê preferencia ao aeroporto Viracopos - distancia 45 km facil acesso`,
      },
      {
        q: "Por que participar do ENJC?",
        a: `Porque o ENJC é:

💚 Encontro
🔥 Formação
✝️ Espiritualidade
🤝 Unidade
🚀 Missão

É uma oportunidade única de viver a alegria de ser jovem cursilhista, fortalecer a caminhada e voltar pra casa com o coração cheio de vontade de anunciar o Evangelho.`,
      },
    ],
    [],
  );

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className={styles.stage}
      aria-label="Dúvidas frequentes"
      id="duvidas"
    >
      {/* BG cobrindo 100% */}
      <Image
        src="/assets/duvidas/bg-texture.png"
        alt=""
        fill
        priority
        className={styles.bg}
      />

      {/* Canvas do Figma (escalado quando necessário) */}
      <div className={styles.canvas}>
        {/* Decorações (absolutas, não interferem no fluxo) */}
        {/*UNDERLINE AMARELO*/}
        <div
          className={`${styles.underlineAmarelo} float-soft`}
          style={
            {
              "--float-dur": "1.3s",
              "--float-delay": "-1.1s",
              "--float-dist": "-10px",
            } as any
          }
          aria-hidden="true"
        >
          <UnderlineAmarelaDrawn
            className={styles.svgFill}
            drawDelay={0.25}
            drawDuration={1.2}
            strokeWidth={1}
          />
        </div>

        {/*SETA ROXA*/}
        <div
          className={`${styles.setaRoxa} float-pop`}
          style={
            {
              "--float-dur": "0.65s",
              "--float-delay": "-1.8s",
              "--float-dist": "-18px",
            } as any
          }
          aria-hidden="true"
        >
          <SetaRoxaDrawn
            className={styles.svgFill}
            drawDelay={0.25}
            drawDuration={1.2}
            strokeWidth={1}
          />
        </div>

        {/* ✅ Linha superior: ESQUERDA (título) + DIREITA (FAQ) */}
        <div className={styles.topRow}>
          {/* Chamada principal (lado esquerdo) */}
          <div className={styles.chamada} aria-label="Chamada principal">
            <div className={styles.duvidasWord} aria-label="Duvidas">
              <DuvidasHandwrite
                className={styles.contain}
                duration={1.1}
                delay={0.2}
                strokeWidth={1}
                replayThreshold={0.55}
                replayCooldownMs={900}
              />
            </div>

            <div
              className={`${styles.frequentesWord} float-soft`}
              style={
                {
                  "--float-dur": "1.0s",
                  "--float-delay": "-0.4s",
                  "--float-dist": "-8px",
                } as any
              }
            >
              <Image
                src="/assets/duvidas/frequentes.png"
                alt="Frequentes"
                fill
                className={styles.contain}
                priority
                data-reveal="left"
              />
            </div>
          </div>

          {/* FAQ (lado direito) */}
          <div
            className={styles.faqCol}
            aria-label="Perguntas e respostas"
            data-reveal="right"
          >
            <div className={styles.faqBox}>
              {faqs.map((item, i) => {
                const open = openIndex === i;
                return (
                  <div key={item.q} className={styles.faqItem}>
                    <button
                      type="button"
                      className={styles.pergunta}
                      onClick={() => setOpenIndex(open ? null : i)}
                      aria-expanded={open}
                    >
                      <span className={styles.perguntaTexto}>{item.q}</span>
                      <span className={styles.chevronWrap} aria-hidden="true">
                        <Chevron open={open} />
                      </span>
                    </button>

                    <div
                      className={`${styles.respostaWrap} ${
                        open ? styles.respostaOpen : ""
                      }`}
                    >
                      <div className={styles.resposta}>{item.a}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ✅ Rodapé: fica no bottom quando fechado, e desce quando abrir respostas */}
        <footer className={styles.rodape} aria-label="Rodapé">
          <div className={styles.logos} aria-label="Logos">
            <div className={styles.logoMcc}>
              <Image
                src="/assets/duvidas/logo-mcc.png"
                alt="MCC"
                fill
                className={styles.contain}
              />
            </div>

            <div className={styles.logoEnjc}>
              <Image
                src="/assets/duvidas/logo-enjc.png"
                alt="ENJC"
                fill
                className={styles.contain}
              />
            </div>
          </div>

          <div className={styles.creditos}>
            <div className={styles.credito1}>Desenvolvido por</div>
            <div className={styles.credito2}>Jovens Cursilhistas</div>
          </div>
        </footer>
      </div>
    </section>
  );
}
