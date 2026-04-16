# Aplicação de Análise de Crédito

Aplicação web criada com `Next.js 16.2.4`, usando App Router, TypeScript e persistência de logs em `LocalStorage`.

## Estrutura de pastas

```text
.
├── app
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── src
│   ├── repository
│   │   └── creditLogRepository.ts
│   ├── service
│   │   └── creditAnalysisService.ts
│   ├── types
│   │   └── credit.ts
│   ├── ui
│   │   └── components
│   │       ├── CreditAnalysisScreen.tsx
│   │       ├── CreditForm.tsx
│   │       ├── CreditLogsPanel.tsx
│   │       └── CreditResultCard.tsx
│   └── validation
│       └── creditValidation.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Como cada camada funciona

- `UI`: renderiza formulário, resultado e histórico de logs. Não calcula regras de crédito.
- `Service`: transforma os dados do formulário, calcula parcela em 12x, calcula comprometimento de renda, decide aprovação e dispara o salvamento do log.
- `Validation`: valida maioridade, renda, valor do empréstimo, histórico de dívidas e limite de 30% da renda.
- `Repository`: é a única camada que acessa `LocalStorage` para salvar e listar os logs.

## Regras de negócio implementadas

- Cliente precisa ter `18` anos ou mais.
- Parcela é calculada com `12` parcelas fixas.
- A parcela não pode comprometer mais de `30%` da renda mensal.
- Histórico de dívidas precisa estar `limpo`.
- A aprovação só acontece quando todas as condições passam.

## Logs persistidos

Cada log salva:

- Data e hora da análise
- Dados do cliente
- Resultado da análise
- Valor da parcela
- Taxa de comprometimento da renda

## Como rodar

```bash
npm install
npm run dev
```

Depois, abra [http://localhost:3000](http://localhost:3000).
