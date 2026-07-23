# Nivex Control

Sistema de controle operacional Nivex, construído sobre TanStack Start + React 19 + Tailwind v4.

## Ambientes

Este projeto usa deliberadamente três ambientes distintos. Não os confunda.

| Contexto | Node | npm | Papel |
|---|---|---|---|
| Sandbox interno do Lovable | 22.x | 10.x (nativo) | Execução local do preview e experimentos. **Não é validação oficial.** |
| Gerenciador canônico do projeto | — | **11.18.0** | Fixado em `packageManager` e usado para gerar o `package-lock.json`. Pode ser invocado sobre o Node 22 do sandbox via `npx npm@11.18.0 ...`. |
| Ambiente oficial de validação | **24 LTS** | **11.18.0** | GitHub Actions (`.github/workflows/quality-node24.yml`). É o único ambiente considerado validação oficial. |

- O `.nvmrc` indica **Node 24**, que é a versão oficial de desenvolvimento local recomendada.
- `engines.node` está fixado em `^24.0.0` e `engines.npm` em `^11.0.0`.
- O `package-lock.json` é gerado pelo **npm 11.18.0**, mesmo quando executado sobre o Node 22 do sandbox.
- Uma execução local em Node 22 é sempre rotulada como **“validação local provisória”**, nunca como validação oficial de Node 24.

## Scripts

```sh
npm run lint         # ESLint
npm run typecheck    # TypeScript oficial (tsc --noEmit)
npm run test         # Vitest — teste comportamental
npm run test:watch   # Vitest em modo watch
npm run test:a11y    # Vitest — teste de acessibilidade (jest-axe)
npm run e2e          # Playwright — Chromium
npm run build        # Build de produção (Vite + Nitro)
```

## Validação oficial (GitHub Actions)

O workflow `quality-node24.yml`:

- roda em pull requests, pushes em `main` e `workflow_dispatch`;
- usa apenas ações oficiais do GitHub;
- possui somente `contents: read` de permissão;
- não usa segredos e não publica nada;
- prepara Node 24, instala e confirma npm 11.18.0;
- executa `npm ci`, `lint`, `typecheck`, `test`, `test:a11y`, `e2e` (Chromium) e `build`;
- confirma que `src/routeTree.gen.ts` não é alterado pelo build.

A LV-01.2B.1 só é considerada concluída quando esse workflow passa integralmente em Node 24 + npm 11.18.0.
