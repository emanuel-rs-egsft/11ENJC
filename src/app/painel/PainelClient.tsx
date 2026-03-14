"use client";

import { useMemo, useState } from "react";
import styles from "./PainelClient.module.css";

type Inscrito = {
  dataHorario: string;
  nome: string;
  cracha: string;
  nascimento: string;
  whatsapp: string;
  email: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  macro: string;
  ger: string;
  ged: string;
  funcao: string;
  cursilho: string;
  alergia: string;
  alergiaDesc: string;
  restricao: string;
  restricaoDesc: string;
  camiseta: string;
  pagamento: string;
  comprovante: string;
};

type Props = {
  inscritosTabela: Inscrito[];
};

function uniqueSorted(values: string[]) {
  return Array.from(
    new Set(values.map((v) => String(v || "").trim()).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export default function PainelClient({ inscritosTabela }: Props) {
  const [busca, setBusca] = useState("");
  const [filtroPagamento, setFiltroPagamento] = useState("");
  const [filtroGer, setFiltroGer] = useState("");
  const [filtroCamiseta, setFiltroCamiseta] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const gers = useMemo(
    () => uniqueSorted(inscritosTabela.map((item) => item.ger)),
    [inscritosTabela],
  );

  const camisetas = useMemo(
    () => uniqueSorted(inscritosTabela.map((item) => item.camiseta)),
    [inscritosTabela],
  );

  const pagamentos = useMemo(
    () => uniqueSorted(inscritosTabela.map((item) => item.pagamento)),
    [inscritosTabela],
  );

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return inscritosTabela.filter((item) => {
      const matchBusca =
        !termo ||
        String(item.nome).toLowerCase().includes(termo) ||
        String(item.cracha).toLowerCase().includes(termo) ||
        String(item.email).toLowerCase().includes(termo) ||
        String(item.whatsapp).toLowerCase().includes(termo) ||
        String(item.cidade).toLowerCase().includes(termo) ||
        String(item.ged).toLowerCase().includes(termo) ||
        String(item.ger).toLowerCase().includes(termo);

      const matchPagamento =
        !filtroPagamento || String(item.pagamento) === filtroPagamento;

      const matchGer = !filtroGer || String(item.ger) === filtroGer;

      const matchCamiseta =
        !filtroCamiseta || String(item.camiseta) === filtroCamiseta;

      return matchBusca && matchPagamento && matchGer && matchCamiseta;
    });
  }, [inscritosTabela, busca, filtroPagamento, filtroGer, filtroCamiseta]);

  const temFiltrosAtivos =
    busca || filtroPagamento || filtroGer || filtroCamiseta;

  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <h2 className={styles.title}>Tabela de Inscritos:</h2>

            <div className={styles.headerRight}>
              <div className={styles.resultCount}>
                {filtrados.length} resultado(s)
              </div>

              <button
                type="button"
                onClick={() => setMostrarFiltros((prev) => !prev)}
                className={`${styles.filterToggle} ${
                  mostrarFiltros ? styles.filterToggleActive : ""
                }`}
              >
                {mostrarFiltros ? "Fechar filtros" : "Filtros"}
              </button>
            </div>
          </div>

          {mostrarFiltros && (
            <>
              <div className={styles.filtersGrid}>
                <input
                  type="text"
                  placeholder="Buscar por nome, e-mail, cidade, GER, GED..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className={styles.field}
                />

                <select
                  value={filtroPagamento}
                  onChange={(e) => setFiltroPagamento(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Todos os pagamentos</option>
                  {pagamentos.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <select
                  value={filtroGer}
                  onChange={(e) => setFiltroGer(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Todos os GERs</option>
                  {gers.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <select
                  value={filtroCamiseta}
                  onChange={(e) => setFiltroCamiseta(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Todas as camisetas</option>
                  {camisetas.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    setBusca("");
                    setFiltroPagamento("");
                    setFiltroGer("");
                    setFiltroCamiseta("");
                  }}
                  className={styles.clearButton}
                >
                  Limpar filtros
                </button>
              </div>
            </>
          )}

          {!mostrarFiltros && temFiltrosAtivos && (
            <div className={styles.activeInfo}>
              Há filtros ativos aplicados.
            </div>
          )}
        </div>

        <div className={styles.tableOuter}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr className={styles.headRow}>
                {[
                  "Data/Horário",
                  "Nome",
                  "Nome (Crachá)",
                  "Data Nascimento",
                  "WhatsApp",
                  "Email",
                  "Rua",
                  "Número",
                  "Bairro",
                  "Cidade",
                  "Macrorregional",
                  "GER",
                  "GED",
                  "Função",
                  "Cursilho",
                  "Alergia",
                  "Alergia (Descrição)",
                  "Restrição Alimentar",
                  "Restrição (Descrição)",
                  "Camiseta",
                  "Pagamento",
                  "Comprovante",
                ].map((head) => (
                  <th key={head} className={styles.th}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtrados.map((item, index) => (
                <tr
                  key={`${item.nome}-${index}`}
                  className={`${styles.row} ${
                    index % 2 === 0 ? styles.rowAlt : ""
                  }`}
                >
                  <td className={styles.td}>{String(item.dataHorario)}</td>
                  <td className={styles.td}>{String(item.nome)}</td>
                  <td className={styles.td}>{String(item.cracha)}</td>
                  <td className={styles.td}>{String(item.nascimento)}</td>
                  <td className={styles.td}>{String(item.whatsapp)}</td>
                  <td className={styles.td}>{String(item.email)}</td>
                  <td className={styles.td}>{String(item.rua)}</td>
                  <td className={styles.td}>{String(item.numero)}</td>
                  <td className={styles.td}>{String(item.bairro)}</td>
                  <td className={styles.td}>{String(item.cidade)}</td>
                  <td className={styles.td}>{String(item.macro)}</td>
                  <td className={styles.td}>{String(item.ger)}</td>
                  <td className={styles.td}>{String(item.ged)}</td>
                  <td className={styles.td}>{String(item.funcao)}</td>
                  <td className={styles.td}>{String(item.cursilho)}</td>
                  <td className={styles.td}>{String(item.alergia)}</td>
                  <td className={styles.td}>{String(item.alergiaDesc)}</td>
                  <td className={styles.td}>{String(item.restricao)}</td>
                  <td className={styles.td}>{String(item.restricaoDesc)}</td>
                  <td className={styles.td}>{String(item.camiseta)}</td>
                  <td className={styles.td}>{String(item.pagamento)}</td>
                  <td className={styles.td}>
                    {item.comprovante ? (
                      <a
                        href={String(item.comprovante)}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.link}
                      >
                        Abrir comprovante
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}

              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={22} className={styles.empty}>
                    Nenhum inscrito encontrado com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
