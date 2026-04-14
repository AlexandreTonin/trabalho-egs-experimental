# Aplicação de Análise de Crédito

Aplicação web construída com Next.js para análise de crédito de clientes, com separação entre interface, validações, regras de negócio e persistência de logs em LocalStorage.

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior

## Como executar

1. Instale as dependências:

```bash
npm install
```

2. Execute o servidor de desenvolvimento:

```bash
npm run dev
```

3. Acesse a aplicação em:

```bash
http://localhost:3000
```

## Scripts disponíveis

- `npm run dev`: inicia a aplicação em modo de desenvolvimento
- `npm run build`: gera a versão de produção
- `npm run start`: inicia a aplicação em modo de produção
- `npm run lint`: executa a análise estática com ESLint

## Regras da análise de crédito

- O cliente deve ter 18 anos ou mais
- O histórico de dívidas deve ser `limpo`
- A parcela fixa do empréstimo em 12 meses não pode comprometer mais de 30% da renda mensal

## Estrutura do projeto

- `app/`: páginas, layout global e estilos
- `components/`: componentes de interface
- `service/`: regras de negócio e processamento da análise
- `validation/`: validações de entrada e elegibilidade
- `utils/`: cálculos auxiliares e logger
- `repository/`: abstração de persistência em LocalStorage
- `types/`: contratos tipados compartilhados

## Persistência de logs

Cada análise é salva no `localStorage` do navegador com:

- data e hora da avaliação
- dados informados no formulário
- resultado da análise

## Observação

O projeto usa LocalStorage para facilitar a execução sem backend. Se quiser, a próxima evolução pode ser adicionar uma API com Node.js e Express persistindo em arquivo JSON.
