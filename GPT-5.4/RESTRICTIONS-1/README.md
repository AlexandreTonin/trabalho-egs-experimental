# Aplicacao de Analise de Credito

## Estrutura de pastas

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  repositories/
    creditLogRepository.ts
  services/
    creditAnalysisService.ts
  types/
    credit.ts
  ui/
    components/
      AnalysisResult.tsx
      CreditForm.tsx
      LogList.tsx
    hooks/
      useCreditAnalysis.ts
    pages/
      CreditAnalysisPage.tsx
  validations/
    creditValidation.ts
```

## Como cada camada funciona

- `UI`: renderiza tela, formulario, resultado e lista de logs. Nao aplica regras de negocio.
- `Service`: executa a analise de credito, calcula parcela, decide aprovacao e monta o log.
- `Validation`: concentra validacoes reutilizaveis, como idade minima e valores positivos.
- `Repository`: faz a persistencia no `localStorage`, sem expor esse detalhe para a regra de negocio.

## Regras de negocio implementadas

- Cliente deve ter 18 anos ou mais.
- Parcela fixa em 12 vezes.
- Parcela nao pode comprometer mais de 30% da renda mensal.
- Historico `negativado` reprova a analise.
- Aprovacao apenas quando nenhuma regra gerar motivo de reprovacao.

## Como rodar

1. Instale as dependencias:

```bash
npm install
```

2. Rode o projeto em desenvolvimento:

```bash
npm run dev
```

3. Abra `http://localhost:3000`.

## Persistencia

- Os logs ficam salvos no `localStorage` do navegador na chave `credit-analysis-logs`.
- Cada registro armazena data/hora, dados do cliente e resultado da analise.
