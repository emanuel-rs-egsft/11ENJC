import styles from "./PainelLogin.module.css";

export default async function PainelLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Painel ENJC</h1>

        <p className={styles.subtitle}>Entre para acessar o dashboard.</p>

        <form action="/api/painel-login" method="POST" className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Usuário</label>

            <input
              name="username"
              type="text"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Senha</label>

            <input
              name="password"
              type="password"
              required
              className={styles.input}
            />
          </div>

          {error ? (
            <p className={styles.error}>Usuário ou senha inválidos.</p>
          ) : null}

          <button type="submit" className={styles.button}>
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
