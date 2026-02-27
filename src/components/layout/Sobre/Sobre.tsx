import Image from "next/image";
import styles from "./Sobre.module.css";

import PraQuemEHandwrite from "@/components/ui/Sobre/PraQuemEHandwrite";

import UnderlineVerdeDrawn from "@/components/ui/DrawnEfeitos/UnderlineVerdeDrawn";
import SetaAzulDrawn from "@/components/ui/DrawnEfeitos/SetaAzulDrawn";
import LinhaAmarelaDrawn from "@/components/ui/DrawnEfeitos/LinhaAmarelaDrawn";

export default function Sobre() {
  return (
    <section className={styles.stage} aria-label="Sobre o ENJC" id="sobre">
      {/* BG cobrindo 100% */}
      <Image
        src="/assets/sobre/bg-texture.png"
        alt=""
        fill
        priority
        className={styles.bg}
      />

      {/* Canvas do Figma (escalado quando necessário) */}
      <div className={styles.canvas}>
        {/* Chamada principal */}
        <div className={styles.chamada} aria-label="Chamada principal">
          <div className={styles.praQuemE} aria-label="Pra quem é">
            <PraQuemEHandwrite
              className={styles.praQuemESvg}
              duration={1.1}
              delay={0.2}
              strokeWidth={1}
              replayThreshold={0.55}
              replayCooldownMs={900}
            />
          </div>

          <div
            className={`${styles.oEnjc} float-soft`}
            style={
              {
                "--float-dur": "1.2s",
                "--float-delay": "-0.6s",
                "--float-dist": "-10px",
              } as React.CSSProperties
            }
          >
            <Image
              src="/assets/sobre/o-enjc.png"
              alt="O ENJC?"
              fill
              className={styles.contain}
              priority
              data-reveal="left"
            />
          </div>
        </div>

        {/* Decorações (lado esquerdo) */}
        {/*UNDERLINE VERDE*/}
        <div
          className={`${styles.underlineVerde} float-pop`}
          style={
            {
              "--float-dur": "0.8s",
              "--float-delay": "-2.1s",
              "--float-dist": "-10px",
            } as React.CSSProperties
          }
          aria-hidden="true"
        >
          <UnderlineVerdeDrawn
            className={styles.svgFill}
            drawDelay={0.25}
            drawDuration={1.2}
            strokeWidth={1}
          />
        </div>
        {/*SETA AZUL*/}
        <div
          className={`${styles.setaAzul} float-pop`}
          style={
            {
              "--float-dur": "0.6s",
              "--float-delay": "-0.4s",
              "--float-dist": "-18px",
            } as React.CSSProperties
          }
          aria-hidden="true"
        >
          <SetaAzulDrawn
            className={styles.svgFill}
            drawDelay={0.25}
            drawDuration={1.2}
            strokeWidth={1}
          />
        </div>
        {/*LINHA AMARELA*/}
        <div
          className={`${styles.linhaAmarela} float-pop`}
          style={
            {
              "--float-dur": "0.9s",
              "--float-delay": "-1.1s",
              "--float-dist": "-10px",
            } as React.CSSProperties
          }
          aria-hidden="true"
        >
          <LinhaAmarelaDrawn
            className={styles.svgFill}
            drawDelay={0.25}
            drawDuration={1.2}
            strokeWidth={1}
          />
        </div>

        {/* Descrição */}
        <div className={styles.descricao} aria-label="Descrição">
          <p className={styles.textoDescricao}>
            O Encontro Nacional para Jovens Cursilhistas é um convite especial
            para jovens que vivem o Cursilho no dia a dia, caminham com alegria
            no Movimento e desejam crescer ainda mais na fé e na missão.
          </p>
        </div>

        {/* Tópicos */}
        <div
          className={styles.topicos}
          aria-label="Informações e vagas"
          data-reveal="right"
        >
          {/* Tópico 01 */}
          <div className={styles.topico}>
            <h3 className={styles.tituloGradiente}>
              Este encontro é para você que:
            </h3>

            <div className={styles.descTopico}>
              <ul className={styles.lista}>
                <li>Vive o Cursilho com amor e responsabilidade</li>
                <li>Atua nos GERs ou GEDs, servindo com alegria</li>
                <li>Representa sua diocese, região ou macro-região</li>
                <li>
                  Sente no coração o desejo de crescer, aprender e servir ainda
                  mais
                </li>
              </ul>
              <p className={styles.frase}>
                Aqui, cada jovem é importante. Cada história conta. Cada
                caminhada tem valor.
              </p>
            </div>

            {/* Underlines + círculo */}
            <div className={styles.t1u1} aria-hidden="true">
              <Image
                src="/assets/sobre/topico01-underline1.svg"
                alt=""
                fill
                className={styles.contain}
              />
            </div>
            <div className={styles.t1u2} aria-hidden="true">
              <Image
                src="/assets/sobre/topico01-underline2.svg"
                alt=""
                fill
                className={styles.contain}
              />
            </div>
            <div className={styles.t1c} aria-hidden="true">
              <Image
                src="/assets/sobre/topico01-circulo.svg"
                alt=""
                fill
                className={styles.contain}
              />
            </div>
          </div>

          {/* Tópico 02 */}
          <div className={styles.topico}>
            <h3 className={styles.tituloGradiente}>Sobre as vagas:</h3>

            <div className={styles.descTopico}>
              <p>
                As vagas serão organizadas por GER, com um número inicial
                definido para cada grupo.
                <br />
                Se surgirem novas vagas, elas poderão ser redistribuídas entre
                os GERs que demonstrarem interesse, sempre com cuidado, diálogo
                e espírito de unidade.
              </p>
            </div>

            <div className={styles.t2u1} aria-hidden="true">
              <Image
                src="/assets/sobre/topico02-underline1.svg"
                alt=""
                fill
                className={styles.contain}
              />
            </div>
            <div className={styles.t2c} aria-hidden="true">
              <Image
                src="/assets/sobre/topico02-circulo.svg"
                alt=""
                fill
                className={styles.contain}
              />
            </div>
          </div>

          {/* Tópico 03 */}
          <div className={styles.topico}>
            <h3 className={styles.tituloGradiente}>
              Sobre a distribuição das vagas:
            </h3>

            <div className={styles.descTopico}>
              <ul className={styles.lista}>
                <li>1 vaga para o Representante Jovem Regional</li>
                <li>1 vaga para o Coordenador, Vice ou Assessor do GER</li>
                <li>
                  As demais vagas destinadas aos Representantes Jovens
                  Diocesanos
                </li>
              </ul>
            </div>

            <div className={styles.t3u1} aria-hidden="true">
              <Image
                src="/assets/sobre/topico03-underline1.svg"
                alt=""
                fill
                className={styles.contain}
              />
            </div>
            <div className={styles.t3u2} aria-hidden="true">
              <Image
                src="/assets/sobre/topico03-underline2.svg"
                alt=""
                fill
                className={styles.contain}
              />
            </div>
            <div className={styles.t3u3} aria-hidden="true">
              <Image
                src="/assets/sobre/topico03-underline3.svg"
                alt=""
                fill
                className={styles.contain}
              />
            </div>
            <div className={styles.t3c} aria-hidden="true">
              <Image
                src="/assets/sobre/topico03-circulo.svg"
                alt=""
                fill
                className={styles.contain}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
