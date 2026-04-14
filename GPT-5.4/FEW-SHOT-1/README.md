# Aplicação de análise de crédito com Next.js

Este projeto implementa uma aplicação web em **Next.js 16.2.3** para análise de crédito de clientes com:

- formulário para captura dos dados do cliente;
- regras de negócio separadas da interface;
- validações específicas por responsabilidade;
- cálculo de parcela em 12 meses;
- avaliação de comprometimento de renda;
- reprovação automática para clientes negativados;
- persistência de logs no `localStorage`.

## Estrutura do projeto

```text
src/
  app/                 # Páginas, layout global e estilos
  components/          # Componentes de interface
  repositories/        # Persistência
  services/            # Regras de negócio
  types/               # Tipagens compartilhadas
  utils/               # Utilitários e logger
  validation/          # Validações isoladas
```

## Regras implementadas

1. O cliente deve ter **18 anos ou mais**.
2. A análise considera **12 parcelas fixas**.
3. A parcela não pode comprometer mais de **30% da renda mensal**.
4. Clientes com histórico **negativado** são reprovados.
5. Cada análise gera um log com data/hora, dados de entrada e resultado.

## Como executar

### Pré-requisitos

- Node.js 20.9 ou superior
- npm 10 ou superior

### Instalação

```bash
npm install
```

### Ambiente de desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Build de produção

```bash
npm run build
npm run start
```

### Verificação de qualidade

```bash
npm run lint
```

## Fluxo da aplicação

1. O usuário preenche idade, renda, histórico de dívidas e valor do empréstimo.
2. O componente da interface envia os dados ao serviço `analyzeCredit`.
3. O serviço aplica as validações e regras de negócio.
4. O resultado é exibido como `Aprovado` ou `Reprovado`.
5. O logger registra a análise no `localStorage`.

## Observações

- A persistência está feita no navegador com `localStorage`, o que atende ao requisito de armazenamento simples.
- Se você quiser, essa estrutura pode ser evoluída depois para uma API com persistência em arquivo JSON ou banco de dados sem alterar a interface principal.
