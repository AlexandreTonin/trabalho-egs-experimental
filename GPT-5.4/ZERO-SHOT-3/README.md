# Aplicacao de Analise de Credito

Aplicacao web completa desenvolvida com Next.js 16 e backend em Node.js + Express para analisar pedidos de emprestimo e registrar logs persistidos em arquivo JSON.

## O que o projeto faz

- Exibe um formulario com idade, renda mensal, historico de dividas e valor do emprestimo solicitado.
- Avalia se o cliente:
  - tem 18 anos ou mais;
  - compromete no maximo 30% da renda mensal com uma parcela fixa em 12 vezes;
  - possui historico de dividas limpo.
- Mostra o resultado da analise como `Aprovado` ou `Reprovado`.
- Registra cada analise com data, hora, dados informados e resultado em `server/data/analysis-logs.json`.
- Exibe as ultimas analises registradas na interface.

## Tecnologias

- Next.js 16.2.3
- React 19
- TypeScript
- Express 5
- JSON file storage

## Como executar

### 1. Instale as dependencias

```bash
npm install
```

### 2. Rode frontend e backend juntos

```bash
npm run dev
```

Servicos iniciados:

- Frontend Next.js: [http://localhost:3000](http://localhost:3000)
- API Express: [http://localhost:3001](http://localhost:3001)

### 3. Scripts disponiveis

```bash
npm run dev
npm run dev:web
npm run dev:server
npm run lint
npm run build
```

## Estrutura principal

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    credit-analysis-form.tsx
  lib/
    credit-analysis.ts
    formatters.ts
  types/
    credit.ts
server/
  data/
    analysis-logs.json
  index.ts
```

## Regras de negocio implementadas

1. O cliente precisa ter 18 anos ou mais.
2. O emprestimo e dividido em 12 parcelas fixas.
3. A parcela mensal nao pode ultrapassar 30% da renda mensal.
4. Clientes com historico `negativado` sao reprovados.

O credito so e aprovado quando todas as regras forem atendidas.

## Persistencia dos logs

Cada analise enviada ao backend gera um registro com:

- identificador unico;
- data e hora da analise;
- dados do cliente;
- resultado completo da avaliacao.

Esses dados ficam gravados no arquivo:

```text
server/data/analysis-logs.json
```

## Observacoes

- O frontend usa a variavel `NEXT_PUBLIC_API_URL` caso voce queira apontar para outra API.
- Por padrao, a aplicacao espera o backend em `http://localhost:3001`.
- A interface foi separada da regra de negocio para facilitar manutencao e testes.
