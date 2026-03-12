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

export default function HomeClient() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<number>(1);
  const [pagamento, setPagamento] = useState<
    "" | "Pix ⚡" | "Cartão 💳" | "Pagar depois ⏰"
  >("");

  const openModal = () => {
    setStep(1);
    setOpen(true);
  };

  const closeModal = () => setOpen(false);

  const next = () =>
    setStep((s) => {
      if (s === 12) {
        if (pagamento === "Pix ⚡") return 121;
        if (pagamento === "Cartão 💳") return 122;
        if (pagamento === "Pagar depois ⏰") return 14;
      }

      if (s === 121 || s === 122) return 13;

      if (s < 15) return s + 1;
      return s;
    });

  const back = () =>
    setStep((s) => {
      if (s === 13) return pagamento === "Pix ⚡" ? 121 : 122;
      if (s === 121 || s === 122) return 12;
      if (s === 14 && pagamento === "Pagar depois ⏰") return 12;
      if (s > 1) return s - 1;
      return s;
    });

  return (
    <main>
      <TabTitleBlink
        isPopupOpen={open}
        pageIntervalMs={1100}
        popupIntervalMs={450}
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
          setPagamento("");
        }}
        onNext={next}
        onBack={step > 1 ? back : undefined}
        onPagamentoChange={setPagamento}
        onGoToStep={(targetStep) => setStep(targetStep)}
      />
    </main>
  );
}
