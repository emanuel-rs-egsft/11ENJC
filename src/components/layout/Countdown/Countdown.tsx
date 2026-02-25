"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./Countdown.module.css";

import type { CSSProperties } from "react";

type TimeLeft = { days: number; hours: number; minutes: number };

function clamp(n: number) {
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export default function Countdown() {
  // ✅ Alvo: 23 de Julho do ano atual (se já passou, vai pro próximo ano)
  const target = useMemo(() => {
    const now = new Date();

    // Data em São Paulo (sem depender do fuso do navegador)
    const parts = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);

    const year = Number(
      parts.find((p) => p.type === "year")?.value ?? now.getFullYear(),
    );

    // 23/07 às 00:00 em São Paulo (convertendo com offset -03:00)
    // Observação: Brasil pode variar DST em alguns anos, mas hoje é -03:00.
    const mk = (y: number) => new Date(`${y}-07-23T00:00:00-03:00`);

    const tThis = mk(year);
    const tNext = mk(year + 1);

    return now.getTime() <= tThis.getTime() ? tThis : tNext;
  }, []);

  const [left, setLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const diff = clamp(target.getTime() - now);

      const totalMin = Math.floor(diff / (1000 * 60));
      const days = Math.floor(totalMin / (60 * 24));
      const hours = Math.floor((totalMin - days * 60 * 24) / 60);
      const minutes = totalMin - days * 60 * 24 - hours * 60;

      setLeft({ days, hours, minutes });
    };

    tick();
    const id = window.setInterval(tick, 1000); // atualiza a cada 1s (mas mostramos min)
    return () => window.clearInterval(id);
  }, [target]);

  return (
    <section
      className={`${styles.anchor} float-soft`}
      style={
        {
          "--float-dur": "1.2s",
          "--float-delay": "-0.8s",
          "--float-dist": "-10px",
        } as any
      }
      aria-label="Contagem regressiva"
      data-reveal="up"
    >
      <div className={styles.box}>
        {/* Texto flutuante */}
        <span className={styles.agiliza}>AGILIZAAA</span>

        {/* Título */}
        <div className={styles.title}>Faltam:</div>

        {/* Números */}
        <div className={styles.numbers}>
          <div className={styles.num}>{pad2(left.days)}</div>
          <div className={styles.num}>{pad2(left.hours)}</div>
          <div className={styles.num}>{pad2(left.minutes)}</div>
        </div>

        {/* Labels */}
        <div className={styles.labels}>
          <div className={styles.lab}>DIAS</div>
          <div className={styles.lab}>HORAS</div>
          <div className={styles.lab}>MINUTOS</div>
        </div>
      </div>
    </section>
  );
}
