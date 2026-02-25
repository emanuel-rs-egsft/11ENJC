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

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            // garante que o browser viu o estado inicial
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
      io.observe(el);
    };

    const scan = () => {
      document.querySelectorAll<HTMLElement>(selector).forEach(applyTo);
    };

    // 1) scan inicial
    scan();

    // 2) pega elementos que “aparecem depois” (streaming/hydration)
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, [selector, rootMargin, threshold, once, pathname]);

  return null;
}
