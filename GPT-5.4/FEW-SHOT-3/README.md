# Aplicação de Análise de Crédito com Next.js

Aplicação web completa para análise de crédito de clientes, construída com **Next.js 15**, **React 19** e **TypeScript**, seguindo o padrão de separação de responsabilidades mostrado no exemplo:

- `validation/`: validação dos dados de entrada e regras básicas.
- `service/`: regras de negócio da análise de crédito.
- `repository/`: persistência de logs em arquivo JSON.
- `utils/`: cálculos e formatação.
- `components/`: interface web.
- `app/api/analyses`: endpoint para análise e registro dos logs.

## Regras de negócio implementadas

O crédito só é **aprovado** quando todas as condições abaixo forem atendidas:

1. O cliente tem **18 anos ou mais**.
2. A parcela fixa em **12 vezes** não compromete mais de **30% da renda mensal**.
3. O histórico de dívidas está como **`limpo`**.

Cada análise gera um log contendo:

- Data e hora da análise.
- Dados do cliente.
- Resultado final.
- Detalhamento do cálculo e motivos da aprovação ou reprovação.

## Como executar

### 1. Instalar dependências

```bash
npm install
```

### 2. Rodar em desenvolvimento

```bash
npm run dev
```

Depois, abra [http://localhost:3000](http://localhost:3000).

### 3. Gerar build de produção

```bash
npm run build
npm run start
```

## Persistência dos logs

Os logs ficam salvos em:

`data/analysis-log.json`

Esse arquivo é atualizado pela rota:

`POST /api/analyses`

Também existe a leitura dos dados pela rota:

`GET /api/analyses`

## Fluxo da aplicação

1. O usuário preenche o formulário.
2. A interface envia os dados para a API do Next.js.
3. A API valida a entrada.
4. O serviço executa a lógica da análise de crédito.
5. O repositório salva o log em JSON.
6. A interface exibe o resultado e atualiza o histórico.

## Estrutura do projeto

```text
app/
  api/analyses/route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  AnalysisHistory.tsx
  AnalysisResultCard.tsx
  CreditAnalysisForm.tsx
data/
  analysis-log.json
repository/
  analysisLogRepository.ts
service/
  creditAnalysisService.ts
types/
  credit.ts
utils/
  calculation.ts
  date.ts
validation/
  creditValidation.ts
```

## Observações

- A persistência foi implementada com um backend simples dentro do próprio Next.js, usando rota de API e escrita em arquivo JSON.
- Se você quiser, depois posso adaptar este projeto para usar **Express + Node.js separado**, **LocalStorage** no navegador, ou adicionar **testes automatizados**.
