import Image from "next/image";
import styles from "./Identidade.module.css";

import ConhecaNossaHandwrite from "@/components/ui/Identidade/ConhecaNossa";

import UnderlineVerdeDrawn from "@/components/ui/DrawnEfeitos/UnderlineVerdeDrawn";
import SetaAzulDrawn from "@/components/ui/DrawnEfeitos/SetaAzulDrawn";
import LinhaAmarelaDrawn from "@/components/ui/DrawnEfeitos/LinhaAmarelaDrawn";

import SetaMapaBrasilDrawn from "@/components/ui/DrawnEfeitos/Identidade/SetaMapaBrasilDrawn";
import SetaSilhuetasDrawn from "@/components/ui/DrawnEfeitos/Identidade/SetaSilhuetasDrawn";
import SetaMCCDrawn from "@/components/ui/DrawnEfeitos/Identidade/SetaMCCDrawn";
import Seta11Drawn from "@/components/ui/DrawnEfeitos/Identidade/Seta11Drawn";

export default function Identidade() {
  return (
    <section
      className={styles.stage}
      aria-label="Conheça nossa identidade"
      id="identidade"
    >
      {/* BG cobrindo 100% */}
      <Image
        src="/assets/identidade/bg-texture.png"
        alt=""
        fill
        priority
        className={styles.bg}
      />

      {/* Canvas do Figma (escalado quando necessário) */}
      <div className={styles.canvas} data-reveal="fade">
        {/* Chamada principal */}
        <div className={styles.chamada} aria-label="Chamada principal">
          <div className={styles.conhecaNossa} aria-label="Chamada principal">
            <ConhecaNossaHandwrite
              className={styles.contain}
              duration={1.3}
              delay={0.2}
              strokeWidth={1}
              replayThreshold={0.55}
              replayCooldownMs={900}
            />
          </div>

          <div
            className={`${styles.identidadeTitulo} float-pop`}
            style={
              {
                "--float-dur": "1.1s",
                "--float-delay": "-4.9s",
                "--float-dist": "-10px",
              } as any
            }
          >
            <Image
              src="/assets/identidade/identidade.png"
              alt="Identidade"
              fill
              className={styles.contain}
              priority
              data-reveal="left"
            />
          </div>
        </div>

        {/* Decorações da chamada */}
        {/*UNDERLINE VERDE*/}
        <div className={styles.underlineVerde} aria-hidden="true">
          <UnderlineVerdeDrawn
            className={styles.contain}
            drawDelay={0.25}
            drawDuration={1.2}
            strokeWidth={1}
          />
        </div>
        {/*SETA AZUL*/}
        <div className={styles.setaAzul} aria-hidden="true">
          <SetaAzulDrawn
            className={styles.contain}
            drawDelay={0.25}
            drawDuration={1.2}
            strokeWidth={1}
          />
        </div>
        {/*LINHA AMARELA*/}
        <div className={styles.linhaAmarela} aria-hidden="true">
          <LinhaAmarelaDrawn
            className={styles.contain}
            drawDelay={0.25}
            drawDuration={1.2}
            strokeWidth={1}
          />
        </div>

        {/* Descrição */}
        <div className={styles.descricao} aria-label="Descrição">
          <p className={styles.textoDescricao}>
            Mais que um desenho, um sinal da nossa fé, juventude e missão.
          </p>
        </div>

        {/* Símbolo + Significados */}
        <div
          className={styles.area}
          aria-label="Símbolo e significados"
          data-reveal="up"
        >
          {/* Símbolo central */}
          <div
            className={`${styles.simbolo} float-pop`}
            style={
              {
                "--float-dur": "0.7s",
                "--float-delay": "-1.2s",
                "--float-dist": "-14px",
              } as any
            }
          >
            <Image
              src="/assets/identidade/simbolo-enjc.png"
              alt="Símbolo do ENJC"
              fill
              className={styles.contain}
              priority
            />
          </div>

          {/* Significadospara quebrar a linha é utilizado {"\n"}*/}
          <div className={styles.mapaBrasil} aria-label="Mapa do Brasil">
            <div className={styles.itemImg}>
              <Image
                src="/assets/identidade/mapa-brasil.png"
                alt="Mapa do Brasil"
                fill
                className={styles.contain}
              />
            </div>
            <p className={styles.itemTexto}>Mapa do Brasil</p>
            {/*SETA MAPA BRASIL;*/}
            <div className={styles.itemSeta} aria-hidden="true">
              <SetaMapaBrasilDrawn
                className={styles.contain}
                drawDelay={0.25}
                drawDuration={1.2}
                strokeWidth={1}
              />
            </div>
          </div>

          <div className={styles.silhuetas} aria-label="Silhuetas">
            <div className={styles.itemImg}>
              <Image
                src="/assets/identidade/silhuetas.png"
                alt="Silhuetas"
                fill
                className={styles.contain}
              />
            </div>
            <p className={styles.itemTexto}>
              Silhuetas representando as 5 macrorregiões
            </p>
            {/*SETA SILHUETAS;*/}
            <div className={styles.itemSeta} aria-hidden="true">
              <SetaSilhuetasDrawn
                className={styles.contain}
                drawDelay={0.25}
                drawDuration={1.2}
                strokeWidth={1}
              />
            </div>
          </div>

          <div className={styles.mcc} aria-label="Símbolo MCC">
            <div className={styles.itemImg}>
              <Image
                src="/assets/identidade/mcc.png"
                alt="Símbolo MCC"
                fill
                className={styles.contain}
              />
            </div>
            <p className={styles.itemTexto}>Símbolo MCC</p>
            {/*SETA MCC;*/}
            <div className={styles.itemSeta} aria-hidden="true">
              <SetaMCCDrawn
                className={styles.contain}
                drawDelay={0.25}
                drawDuration={1.2}
                strokeWidth={1}
              />
            </div>
          </div>

          <div className={styles.edicao11} aria-label="Número da edição">
            <div className={styles.itemImg}>
              <Image
                src="/assets/identidade/11.png"
                alt="11"
                fill
                className={styles.contain}
              />
            </div>
            <p className={styles.itemTexto}>Número da edição do ENJC</p>
            {/*SETA 11;*/}
            <div className={styles.itemSeta} aria-hidden="true">
              <Seta11Drawn
                className={styles.contain}
                drawDelay={0.25}
                drawDuration={1.2}
                strokeWidth={1}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
