"use client";

import { useState } from "react";

import HeaderHero from "@/components/layout/HeaderHero/HeaderHero";
import Countdown from "@/components/layout/Countdown/Countdown";
import Sobre from "@/components/layout/Sobre/Sobre";
import Momentos from "@/components/layout/Momentos/Momentos";
import Identidade from "@/components/layout/Identidade/Identidade";
import Convites from "@/components/layout/Convites/Convites";
import Duvidas from "@/components/layout/Duvidas/Duvidas";

import InscricaoPopup from "@/components/layout/InscricaoPopup/InscricaoPopup";
import TabTitleBlink from "@/components/seo/TabTitleBlink";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<number>(1);

  const openModal = () => {
    setStep(1);
    setOpen(true);
  };

  const closeModal = () => setOpen(false);

  const next = () => setStep((s) => (s < 16 ? s + 1 : s));
  const back = () => setStep((s) => (s > 1 ? s - 1 : s));

  return (
    <main>
      <TabTitleBlink
        isPopupOpen={open} // ✅ aqui é o certo
        pageIntervalMs={1100}
        popupIntervalMs={450} // ✅ mais rápido no pop-up
      />

      <HeaderHero onOpenInscricao={openModal} />

      <Countdown />
      <Sobre />
      <Momentos />
      <Identidade />
      <Convites />
      <Duvidas />

      <InscricaoPopup
        open={open}
        step={step as any}
        onClose={closeModal}
        onFinish={() => {
          setOpen(false);
          setStep(1);
        }}
        onNext={next}
        onBack={step > 1 ? back : undefined}
      />
    </main>
  );
}
