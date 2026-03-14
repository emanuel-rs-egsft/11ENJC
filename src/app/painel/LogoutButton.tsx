"use client";

export default function LogoutButton() {
  return (
    <form action="/api/painel-logout" method="POST">
      <button
        type="submit"
        style={{
          height: 42,
          padding: "0 16px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,.12)",
          background: "#121a30",
          color: "#fff",
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        Sair
      </button>
    </form>
  );
}
