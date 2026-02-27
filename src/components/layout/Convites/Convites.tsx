"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Convites.module.css";

import SeLigaNessesHandwrite from "@/components/ui/Convites/SeLigaNesses";

import UnderlineVerdeDrawn from "@/components/ui/DrawnEfeitos/UnderlineVerdeDrawn";
import SetaRosaDrawn from "@/components/ui/DrawnEfeitos/SetaRosaDrawn";
import LinhaRoxaDrawn from "@/components/ui/DrawnEfeitos/LinhaRoxaDrawn";

type Depoimento = {
  id: string;
  texto: string;
  nome: string;
  regiao: string;
  fotoSrc: string;
};

export default function Convites() {
  const slides: Depoimento[] = useMemo(
    () => [
      {
        id: "milla",
        texto:
          "Se você vive o Cursilho, o ENJC é pra você. Queremos te encontrar, ouvir tua história e fortalecer juntos a nossa missão como jovens cursilhistas.”",
        nome: "Milla Munique",
        regiao: "Macrorregião Centro-Oeste",
        fotoSrc: "/assets/convites/milla.png",
      },
      {
        id: "ellen",
        texto:
          "É tempo de nos encontrarmos como irmãos, partilharmos nossa caminhada e fortalecermos juntos a missão que o Cursilho nos confia.”",
        nome: "Ellen Cristina Martins",
        regiao: "Macrorregião Norte",
        fotoSrc: "/assets/convites/ellen.png",
      },
      {
        id: "davyd",
        texto:
          "O ENJC é um abraço que reúne jovens de todo o Brasil. É tempo de escuta, partilha e renovação da fé. Vem viver esse encontro conosco, porque tua presença faz diferença.”",
        nome: "Davyd Alisson",
        regiao: "Macrorregião Nordeste",
        fotoSrc: "/assets/convites/davyd.png",
      },
      {
        id: "lenisse",
        texto:
          "O ENJC é um convite a estar junto, a partilhar a caminhada e a fortalecer a amizade que nos une no Cursilho.”",
        nome: "Lenisse Aquino",
        regiao: "Macrorregião Sul",
        fotoSrc: "/assets/convites/lenisse.png",
      },
      {
        id: "daiana",
        texto:
          "O ENJC é um abraço que reúne jovens de todo o Brasil. É tempo de escuta, partilha e renovação da fé.”",
        nome: "Daiana Cristina Buzo",
        regiao: "Macrorregião Sudeste",
        fotoSrc: "/assets/convites/daiana-buzo.png",
      },
    ],
    [],
  );

  const total = slides.length;

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // drag real (arrasta seguindo o mouse/dedo)
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragXRef = useRef(0);

  const boxRef = useRef<HTMLDivElement | null>(null);

  // Pointer drag state
  const dragRef = useRef({
    startX: 0,
    startY: 0,
    isDown: false,
    width: 1,
    pointerId: -1,
    locked: false,
    lockDir: "" as "" | "x" | "y",
  });

  // Touch fallback state (iOS / webview)
  const touchRef = useRef({
    startX: 0,
    startY: 0,
    isDown: false,
    locked: false,
    lockDir: "" as "" | "x" | "y",
  });

  const goTo = (i: number) => {
    if (total <= 0) return;
    setIndex((i + total) % total);
  };

  const goPrev = () => goTo(index - 1);
  const goNext = () => goTo(index + 1);

  // autoplay (pausa em hover/drag)
  useEffect(() => {
    if (total <= 1) return;
    if (isPaused) return;

    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 6500);

    return () => window.clearInterval(t);
  }, [total, isPaused]);

  // teclado (← →)
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    const onKey = (e: KeyboardEvent) => {
      if (total <= 1) return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total]);

  // ✅ se clicou em um botão (seta/dot), não inicia drag
  const isUIControl = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    return Boolean(target.closest("button"));
  };

  /* ==========================
     POINTER EVENTS (desktop + android)
  ========================== */
  const onPointerDown = (e: React.PointerEvent) => {
    if (isUIControl(e.target)) return;
    if (total <= 1) return;

    // ✅ impede o browser de iniciar scroll/seleção no gesto
    e.preventDefault();

    const el = boxRef.current;
    if (!el) return;

    // mede width para threshold/limit
    dragRef.current.width = el.getBoundingClientRect().width || 1;

    // capture
    try {
      el.setPointerCapture(e.pointerId);
    } catch {}

    dragRef.current.isDown = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.pointerId = e.pointerId;
    dragRef.current.locked = false;
    dragRef.current.lockDir = "";

    setIsPaused(true);
    setIsDragging(true);

    dragXRef.current = 0;
    setDragX(0);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.isDown) return;

    const dxRaw = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    // ✅ trava direção quando o gesto "se decide"
    if (!dragRef.current.locked) {
      if (Math.abs(dxRaw) > 6 || Math.abs(dy) > 6) {
        dragRef.current.locked = true;
        dragRef.current.lockDir = Math.abs(dxRaw) > Math.abs(dy) ? "x" : "y";
      }
    }

    // ✅ se virou scroll vertical, não atrapalha
    if (dragRef.current.lockDir === "y") return;

    // ✅ swipe horizontal
    e.preventDefault();

    const limit = dragRef.current.width * 0.35;
    const clamped = Math.max(-limit, Math.min(limit, dxRaw));

    dragXRef.current = clamped;
    setDragX(clamped);
  };

  const finishPointerDrag = () => {
    if (!dragRef.current.isDown) return;

    const el = boxRef.current;
    if (el && dragRef.current.pointerId !== -1) {
      try {
        el.releasePointerCapture(dragRef.current.pointerId);
      } catch {}
    }

    dragRef.current.isDown = false;
    setIsDragging(false);

    const w = dragRef.current.width || 1;
    const threshold = w * 0.18;
    const dx = dragXRef.current;

    dragXRef.current = 0;
    setDragX(0);

    if (dx <= -threshold) goNext();
    else if (dx >= threshold) goPrev();

    window.setTimeout(() => setIsPaused(false), 1200);
  };

  const onPointerUp = () => finishPointerDrag();
  const onPointerCancel = () => finishPointerDrag();
  const onPointerLeave = () => {
    if (dragRef.current.isDown) finishPointerDrag();
  };

  /* ==========================
     TOUCH FALLBACK (iOS / webview)
  ========================== */
  const onTouchStart = (e: React.TouchEvent) => {
    if (total <= 1) return;
    if (isUIControl(e.target)) return;

    const t = e.touches[0];
    if (!t) return;

    // mede width para threshold/limit
    const w = boxRef.current?.getBoundingClientRect().width || 1;
    dragRef.current.width = w;

    touchRef.current.isDown = true;
    touchRef.current.startX = t.clientX;
    touchRef.current.startY = t.clientY;
    touchRef.current.locked = false;
    touchRef.current.lockDir = "";

    setIsPaused(true);
    setIsDragging(true);
    dragXRef.current = 0;
    setDragX(0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchRef.current.isDown) return;

    const t = e.touches[0];
    if (!t) return;

    const dxRaw = t.clientX - touchRef.current.startX;
    const dy = t.clientY - touchRef.current.startY;

    if (!touchRef.current.locked) {
      if (Math.abs(dxRaw) > 6 || Math.abs(dy) > 6) {
        touchRef.current.locked = true;
        touchRef.current.lockDir = Math.abs(dxRaw) > Math.abs(dy) ? "x" : "y";
      }
    }

    // scroll vertical: deixa a página rolar
    if (touchRef.current.lockDir === "y") return;

    // swipe horizontal: impede scroll
    e.preventDefault();

    const w = dragRef.current.width || 1;
    const limit = w * 0.35;
    const clamped = Math.max(-limit, Math.min(limit, dxRaw));

    dragXRef.current = clamped;
    setDragX(clamped);
  };

  const finishTouchDrag = () => {
    if (!touchRef.current.isDown) return;
    touchRef.current.isDown = false;

    setIsDragging(false);

    const w = dragRef.current.width || 1;
    const threshold = w * 0.18;
    const dx = dragXRef.current;

    dragXRef.current = 0;
    setDragX(0);

    if (dx <= -threshold) goNext();
    else if (dx >= threshold) goPrev();

    window.setTimeout(() => setIsPaused(false), 1200);
  };

  const onTouchEnd = () => finishTouchDrag();
  const onTouchCancel = () => finishTouchDrag();

  return (
    <section
      className={styles.stage}
      aria-label="Se liga nesses convites"
      id="convites"
    >
      {/* BG cobrindo 100% */}
      <Image
        src="/assets/convites/bg-texture.png"
        alt=""
        fill
        priority
        className={styles.bg}
      />

      {/* Canvas */}
      <div className={styles.canvas}>
        {/* Chamada */}
        <div className={styles.chamada} aria-label="Chamada principal">
          <div className={styles.seLiga} aria-label="Chamada principal">
            <SeLigaNessesHandwrite
              className={styles.contain}
              duration={1.1}
              delay={0.2}
              strokeWidth={1}
              replayThreshold={0.55}
              replayCooldownMs={900}
            />
          </div>

          <div
            className={`${styles.convitesTitle} float-soft`}
            style={
              {
                "--float-dur": "1.0s",
                "--float-delay": "-0.5s",
                "--float-dist": "-8px",
              } as any
            }
          >
            <Image
              src="/assets/convites/convites.png"
              alt="Convites"
              fill
              className={styles.contain}
              priority
              data-reveal="left"
            />
          </div>
        </div>

        {/* Decorações */}
        <div
          className={`${styles.underlineVerde} float-soft`}
          style={
            {
              "--float-dur": "1.2s",
              "--float-delay": "-1.1s",
              "--float-dist": "-10px",
            } as any
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

        <div
          className={`${styles.linhaRoxa} float-pop`}
          style={
            {
              "--float-dur": "0.7s",
              "--float-delay": "-0.3s",
              "--float-dist": "-14px",
            } as any
          }
          aria-hidden="true"
        >
          <LinhaRoxaDrawn
            className={styles.svgFill}
            drawDelay={0.25}
            drawDuration={1.2}
            strokeWidth={1}
          />
        </div>

        <div
          className={`${styles.setaRosa} float-pop`}
          style={
            {
              "--float-dur": "0.55s",
              "--float-delay": "-1.6s",
              "--float-dist": "-18px",
            } as any
          }
          aria-hidden="true"
        >
          <SetaRosaDrawn
            className={styles.svgFill}
            drawDelay={0.25}
            drawDuration={1.2}
            strokeWidth={1}
          />
        </div>

        {/* Descrição */}
        <div className={styles.descricao} aria-label="Descrição">
          <p className={styles.textoDescricao}>
            O ENJC nasce do coração da juventude cursilhista.
            <br />
            Por isso, nossos Representantes Jovens das Macro-regiões querem
            falar contigo não como coordenação, mas como quem caminha ao teu
            lado, partilha da mesma fé e acredita na força da juventude no MCC.
          </p>
        </div>

        {/* BOX WRAP */}
        <div
          className={styles.boxWrap}
          aria-label="Carrossel de depoimentos"
          data-reveal="right"
        >
          <div
            ref={boxRef}
            className={styles.box}
            tabIndex={0}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onPointerLeave={onPointerLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchCancel}
          >
            {/* Setas */}
            <button
              type="button"
              className={styles.btnPrev}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={goPrev}
              aria-label="Depoimento anterior"
              disabled={total <= 1}
            >
              <Image
                src="/assets/convites/seta-anterior.svg"
                alt=""
                fill
                className={styles.contain}
              />
            </button>

            <button
              type="button"
              className={styles.btnNext}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={goNext}
              aria-label="Próximo depoimento"
              disabled={total <= 1}
            >
              <Image
                src="/assets/convites/seta-proximo.svg"
                alt=""
                fill
                className={styles.contain}
              />
            </button>

            {/* TRILHO */}
            <div
              className={styles.track}
              style={{
                transform: `translateX(calc(${-index * 100}% + ${dragX}px))`,
                transition: isDragging ? "none" : undefined,
              }}
            >
              {slides.map((s, i) => (
                <div
                  key={s.id}
                  className={`${styles.slide} ${
                    i === index ? styles.slideActive : ""
                  }`}
                >
                  <div className={styles.depoimento}>
                    <div className={styles.aspas} aria-hidden="true">
                      “
                    </div>
                    <div className={styles.textoDepo}>{s.texto}</div>
                  </div>

                  <div
                    className={styles.representante}
                    aria-label="Representante"
                  >
                    <div className={styles.fotoWrap}>
                      <Image
                        src={s.fotoSrc}
                        alt={s.nome}
                        fill
                        className={styles.cover}
                        priority
                      />
                    </div>

                    <div className={styles.nome}>{s.nome}</div>
                    <div className={styles.regiao}>{s.regiao}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DOTS */}
          {total > 1 && (
            <div className={styles.dots} aria-label="Quantidade de slides">
              {slides.map((s, i) => (
                <button
                  key={`${s.id}-dot`}
                  type="button"
                  className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => goTo(i)}
                  aria-label={`Ir para depoimento ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
