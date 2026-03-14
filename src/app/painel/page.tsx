import ThemeToggle from "./ThemeToggle";

export const revalidate = 120;

/*==LINHA PARA EDITAR DADOS REAIS E LAYOUT ATIVAR/DESATIVAR==*/
/*import { getPainelData } from "@/lib/googleSheets";*/
import { getPainelData } from "@/lib/googleSheets";
import LogoutButton from "./LogoutButton";
import PainelClient from "./PainelClient";
import styles from "./PainelPage.module.css";

function Card({
  title,
  value,
  bg,
}: {
  title: string;
  value: string;
  bg: string;
}) {
  return (
    <div className={styles.card} style={{ background: bg }}>
      <div className={styles.cardTitle}>{title}</div>
      <div className={styles.cardValue}>{value}</div>
    </div>
  );
}

function CamisetaCard({
  tamanho,
  quantidade,
}: {
  tamanho: string;
  quantidade: string;
}) {
  return (
    <div className={styles.camisetaCard}>
      <div className={styles.camisetaLabel}>Tamanho</div>
      <div className={styles.camisetaTamanho}>{tamanho}</div>
      <div className={styles.camisetaQuantidade}>{quantidade}</div>
    </div>
  );
}

export default async function PainelPage() {
  /*== LINHA ARA DADOS ORIGINAIS ==*/
  /*const data = await getPainelData();*/
  const data = await getPainelData();

  /*== DADOS ARA EDITAR LAYOUT ==*/
  /*const data = {
    resumo: {
      preInscritos: "12",
      inscritos: "48",
      geds: "9",
      gers: "5",
      camisetas: {
        P: "2",
        M: "8",
        G: "14",
        GG: "11",
        EXG: "7",
        EXGG: "6",
      },
    },
    inscritosTabela: [
      {
        dataHorario: "14/03/2026 10:30",
        nome: "Emanuel João",
        cracha: "Emanuel",
        nascimento: "1999-05-22",
        whatsapp: "(51) 99999-9999",
        email: "emanuel@email.com",
        rua: "Av. Central",
        numero: "449",
        bairro: "Centro",
        cidade: "Encantado/RS",
        macro: "Macrorregião Nordeste",
        ger: "GER NORDESTE 2",
        ged: "GED ARACAJÚ",
        funcao: "Coordenador(a)",
        cursilho: "1º Cursilho Jovem",
        alergia: "Não tenho!",
        alergiaDesc: "",
        restricao: "Não tenho!",
        restricaoDesc: "",
        camiseta: "GG",
        pagamento: "Pix ⚡",
        comprovante: "",
      },
      {
        dataHorario: "14/03/2026 11:00",
        nome: "João Silva",
        cracha: "João",
        nascimento: "2000-01-10",
        whatsapp: "(51) 98888-7777",
        email: "joao@email.com",
        rua: "Rua A",
        numero: "123",
        bairro: "Centro",
        cidade: "Encantado/RS",
        macro: "Macrorregião Sul",
        ger: "GER SUL 1",
        ged: "GED TERESINA",
        funcao: "Grupo de Apoio",
        cursilho: "16º Cursilho Jovem",
        alergia: "Tenho!",
        alergiaDesc: "Lactose",
        restricao: "Não tenho!",
        restricaoDesc: "",
        camiseta: "M",
        pagamento: "Cartão 💳",
        comprovante: "",
      },
    ],
  };*/

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topbar}>
          <div>
            <h1 className={styles.title}>Painel ENJC</h1>
            <p className={styles.subtitle}>
              Dashboard Acompanhamento Das Inscrições.
            </p>
          </div>

          <div className={styles.actions}>
            <a href="/api/painel-csv" className={styles.downloadButton}>
              Baixar Tabela
            </a>

            <ThemeToggle />

            <LogoutButton />
          </div>
        </div>

        <section className={styles.cardsGrid}>
          <Card
            title="Pré-inscritos:"
            value={String(data.resumo.preInscritos)}
            bg="#2d6cdf"
          />
          <Card
            title="Inscritos:"
            value={String(data.resumo.inscritos)}
            bg="#7a3cff"
          />
          <Card title="GEDs:" value={String(data.resumo.geds)} bg="#ff8c00" />
          <Card title="GERs:" value={String(data.resumo.gers)} bg="#ff6b35" />
        </section>

        <section className={styles.camisetasSection}>
          <h2 className={styles.sectionTitle}>Camisetas confirmadas:</h2>

          <div className={styles.camisetasGrid}>
            {Object.entries(data.resumo.camisetas).map(([tam, qtd]) => (
              <CamisetaCard key={tam} tamanho={tam} quantidade={String(qtd)} />
            ))}
          </div>
        </section>

        <PainelClient inscritosTabela={data.inscritosTabela} />
      </div>
    </main>
  );
}
