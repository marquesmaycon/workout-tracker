# Workout Tracker

Aplicacao web para acompanhamento de treinos, academias e evolucao corporal. O projeto esta sendo desenvolvido como um produto full-stack em TypeScript, seguindo a mesma linha dos meus repositorios mais recentes: interfaces modernas, organizacao por dominio, APIs tipadas, autenticacao e persistencia real em banco relacional.

## Contexto

O `workout-tracker` nasce como mais um projeto de produto no meu portfolio, ao lado de aplicacoes como [`habit-tracker`](https://github.com/marquesmaycon/habit-tracker), [`brew-monitor`](https://github.com/marquesmaycon/brew-monitor), [`stock-forge`](https://github.com/marquesmaycon/stock-forge), [`prompt-manager`](https://github.com/marquesmaycon/prompt-manager), [`ask-room`](https://github.com/marquesmaycon/ask-room) e [`next-saas-rbac`](https://github.com/marquesmaycon/next-saas-rbac).

A ideia aqui e evoluir um tracker de fitness com a mesma abordagem desses projetos: experiencia de uso bem cuidada, stack atual, regras de negocio separadas por modulo e uma base preparada para crescer.

## Funcionalidades

- Autenticacao com e-mail e senha usando Better Auth.
- Area privada protegida por sessao.
- Cadastro e listagem de academias por usuario.
- Marcacao de academias favoritas.
- Modelo de dados preparado para treinos, exercicios, grupos musculares, sessoes de treino e historico de peso corporal.
- API tipada com oRPC para integracao entre frontend e backend.
- Banco PostgreSQL com Prisma ORM.

> Algumas telas ainda estao em desenvolvimento. Hoje a area de academias ja usa dados reais; dashboard, treinos, sessoes e logs de peso estao modelados no banco e prontos para evolucao de interface e fluxo.

## Stack

- [TanStack Start](https://tanstack.com/start) com React 19
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [TanStack Form](https://tanstack.com/form)
- [oRPC](https://orpc.unnoq.com/)
- [Better Auth](https://www.better-auth.com/)
- [Prisma](https://www.prisma.io/) + PostgreSQL
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) e Base UI
- [Vite](https://vite.dev/) + Nitro
- ESLint e Prettier

## Requisitos

- Node.js
- npm
- Docker e Docker Compose

## Ambiente

Crie um arquivo `.env.local` na raiz do projeto com a URL do banco:

```env
DATABASE_URL="postgresql://workout:workout@localhost:5432/workout_tracker"
```

Mantenha arquivos `.env*` fora do versionamento e use apenas placeholders em exemplos publicos.

## Como Rodar

Instale as dependencias:

```bash
npm install
```

Suba o PostgreSQL:

```bash
docker compose up -d
```

Gere o Prisma Client:

```bash
npm run db:generate
```

Aplique o schema no banco:

```bash
npm run db:push
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

A aplicacao roda em:

```bash
http://localhost:3000
```

## Scripts

```bash
npm run dev          # inicia o servidor de desenvolvimento
npm run build        # gera o build de producao
npm run preview      # executa o preview do build
npm run lint         # executa o ESLint
npm run format       # formata e aplica fixes de lint
npm run check        # verifica formatacao com Prettier
npm run db:generate  # gera o Prisma Client
npm run db:push      # sincroniza o schema com o banco
npm run db:migrate   # cria/aplica migrations em desenvolvimento
npm run db:studio    # abre o Prisma Studio
npm run db:seed      # executa o seed
```

## Estrutura

```txt
src/
  components/        # componentes reutilizaveis de UI e formulario
  features/          # dominios da aplicacao
    auth/            # formularios, validacoes e sessao
    gyms/            # schemas e regras do modulo de academias
  hooks/             # hooks compartilhados
  lib/               # auth, banco, query client e utilitarios
  orpc/              # procedimentos e rotas tipadas da API
  routes/            # rotas file-based do TanStack Router

prisma/
  schema.prisma      # modelos de usuario, treino, exercicio, academia e sessoes
  migrations/        # historico de migrations
  seed.ts            # seed local
```

## Modelo de Dados

O schema atual cobre:

- usuarios, sessoes, contas e verificacoes de autenticacao;
- academias vinculadas ao usuario;
- grupos musculares e exercicios;
- treinos planejados com ordem, series, repeticoes, carga, descanso e notas;
- sessoes de treino com status, academia, exercicios executados, RPE e conclusao;
- registros de peso corporal por data.

## Build e Deploy

Gere o build:

```bash
npm run build
```

Execute o servidor gerado pelo Nitro:

```bash
node dist/server/index.mjs
```

O build produz um servidor Node self-contained, adequado para hosts compativeis com Node.js, como VPS, Render, Fly.io ou outros provedores com suporte a processos Node.
