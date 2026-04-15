# Sistema de Analise de Credito

Aplicacao web completa em Next.js para avaliar a aprovacao de credito de clientes com base em regras de negocio fixas, exibindo o resultado na interface e registrando logs em arquivo JSON.

## Estrutura de pastas

```text
STRUCTURED-3/
├── app/
│   ├── api/
│   │   └── analysis/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── credit-analysis-form.module.css
│   └── credit-analysis-form.tsx
├── data/
│   └── .gitkeep
├── lib/
│   ├── credit-analysis.ts
│   ├── log-storage.ts
│   └── validation.ts
├── types/
│   └── credit.ts
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── README.md
└── tsconfig.json
```

## Regras de negocio aplicadas

- Cliente deve ter 18 anos ou mais
- O emprestimo e dividido em 12 parcelas fixas
- A parcela nao pode comprometer mais de 30% da renda mensal
- O historico de dividas deve estar limpo
- O credito so e aprovado quando todas as condicoes forem atendidas

## Principais arquivos

### `app/page.tsx`

Carrega a pagina principal e busca os ultimos logs salvos para exibir na interface.

### `components/credit-analysis-form.tsx`

Contem o formulario, o envio para a API, a exibicao de resultado e o historico recente.

### `lib/credit-analysis.ts`

Centraliza toda a logica de negocio da aprovacao.

### `lib/log-storage.ts`

Responsavel por criar e salvar o arquivo `data/analysis-logs.json`.

### `app/api/analysis/route.ts`

Recebe os dados do formulario, valida a entrada, executa a analise e registra o log.

## Como executar o projeto

1. Entre na pasta do projeto:

```bash
cd /Users/alexandre/Documents/trabalho-egs-experimental/GPT-5.4/STRUCTURED-3
```

2. Instale as dependencias:

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

5. Para validar a aplicacao antes de publicar:

```bash
npm run lint
npm run build
```

## Persistencia dos logs

Cada analise gera um registro com:

- data e hora
- dados do cliente
- resultado da avaliacao

Os registros sao armazenados em `data/analysis-logs.json`.
