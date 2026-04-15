# Sistema de Analise de Credito

Aplicacao web em Next.js para avaliar a aprovacao de credito de clientes com base em regras de negocio fixas.

## Regras aplicadas

- Cliente deve ter 18 anos ou mais
- O emprestimo e dividido em 12 parcelas fixas
- A parcela nao pode comprometer mais de 30% da renda mensal
- O historico de dividas deve estar limpo
- O credito so e aprovado quando todas as regras forem satisfeitas

## Como executar

1. Instale as dependencias:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Acesse a aplicacao em `http://localhost:3000`

## Persistencia

Cada analise e registrada em `data/analysis-logs.json`, contendo:

- data e hora
- dados do cliente
- resultado da avaliacao
