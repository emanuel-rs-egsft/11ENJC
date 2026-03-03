"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type Props = {
  selector?: string;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
};

export default function ScrollReveal({
  selector = "[data-reveal]",
  rootMargin = "0px 0px -15% 0px",
  threshold = 0.15,
  once = false,
}: Props) {
  const pathname = usePathname();

  useEffect(() => {
    const observed = new WeakSet<HTMLElement>();

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            if (reduceMotion) {
              el.classList.add("is-in");
              if (once) io.unobserve(el);
              continue;
            }

            // garante estado inicial aplicado antes do "is-in"
            void el.offsetHeight;
            requestAnimationFrame(() => el.classList.add("is-in"));

            if (once) io.unobserve(el);
          } else {
            if (!once) el.classList.remove("is-in");
          }
        }
      },
      { rootMargin, threshold },
    );

    const applyTo = (el: HTMLElement) => {
      if (observed.has(el)) return;
      observed.add(el);

      el.classList.add("reveal");
      el.classList.remove("is-in");

      // se reduz movimento, já deixa visível e não observa
      if (reduceMotion) {
        el.classList.add("is-in");
        return;
      }

      io.observe(el);
    };

    const scan = () => {
      document.querySelectorAll<HTMLElement>(selector).forEach(applyTo);
    };

    // scan inicial
    scan();

    // debounce simples pro MutationObserver
    let raf = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      io.disconnect();
    };
  }, [selector, rootMargin, threshold, once, pathname]);

  return null;
}
