# Aplicacao de Analise de Credito

Aplicacao web completa em Next.js para analise de credito com camadas separadas em `UI`, `Service`, `Validation` e `Repository`.

## Estrutura de pastas

```text
.
|-- app
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- src
|   |-- repository
|   |   `-- logRepository.ts
|   |-- service
|   |   `-- creditAnalysisService.ts
|   |-- types
|   |   `-- credit.ts
|   |-- ui
|   |   `-- components
|   |       `-- CreditForm.tsx
|   `-- validation
|       `-- creditValidation.ts
|-- eslint.config.mjs
|-- next.config.ts
|-- next-env.d.ts
|-- package.json
`-- tsconfig.json
```

## Como as camadas funcionam

- `UI`: renderiza o formulario, captura eventos e mostra o resultado sem conter regras de aprovacao.
- `Service`: aplica as regras de negocio, calcula parcela e comprometimento, decide aprovado ou reprovado e solicita o registro do log.
- `Validation`: valida os dados de entrada para garantir que idade, renda, emprestimo e historico sejam validos.
- `Repository`: isola o acesso ao `localStorage` e persiste os logs em JSON.

## Regras implementadas

- Cliente precisa ter 18 anos ou mais.
- A parcela e calculada em 12 parcelas fixas.
- A parcela nao pode comprometer mais de 30% da renda mensal.
- Historico de dividas deve estar `limpo`.
- O cliente e aprovado apenas quando todas as condicoes sao atendidas.

## Logs

Cada analise salva um log com:

- Data e hora em formato ISO.
- Dados informados do cliente.
- Resultado final da analise.

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).
