"use client";

import { useEffect, useState } from "react";
import {
  analyzeCredit,
  formatCurrency,
  formatPercentage
} from "@/lib/business/creditAnalysis";
import {
  getAnalysisLogs,
  saveAnalysisLog
} from "@/lib/persistence/analysisStorage";
import type {
  CreditAnalysisLog,
  CreditAnalysisResult,
  CreditFormData
} from "@/types/credit";

const initialFormData: CreditFormData = {
  idade: 18,
  rendaMensal: 0,
  historicoDividas: "limpo",
  valorEmprestimo: 0
};

export function CreditAnalysisForm() {
  const [formData, setFormData] = useState<CreditFormData>(initialFormData);
  const [result, setResult] = useState<CreditAnalysisResult | null>(null);
  const [logs, setLogs] = useState<CreditAnalysisLog[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setLogs(getAnalysisLogs());
  }, []);

  function updateField<K extends keyof CreditFormData>(
    field: K,
    value: CreditFormData[K]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value
    }));
  }

  function validateForm(data: CreditFormData): string | null {
    if (data.idade <= 0) {
      return "Informe uma idade válida.";
    }

    if (data.rendaMensal <= 0) {
      return "Informe uma renda mensal maior que zero.";
    }

    if (data.valorEmprestimo <= 0) {
      return "Informe um valor de empréstimo maior que zero.";
    }

    return null;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateForm(formData);

    if (validationError) {
      setError(validationError);
      setResult(null);
      return;
    }

    setError("");

    const analysis = analyzeCredit(formData);
    const savedLog = saveAnalysisLog(formData, analysis);

    setResult(analysis);
    setLogs((current) => [savedLog, ...current]);
  }

  return (
    <div className="panel-grid">
      <article className="card form-card">
        <h2>Dados do cliente</h2>
        <p className="section-text">
          O sistema calcula a parcela fixa em 12 vezes e verifica se a renda,
          idade e histórico financeiro permitem aprovar o crédito.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="idade">Idade</label>
              <input
                id="idade"
                type="number"
                min="0"
                value={formData.idade}
                onChange={(event) =>
                  updateField("idade", Number(event.target.value))
                }
              />
            </div>

            <div className="field">
              <label htmlFor="rendaMensal">Renda mensal</label>
              <input
                id="rendaMensal"
                type="number"
                min="0"
                step="0.01"
                value={formData.rendaMensal}
                onChange={(event) =>
                  updateField("rendaMensal", Number(event.target.value))
                }
              />
            </div>

            <div className="field">
              <label htmlFor="historicoDividas">Histórico de dívidas</label>
              <select
                id="historicoDividas"
                value={formData.historicoDividas}
                onChange={(event) =>
                  updateField(
                    "historicoDividas",
                    event.target.value as CreditFormData["historicoDividas"]
                  )
                }
              >
                <option value="limpo">Limpo</option>
                <option value="negativado">Negativado</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="valorEmprestimo">Valor do empréstimo</label>
              <input
                id="valorEmprestimo"
                type="number"
                min="0"
                step="0.01"
                value={formData.valorEmprestimo}
                onChange={(event) =>
                  updateField("valorEmprestimo", Number(event.target.value))
                }
              />
            </div>
          </div>

          {error ? (
            <p className="error-text">{error}</p>
          ) : (
            <p className="helper-text">
              O resultado será salvo automaticamente no histórico local do
              navegador.
            </p>
          )}

          <button className="submit-button" type="submit">
            Analisar crédito
          </button>
        </form>
      </article>

      <aside className="card result-card">
        <h2>Resultado da análise</h2>
        <p className="section-text">
          A aprovação depende de atender todas as regras de negócio definidas.
        </p>

        {result ? (
          <>
            <div
              className={`status ${
                result.aprovado ? "status--approved" : "status--rejected"
              }`}
            >
              {result.aprovado ? "Aprovado" : "Reprovado"}
            </div>

            <div className="summary-grid">
              <div className="summary-item">
                <span>Parcela mensal</span>
                <strong>{formatCurrency(result.parcelaMensal)}</strong>
              </div>
              <div className="summary-item">
                <span>Comprometimento da renda</span>
                <strong>{formatPercentage(result.percentualComprometido)}</strong>
              </div>
            </div>

            {result.motivos.length > 0 ? (
              <>
                <strong>Motivos da reprovação</strong>
                <ul className="reasons-list">
                  {result.motivos.map((motivo) => (
                    <li key={motivo}>{motivo}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="helper-text">
                Todas as condições foram atendidas e o crédito pode ser
                aprovado.
              </p>
            )}
          </>
        ) : (
          <p className="helper-text">
            Preencha o formulário e envie os dados para visualizar a decisão.
          </p>
        )}

        <div className="history-section">
          <h2>Logs das análises</h2>

          {logs.length > 0 ? (
            <ul className="history-list">
              {logs.slice(0, 5).map((log) => (
                <li className="history-item" key={log.id}>
                  <strong>{log.resultado}</strong>{" "}
                  em{" "}
                  {new Date(log.dataHora).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short"
                  })}
                  {" - "}
                  renda {formatCurrency(log.cliente.rendaMensal)}
                  {", "}
                  empréstimo {formatCurrency(log.cliente.valorEmprestimo)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="helper-text">
              Nenhuma análise registrada até o momento.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
