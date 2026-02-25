// import Image from "next/image";
import styles from "./Momentos.module.css";

import OlhaOQueTeEsperaHandwrite from "@/components/ui/Momentos/OlhaOQueTeEspera";

const TOPICOS = [
  {
    titulo: "FORMAÇÃO e\nVIVÊNCIA",
    desc: "Oficinas e dinâmicas para refletir sobre a caminhada, partilhar experiências e fortalecer a missão de evangelizar.",
  },
  {
    titulo: "ESPIRITUALIDADE\ne REFLEXÃO",
    desc: "Momentos de oração e reflexão para renovar a fé, escutar Deus e assumir compromissos como jovens cursilhistas.",
  },
  {
    titulo: "ENCONTRO e\nUNIDADE",
    desc: "Espaço de interação, partilha e alegria, unindo jovens de todo o Brasil e deixando lembranças que marcam a caminhada.",
  },
];

export default function Momentos() {
  return (
    <section
      className={styles.anchor}
      aria-label="Momentos"
      id="momentos"
      data-reveal="up"
    >
      <div className={styles.box}>
        <div className={styles.titulo} aria-label="Olha o que te espera!">
          <OlhaOQueTeEsperaHandwrite
            className={styles.contain}
            duration={1.3}
            delay={0.2}
            strokeWidth={1}
            replayThreshold={0.55}
            replayCooldownMs={900}
          />
        </div>

        <div className={styles.cards}>
          {TOPICOS.map((t, i) => (
            <article
              key={i}
              className={`${styles.card} ${i % 2 === 0 ? "float-soft" : "float-pop"}`}
              style={
                {
                  // tempos diferentes por card
                  "--float-dur": i === 0 ? "1.1s" : i === 1 ? "0.8s" : "1.4s",
                  "--float-delay":
                    i === 0 ? "-0.6s" : i === 1 ? "-1.8s" : "-1s",
                  "--float-dist":
                    i === 0 ? "-20px" : i === 1 ? "-30px" : "-40px",
                } as any
              }
            >
              <h3 className={styles.cardTitle}>
                {t.titulo.split("\n").map((line, idx) => (
                  <span key={idx}>
                    {line}
                    <br />
                  </span>
                ))}
              </h3>
              <p className={styles.cardDesc}>{t.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
