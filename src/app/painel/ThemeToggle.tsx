"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("enjc-theme");

    if (saved === "light") {
      document.body.classList.add("light-theme");
      setTheme("light");
    } else {
      document.body.classList.remove("light-theme");
      setTheme("dark");
    }

    setMounted(true);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";

    if (nextTheme === "light") {
      document.body.classList.add("light-theme");
      localStorage.setItem("enjc-theme", "light");
    } else {
      document.body.classList.remove("light-theme");
      localStorage.setItem("enjc-theme", "dark");
    }

    setTheme(nextTheme);
  }

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      style={{
        height: 42,
        padding: "0 16px",
        borderRadius: 10,
        border: "1px solid var(--panel-border-strong)",
        background: "var(--panel-surface-2)",
        color: "var(--text-primary)",
        cursor: "pointer",
        fontFamily: "var(--font-luckiest)",
        fontSize: 16,
      }}
    >
      {theme === "dark" ? "Modo claro" : "Modo escuro"}
    </button>
  );
}
