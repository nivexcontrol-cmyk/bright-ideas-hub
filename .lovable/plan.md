# LV-01.3A — Auditoria e planejamento das primeiras rotas reais

Microetapa exclusivamente de análise. Nenhum arquivo será alterado. Banco, Supabase, autenticação real, API, integrações, armazenamento, e-mail, pagamentos e webhooks permanecem proibidos até o final do projeto (confirmação explícita no item 16).

---

## 1. Inventário das rotas já existentes

Somente duas rotas físicas em `src/routes/`:

- `__root.tsx` — shell HTML, `<QueryClientProvider>`, `Toaster`, `NotFoundComponent`, `ErrorComponent`, metadados OG/Twitter.
- `index.tsx` — vitrine visual concluída (LV-01.2B.1 → LV-01.2B.4), 615 linhas, exibe tokens, controles, feedback e DataTable.

`routeTree.gen.ts` reflete apenas `/` (69 linhas, hash aprovado em LV-01.2B.4.3).

Nenhuma outra rota de aplicação existe. Nenhum shell operacional, nenhum layout autenticado, nenhum menu.

## 2. Mapa das rotas visuais previstas pela documentação, por perfil

Derivado de LV-00A.2.1 (permissões e escopos), LV-00A.2.2.1–2.2.8 (modelo canônico) e da ordem funcional aprovada. Todas as rotas abaixo são **visuais e mockadas**; nenhuma toca banco.

### Estrutura comum (não é perfil, é chassi)
- `/entrada` — tela visual de entrada (simulação de login, sem autenticação).
- `/app` — layout raiz operacional (shell responsivo, cabeçalho, menu lateral desktop, navegação inferior mobile, chip de perfil + loja, seletor simulado de acesso).
- `/app/inicio` — hub inicial pós-entrada.
- `/app/perfil` — identificação visual do usuário simulado.
- `/app/loja` — identificação visual da loja simulada e troca de escopo.

### Bloco 2 — Recebimento de mercadorias (perfil: recebedor)
- `/app/recebimento` — lista de recebimentos pendentes.
- `/app/recebimento/$id` — detalhe do recebimento.
- `/app/recebimento/$id/conferencia` — conferência item a item.
- `/app/recebimento/$id/divergencias` — registro de divergências e evidências (mock).

### Bloco 3 — Repositor (perfil: repositor)
- `/app/reposicao` — fila de tarefas do repositor.
- `/app/reposicao/$id` — detalhe da tarefa (`task_pick_lines` conforme LV-00A.2.2.3).
- `/app/reposicao/$id/execucao` — execução guiada da tarefa.
- `/app/contagem` — sessões de contagem de prateleira (`shelf_count_sessions`, LV-00A.2.2.4).
- `/app/contagem/$id` — contagem em andamento.

### Bloco 4 — Supervisão e gestão da loja (perfil: supervisor/gerente de loja)
- `/app/supervisao` — painel de supervisão.
- `/app/supervisao/tarefas` — todas as tarefas da loja.
- `/app/supervisao/equipe` — designações (`task_assignments`).
- `/app/supervisao/aprovacoes` — limites de aprovação (`approval_limits`).
- `/app/loja/estoque` — saldos derivados (`stock_balances`).

### Bloco 5 — Gestão de rede e organização (perfil: gestor de rede)
- `/app/rede` — visão consolidada multi-loja.
- `/app/rede/lojas` — cadastro de lojas.
- `/app/rede/produtos` — catálogo, `product_codes`, `presentation_uses`, `conversion_rules`.
- `/app/rede/fornecedores` — fornecedores e `supplier_products`.
- `/app/rede/pessoas` — `profiles` + `membership_store_scopes`.

### Bloco 6 — Administração, suporte e integrações (perfil: admin plataforma) — apenas ao final
- `/app/admin/permissoes` — `role_permissions`.
- `/app/admin/dispositivos` — `device_authorizations`.
- `/app/admin/suporte` — `support_access_grants` (JIT).
- `/app/admin/integracoes` — `integration_inbox` + `integration_attempts`.
- `/app/admin/operacoes` — `operation_requests` (idempotência).

## 3. Rotas ainda não confirmadas documentalmente (pendências)

Marcadas como pendência conforme regra do enunciado — não decidir sozinho.

- P-01: A tela de entrada exige seletor de perfil simulado ou apenas botão "entrar como demo"? (LV-00A.2.1 não descreve UI de entrada.)
- P-02: `/app/inicio` deve variar por perfil ou ser único com blocos condicionais? Sem decisão registrada.
- P-03: Evidências (LV-00A.2.2.1, `evidences`) têm rota própria ou vivem embutidas em recebimento/reposição? Documentação silencia.
- P-04: `replenishment_destinations` (LV-00A.2.2.2) precisa de tela de manutenção ou é apenas leitura em `/app/reposicao/$id`?
- P-05: Bloco 6 exige rota para `integration_attempts` separada de `integration_inbox`?
- P-06: Escopo por loja tem UI de troca no cabeçalho ou apenas em `/app/loja`?

Cada pendência será resolvida em microetapa de decisão (padrão LV-00A) antes da implementação do bloco correspondente.

## 4. Primeira tela real a implementar

**`/entrada`** — tela visual de entrada, simulada, sem autenticação. Justificativa: é o ponto de partida funcional do produto, não conflita com `/` (vitrine), e permite validar em seguida o shell `/app` sem depender de nenhum outro bloco.

## 5. Ordem dos blocos visuais

1. Estrutura comum (entrada + shell `/app` + hub + perfil/loja simulados).
2. Recebimento de mercadorias.
3. Repositor.
4. Supervisão e gestão da loja.
5. Gestão da rede e organização.
6. Administração, suporte e integrações.

Auditoria completa obrigatória entre blocos (lint, typecheck, testes, E2E, axe, build) antes de avançar.

## 6. Divisão de cada bloco em microetapas

### Bloco 1 — Estrutura comum (≈8 microetapas)
- LV-01.3B.1 — Rota `/entrada` visual.
- LV-01.3B.2 — Layout `_app` (pathless) + `<Outlet />` + guarda simulada.
- LV-01.3B.3 — Cabeçalho `/app` (logo, chip de perfil, chip de loja).
- LV-01.3B.4 — Menu lateral desktop (shadcn sidebar).
- LV-01.3B.5 — Navegação inferior mobile.
- LV-01.3B.6 — `/app/inicio` hub.
- LV-01.3B.7 — `/app/perfil` e `/app/loja` simulados + troca de escopo mock.
- LV-01.3B.8 — Auditoria consolidada do bloco 1.

### Bloco 2 — Recebimento (≈6 microetapas)
Lista, detalhe, conferência, divergências, estados vazios/erro, auditoria.

### Bloco 3 — Repositor (≈7 microetapas)
Fila, detalhe, execução, contagem lista, contagem detalhe, mobile-first check, auditoria.

### Bloco 4 — Supervisão (≈6 microetapas)
Painel, tarefas, equipe, aprovações, estoque derivado, auditoria.

### Bloco 5 — Rede (≈7 microetapas)
Visão consolidada, lojas, produtos, fornecedores, pessoas, tratamento de listas grandes com DataTable, auditoria.

### Bloco 6 — Admin (≈6 microetapas)
Permissões, dispositivos, suporte JIT, integrações inbox, integrações attempts, operações idempotentes + auditoria final.

## 7. Estimativa total

Aproximadamente **40 microetapas visuais** (8 + 6 + 7 + 6 + 7 + 6), sem contar erratas e correções localizadas.

## 8. Arquivos criados/alterados na primeira implementação (LV-01.3B.1 — `/entrada`)

Criar:
- `src/routes/entrada.tsx`
- `src/mocks/session.ts` (perfis simulados)
- `src/test/routes/entrada.test.tsx`
- Bloco novo em `e2e/vitrine.spec.ts` OU novo `e2e/entrada.spec.ts` (a decidir na microetapa).

Alterar (mínimo):
- `src/routeTree.gen.ts` — apenas via regeneração oficial do TanStack.

Não alterar: `src/routes/index.tsx` (vitrine intocada), `__root.tsx` (apenas se metadados de entrada exigirem, o que será decisão explícita), `styles.css`, componentes UI, `package.json`, workflow, locks.

## 9. Componentes existentes reutilizados

- `Button`, `Input`, `Label`, `Card`, `Select`, `RadioGroup` (LV-01.2B.2).
- `Alert`, `StatusBadge`, `EmptyState`, `ErrorState`, `LoadingState`, `NoPermissionState`, `Toaster` (LV-01.2B.3).
- `DataTable` + `DataTableMobileCard` + toolbar/pagination (LV-01.2B.4).
- `FormField` (LV-01.2B.2).
- Tokens semânticos de `src/styles.css`.

Componentes shadcn ainda não usados que passarão a ser usados no bloco 1: `sidebar`, `sheet` (drawer mobile), `avatar`, `dropdown-menu`, `separator`, `tabs`.

## 10. Dados mockados necessários (bloco 1)

- `src/mocks/session.ts` — 3 perfis simulados (repositor, supervisor, gestor de rede) com `profile`, `store`, `role_permissions` reduzidos.
- `src/mocks/stores.ts` — 2 a 3 lojas fictícias.
- Nenhuma persistência: estado em memória via Zustand leve **ou** `useState` no layout; decisão será tomada na LV-01.3B.2.

## 11. Fluxos entre telas e ações simuladas

1. `/` (vitrine) permanece isolada e acessível.
2. Usuário abre `/entrada` → escolhe perfil demo → navega para `/app/inicio`.
3. Cabeçalho exibe chip de perfil e chip de loja; clicar em qualquer chip navega para `/app/perfil` ou `/app/loja`.
4. Menu lateral (desktop) e barra inferior (mobile) navegam entre `/app/inicio`, `/app/recebimento`, `/app/reposicao`, etc. Rotas ainda não implementadas exibem `EmptyState` "Em breve".
5. Ação "sair" retorna a `/entrada` limpando o mock de sessão.

## 12. Comportamento desktop e mobile

- Desktop (≥1024px): sidebar fixa à esquerda, cabeçalho superior, conteúdo com `max-width` controlado.
- Tablet (768–1023px): sidebar colapsável via `SidebarTrigger`.
- Mobile (<768px): sidebar em `Sheet`/drawer, barra de navegação inferior com 4–5 destinos principais, DataTable no modo cards (já implementado).
- Toques ≥44px, foco visível 3px (padrão validado em LV-01.2B.3).

## 13. Critérios de aceite e testes por microetapa

Para cada microetapa visual:
- Renderização correta em desktop e mobile.
- Teste comportamental Vitest cobrindo interações principais.
- Teste `jest-axe` sem violações.
- E2E Playwright do fluxo mínimo da rota (navegação + ação principal).
- `lint`, `typecheck`, `test`, `test:a11y`, `e2e`, `build` verdes.
- `src/routeTree.gen.ts` regenerado somente pelo TanStack.
- Estabilidade do routeTree confirmada com 3 builds consecutivos quando houver nova rota.

## 14. Riscos de conflito com a documentação

- R-01: Adotar rota `/app/*` sem confirmar prefixo pode conflitar com decisão futura sobre múltiplos apps. Mitigação: registrar decisão em LV-01.3B.2.
- R-02: Simulação de perfil sem tabela `role_permissions` real pode divergir do modelo canônico. Mitigação: mock espelha nomes canônicos LV-00A.2.2.1.
- R-03: `/app/loja` como troca de escopo pode colidir com pendência P-06.
- R-04: Uso de sidebar shadcn requer `SidebarProvider` no layout — não pode vazar para `/` (vitrine).
- R-05: Metadados OG em rotas internas podem duplicar `og:image` do root; usar `head()` por rota.

## 15. Estratégia para preservar `/` como vitrine

- `/` continua servida por `src/routes/index.tsx` sem alterações.
- Toda a aplicação operacional vive sob prefixo `/app/*` com layout próprio (`src/routes/_app.tsx` pathless, ou `src/routes/app.tsx`; escolha final na LV-01.3B.2).
- `/entrada` é rota irmã de `/`, sem layout compartilhado com a vitrine nem com o app.
- `__root.tsx` permanece neutro — não recebe sidebar, header ou provider de sessão. Esses vivem exclusivamente no layout `_app`.
- Nenhum componente da vitrine importa mocks de sessão; nenhum componente do app importa a vitrine.

## 16. Confirmação explícita

Banco de dados, Supabase, autenticação real, API externa, integrações, armazenamento, e-mail, pagamentos e webhooks **permanecem proibidos** durante todos os blocos visuais 1 a 6. Serão tratados exclusivamente após a conclusão e auditoria de toda a superfície visual mockada, em fase própria fora do escopo LV-01.3.

---

Plano completo apresentado para auditoria. Não avanço para LV-01.3B.
