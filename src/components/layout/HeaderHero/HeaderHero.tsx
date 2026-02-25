import Image from "next/image";
import styles from "./HeaderHero.module.css";

//ANIMACAO TIUTLOS DRAWN
import VemAiHandwrite from "@/components/ui/Hero/VemAiHandwrite";

import SetaVermelhaDrawn from "@/components/ui/DrawnEfeitos/SetaVermelhaDrawn";
import SetaVerdeDrawn from "@/components/ui/DrawnEfeitos/SetaVerdeDrawn";

type Props = {
  onOpenInscricao?: () => void;
};

export default function HeaderHero({ onOpenInscricao }: Props) {
  return (
    <section className={styles.stage} aria-label="Header e Hero">
      {/* BG cobrindo 100% da seção */}
      <Image
        src="/assets/hero/bg-texture.png"
        alt=""
        fill
        priority
        className={styles.bg}
      />

      {/* CTA fixo no scroll (alinhado ao canvas + escala) */}
      <button
        type="button"
        className={styles.cta}
        onClick={onOpenInscricao}
        aria-label="Inscreva-se aqui"
      >
        <span className={styles.brushWrap} aria-hidden="true">
          <Image
            src="/assets/header/pincel-vermelho.svg"
            alt=""
            fill
            className={styles.brushRed}
            priority
          />
          <Image
            src="/assets/header/pincel-branco.svg"
            alt=""
            fill
            className={styles.brushWhite}
            priority
          />
        </span>

        <span className={styles.ctaText}>Inscreva-se</span>
        <span className={styles.ctaAqui}>Aqui!</span>
      </button>

      {/* Canvas do Figma (escalado quando necessário) */}
      <div className={styles.canvas}>
        {/* Flutuante Superior */}
        <div className={styles.floatTop} aria-hidden="true">
          <div className={styles.floatTopAnim}>
            <div className={styles.floatTopText}>
              Olhaaa
              <br />
              issoooooo
            </div>

            <div className={styles.floatTopArrow} aria-hidden="true">
              <SetaVermelhaDrawn
                className={styles.contain}
                drawDelay={0.25}
                drawDuration={1.2}
                strokeWidth={1}
              />
            </div>
          </div>
        </div>

        {/* Flutuante Inferior (só 1025+ e 1440) */}
        <div className={styles.floatBottom} aria-hidden="true">
          <div className={styles.floatBottomAnim}>
            <div className={styles.floatBottomText}>Vamooooosssss</div>

            <div className={styles.floatBottomArrow} aria-hidden="true">
              <SetaVerdeDrawn
                className={styles.contain}
                drawDelay={0.25}
                drawDuration={1.2}
                strokeWidth={1}
              />
            </div>
          </div>
        </div>

        {/* Texto chamada */}
        <div className={styles.callout} aria-label="Chamada do evento">
          <div className={styles.vemAi} aria-label="Vem aí">
            <VemAiHandwrite
              className={styles.vemAiSvg}
              duration={1.1}
              delay={0.25}
              strokeWidth={1.2}
              replayThreshold={0.55}
              replayCooldownMs={900}
            />
          </div>

          <div className={styles.enjc} data-reveal="left">
            <div className={styles.floatEnjc}>
              <Image
                src="/assets/hero/11ENJC.png"
                alt="#11ENJC"
                fill
                className={styles.contain}
                priority
              />
            </div>
          </div>
        </div>

        {/* Imagem Jovens */}
        <div className={styles.jovens} data-reveal="right">
          <div className={styles.floatJovens}>
            <Image
              src="/assets/hero/imagem-jovens.png"
              alt="Jovens"
              fill
              className={styles.cover}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
