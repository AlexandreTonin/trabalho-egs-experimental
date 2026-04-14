# Aplicacao de Analise de Credito com Next.js

Aplicacao web completa para analisar credito de clientes com base em regras simples de negocio e registrar cada avaliacao em um arquivo JSON local.

## Funcionalidades

- Formulario com os campos idade, renda mensal, historico de dividas e valor do emprestimo.
- Resultado da analise exibido como `Aprovado` ou `Reprovado`.
- Regras de aprovacao:
  - cliente precisa ter 18 anos ou mais;
  - parcela fixa em 12 meses nao pode comprometer mais de 30% da renda mensal;
  - historico de dividas precisa estar `limpo`.
- Persistencia de logs em `data/credit-analysis-logs.json`.
- Interface modular separada da logica de negocio.

## Estrutura

- `app/page.tsx`: pagina principal.
- `components/CreditAnalysisForm.tsx`: formulario, envio e estado da UI.
- `components/ResultCard.tsx`: exibicao do resultado detalhado.
- `components/LogsList.tsx`: historico das ultimas analises.
- `lib/credit-analysis.ts`: validacao e regra de negocio.
- `lib/log-store.ts`: leitura e gravacao dos logs em arquivo JSON.
- `app/api/credit-analysis/route.ts`: endpoint para buscar logs e analisar credito.

## Como executar

1. Instale as dependencias:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Abra o navegador em:

```text
http://localhost:3000
```

## Build de producao

```bash
npm run build
npm run start
```

## Observacoes

- A parcela mensal foi simplificada para `valor do emprestimo / 12`, sem juros.
- Cada analise salva data, hora, dados do cliente, valor da parcela, percentual de comprometimento e resultado final.
- Se quiser alterar a politica de credito, ajuste as constantes em `lib/credit-analysis.ts`.
