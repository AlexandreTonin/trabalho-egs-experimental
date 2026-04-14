# Aplicacao de Analise de Credito

Aplicacao web completa em Next.js para analise de credito de clientes, com:

- formulario para idade, renda mensal, historico de dividas e valor do emprestimo
- regras de aprovacao e reprovacao separadas em modulo de negocio
- API interna em Next.js para processar a analise
- registro de logs em arquivo JSON no servidor
- historico das analises exibido na interface

## Requisitos

- Node.js 20.11+ ou superior
- npm 10+ ou superior

## Como executar

1. Instale as dependencias:

```bash
npm install
```

2. Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

3. Acesse a aplicacao em:

```text
http://localhost:3000
```

## Scripts disponiveis

- `npm run dev`: inicia a aplicacao em desenvolvimento
- `npm run build`: gera o build de producao
- `npm run start`: inicia o build de producao

## Regras de negocio implementadas

O credito so e aprovado quando todas as condicoes abaixo sao verdadeiras:

- cliente tem 18 anos ou mais
- historico de dividas esta como `limpo`
- a parcela mensal, considerando 12 parcelas fixas, nao ultrapassa 30% da renda mensal

## Estrutura principal

- `app/page.tsx`: pagina inicial
- `app/api/analyze/route.ts`: endpoint para analisar credito e listar logs
- `components/credit-analysis-app.tsx`: interface cliente
- `lib/credit-analysis.ts`: validacao e logica de negocio
- `lib/log-storage.ts`: leitura e escrita dos logs em JSON
- `data/analysis-log.json`: arquivo criado automaticamente ao primeiro uso

## Persistencia de logs

Cada analise gera um registro contendo:

- data e hora da solicitacao
- dados informados no formulario
- resultado final da analise

Os logs sao persistidos no arquivo `data/analysis-log.json`.

## Observacoes tecnicas

- o projeto usa App Router do Next.js
- a interface e separada da logica de negocio para facilitar manutencao
- a API do proprio Next.js substitui a necessidade de um servidor Express separado neste exemplo
