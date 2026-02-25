"use client";

import { useEffect } from "react";

type Props = {
  isPopupOpen: boolean;

  // intervalos separados (ms)
  pageIntervalMs?: number; // pisca na página
  popupIntervalMs?: number; // pisca no pop-up
};

export default function TabTitleBlink({
  isPopupOpen,
  pageIntervalMs = 1100,
  popupIntervalMs = 450, // ✅ mais rápido no pop-up
}: Props) {
  useEffect(() => {
    const base = "11º ENJC |";
    const pageAlert = "11º ENJC | GARANTA SUA VAGA!!!🔥";
    const popupAlert = "11º ENJC | BORAAAAA!!!🎉";

    let toggle = false;

    const tick = () => {
      toggle = !toggle;
      document.title = toggle ? (isPopupOpen ? popupAlert : pageAlert) : base;
    };

    // começa já definindo
    document.title = base;
    tick();

    // escolhe velocidade dependendo do estado
    const interval = isPopupOpen ? popupIntervalMs : pageIntervalMs;
    const id = window.setInterval(tick, interval);

    // opcional: quando trocar de aba, volta pro base
    const onVisibility = () => {
      if (document.hidden) document.title = base;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
      document.title = base;
    };
  }, [isPopupOpen, pageIntervalMs, popupIntervalMs]);

  return null;
}
