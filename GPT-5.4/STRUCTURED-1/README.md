# Sistema de Análise de Crédito

Aplicação web desenvolvida com Next.js para avaliar aprovação de crédito com base em regras de negócio simples e persistência local em `localStorage`.

## Estrutura de pastas

```text
.
|-- app
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- components
|   `-- CreditAnalysisForm.tsx
|-- lib
|   |-- business
|   |   `-- creditAnalysis.ts
|   `-- persistence
|       `-- analysisStorage.ts
|-- types
|   `-- credit.ts
|-- .gitignore
|-- next-env.d.ts
|-- next.config.ts
|-- package.json
|-- README.md
`-- tsconfig.json
```

## Regras de negócio implementadas

1. O cliente precisa ter 18 anos ou mais.
2. O empréstimo é dividido em 12 parcelas fixas.
3. A parcela não pode comprometer mais de 30% da renda mensal.
4. O cliente não pode possuir histórico negativado.
5. O crédito só é aprovado quando todas as condições forem atendidas.

## Principais arquivos

### `app/page.tsx`

Responsável por montar a página principal e renderizar o formulário de análise.

### `components/CreditAnalysisForm.tsx`

Contém a interface do formulário, exibição do resultado e leitura do histórico salvo.

### `lib/business/creditAnalysis.ts`

Centraliza a lógica de negócio da avaliação de crédito, mantendo a regra desacoplada da interface.

### `lib/persistence/analysisStorage.ts`

Cuida da persistência dos logs no `localStorage`, registrando data/hora, dados do cliente e resultado.

### `types/credit.ts`

Define os tipos compartilhados da aplicação para manter o código organizado e seguro.

## Como executar o projeto

1. Acesse a pasta do projeto:

```bash
cd /Users/alexandre/Documents/trabalho-egs-experimental/GPT-5.4/STRUCTURED-1
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Abra no navegador:

```text
http://localhost:3000
```

## Observações

- Os logs ficam salvos no navegador do usuário por meio de `localStorage`.
- O histórico exibido na tela mostra as 5 análises mais recentes.
- A organização está separada em UI, negócio e persistência para facilitar manutenção e evolução.
