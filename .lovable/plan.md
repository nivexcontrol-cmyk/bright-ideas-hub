# Plano consolidado — Nivex Control (visual, mockado)

Versão: LV-01.3A.5 (consolidação final do plano visual)
Escopo: apenas frontend visual mockado. Sem banco, Supabase, autenticação, APIs externas, integrações, armazenamento, e-mail, pagamentos ou webhooks.

---

## 1. Princípios invioláveis

1. Rota canônica de entrada: `/entrar` (nunca `/entrada`).
2. Prefixo operacional canônico: `/app`.
3. Layout do segmento `/app`: `src/routes/app.tsx` com `<Outlet />` (nunca `_app.tsx` pathless).
4. Sessão simulada exclusivamente em React Context no arquivo `src/contexts/mock-session-context.tsx`.
5. Provider montado em `src/routes/__root.tsx`.
6. Proibidos: Zustand, `localStorage`, `sessionStorage`, cookies e qualquer persistência. Recarregar apaga o estado.
7. Apenas os quatro cenários demonstrativos aprovados:
   - Recebimento;
   - Reposição e contagem;
   - Supervisão da loja;
   - Gestão da rede.
   Cenários são demonstrativos e não concedem autorização real; a lista canônica dos 14 papéis do Nivex Control permanece fora do escopo mock.
8. Apenas as três lojas fictícias aprovadas:
   - `LOJA-001 — Unidade Centro — Curitiba/PR`;
   - `LOJA-002 — Unidade Norte — Londrina/PR`;
   - `LOJA-003 — Unidade Sul — Maringá/PR`.
   Pertencem conceitualmente a uma "Rede Demonstração"; Nivex Control é o nome do sistema, não da rede varejista.
9. Sem placeholders, sem links quebrados, sem itens desabilitados, sem rótulos "Em breve". Cada rota entra no menu apenas na microetapa que a cria.
10. `presentation_uses` é conceito documental de snapshot: não vira entidade, tabela, rota ou tela.
11. `/app/supervisao/aprovacoes` representa `approvals` (solicitações/decisões reais). `approval_limits` permanece pendente e não faz parte do bloco atual.
12. Não inventar papéis: `platform_admin` e "recebedor" não são papéis canônicos confirmados nesta fase.
13. Suporte JIT (`support_access_grants`) permanece como fluxo exclusivo e separado da administração comum.
14. Menu do primeiro bloco operacional contém somente: `/app/inicio`, `/app/perfil`, `/app/loja`.
15. `/app/loja/estoque` fica para etapa futura, não pertence ao bloco 1.
16. A vitrine `/` é preservada integralmente, sem novas seções, sem regressões visuais e sem depender do Context de sessão mock.

---

## 2. Organização oficial das fases

- LV-01 — Fundação visual: concluída (tokens, controles, feedback, DataTable, vitrine `/`).
- LV-02 — Entrada demonstrativa (`/entrar`, Context, mocks, proteção básica, `/app/inicio`).
- LV-03 — Shell operacional mockado (`/app` completo: cabeçalho, sidebar, barra inferior mobile, `/app/perfil`, `/app/loja`, ação "sair", 404 sob `/app/*`).
- LV-04 — Catálogo visual (superfícies auxiliares e componentes compartilhados adicionais que os blocos operacionais consumirão).
- LV-05 — Recebimento visual (`/app/recebimento`, `/app/recebimento/$recebimentoId`, `/conferencia`, `/divergencias`).
- LV-06 — Estoque e reposição visual (`/app/loja/estoque`, `/app/reposicao`, `/app/reposicao/$reposicaoId`, `/execucao`).
- LV-07 — Contagem e aprovações visuais (`/app/contagem`, `/app/contagem/$contagemId`, `/app/supervisao/aprovacoes`).
- LV-08 — Gestão, rede e administração visual (`/app/supervisao/*`, `/app/rede/*`, `/app/admin/*`, incluindo suporte JIT em fluxo próprio).
- Banco de dados, Supabase, autenticação real, RLS, edge functions e integrações: somente após aprovação integral de todos os protótipos visuais (LV-02 a LV-08).

---

## 3. LV-02 — Entrada demonstrativa

Objetivo do bloco: fazer surgir visualmente `/entrar`, o Context de sessão mock, os mocks de cenários e lojas, a proteção básica de `/app`, o destino real `/app/inicio` e a navegação funcional entre entrada e início. Nada além disso.

### LV-02.1 — Fluxo vertical mínimo entrada → início

Objetivo único: entregar o menor fluxo vertical funcional entre `/entrar` e `/app/inicio`, usando exclusivamente Context em memória.

Arquivos permitidos (criar/editar apenas estes):
- `src/contexts/mock-session-context.tsx` (novo)
- `src/mocks/scenarios.ts` (novo) — quatro cenários aprovados
- `src/mocks/stores.ts` (novo) — três lojas aprovadas
- `src/routes/__root.tsx` (editar apenas para montar o Provider; preservar `<Outlet />`, head, tokens e vitrine)
- `src/routes/entrar.tsx` (novo)
- `src/routes/app.tsx` (novo — layout do segmento com `<Outlet />`, proteção via `useMockSession()` e `<Navigate to="/entrar" replace />` quando sem cenário ou loja)
- `src/routes/app.inicio.tsx` (novo)
- `src/routeTree.gen.ts` (regenerado pelo build oficial; nunca editado à mão)

Não pode alterar: vitrine `/`, componentes visuais existentes, tokens, testes existentes, workflow, `package.json`, locks, dependências.

Critérios de aceite:
- `/` continua idêntica em conteúdo, layout e testes.
- `/entrar` renderiza os quatro cards de cenários e o seletor das três lojas; botão de entrada habilita apenas com ambos selecionados; navegação por teclado; foco visível teal 3px; WCAG 2.2 AA.
- Confirmar seleção em `/entrar` grava cenário + loja no Context e navega para `/app/inicio` (nunca antes).
- `/app/*` sem sessão redireciona para `/entrar` via componente de `src/routes/app.tsx` (sem `beforeLoad` lendo Context; sem flash do shell).
- `/entrar` com sessão ativa redireciona para `/app/inicio`.
- `/app/inicio` mostra o Bloco 1 (boas-vindas contextual com cenário + loja ativos). O Bloco 2 "Acessos disponíveis" não é renderizado enquanto `/app/inicio` for o único destino existente — sem `EmptyState`, sem mensagem substituta.
- Recarregar `/app/*` apaga a sessão (sem persistência) e cai em `/entrar`.
- Menu ainda não existe nesta microetapa (fica em LV-03); a navegação de LV-02.1 se dá por: cards em `/entrar` → botão confirmar → `/app/inicio`.

Testes:
- Vitest: reducer/helpers do Context (definir cenário, definir loja, limpar sessão).
- E2E Playwright (keyboard-only): fluxo `/entrar` → seleção cenário → seleção loja → confirmar → `/app/inicio` → recarregar → volta para `/entrar`.
- Axe: `/entrar` e `/app/inicio` sem violações críticas.
- Build oficial (Node 24, npm 11.18.0) regenera `src/routeTree.gen.ts` de forma estável.

Auditoria antes da próxima microetapa: parar, apresentar diffs e resultados; nenhuma etapa posterior começa sem aprovação.

### LV-02.2 — Refinamento de `/entrar`

Objetivo único: consolidar mensagens acessíveis, descrições dos cenários, layout responsivo (grade desktop / coluna mobile) e mensagem clara de ambiente de demonstração.

Arquivos permitidos: `src/routes/entrar.tsx`, componentes visuais internos criados exclusivamente para esta tela, mocks aprovados.

Critérios de aceite: contraste AA, foco visível 3px, alvos de toque mínimos, leitor de tela anuncia o cenário/loja selecionados, nenhum dado real, nenhuma persistência.

Testes: E2E de acessibilidade e responsividade; Axe sem violações críticas.

Auditoria antes da próxima microetapa.

---

## 4. LV-03 — Shell operacional mockado

Objetivo do bloco: implementar o shell `/app` completo conforme Decisão 4 de LV-01.3A.4, mais `/app/perfil`, `/app/loja` e a ação "sair".

### LV-03.1 — Cabeçalho e chips do shell
Objetivo único: cabeçalho com marca "Nivex Control", chip do cenário ativo, chip da loja ativa e slot da ação "sair" (ainda inerte).
Arquivos permitidos: `src/routes/app.tsx`, componentes de cabeçalho do shell.
Critérios: chips atualizam ao trocar sessão; WCAG AA; sem alterar `/entrar` ou `/app/inicio`.
Testes: unit dos componentes de cabeçalho; E2E verifica chips.
Auditoria antes da próxima microetapa.

### LV-03.2 — Sidebar desktop/tablet
Objetivo único: sidebar colapsável com apenas três itens (`/app/inicio`, `/app/perfil`, `/app/loja`) — nada além.
Arquivos permitidos: componentes de sidebar do shell, `src/routes/app.tsx`.
Critérios: nenhum link quebrado; nenhum item desabilitado; nenhum "Em breve"; `SidebarTrigger` acessível em tablet.
Testes: unit da lista de itens; E2E de navegação por teclado.
Auditoria antes da próxima microetapa.

### LV-03.3 — Barra inferior mobile
Objetivo único: barra fixa mobile com até quatro itens; nesta fase apenas os três itens existentes.
Arquivos permitidos: componente de barra inferior, `src/routes/app.tsx`.
Critérios: alvos de toque mínimos; foco visível; sem placeholders.
Testes: E2E mobile viewport.
Auditoria antes da próxima microetapa.

### LV-03.4 — `/app/perfil` (somente leitura)
Objetivo único: superfície somente leitura exibindo identificação do usuário simulado (nome fictício), cenário demonstrativo ativo e loja ativa. Sem formulários, sem campos desabilitados, sem ações administrativas.
Arquivos permitidos: `src/routes/app.perfil.tsx`, mocks.
Critérios: WCAG AA; leitor de tela anuncia identificação.
Testes: unit + Axe.
Auditoria antes da próxima microetapa.

### LV-03.5 — `/app/loja` (troca de loja em memória)
Objetivo único: permitir trocar a loja fictícia ativa dentre `LOJA-001`, `LOJA-002`, `LOJA-003`. A loja ativa fica claramente marcada; a troca atualiza imediatamente o chip da loja no cabeçalho; funciona por teclado e leitor de tela; sem persistência.
Arquivos permitidos: `src/routes/app.loja.tsx`, ações no Context.
Critérios: nenhum efeito administrativo; nenhum banco.
Testes: unit da ação; E2E keyboard-only troca loja e valida chip.
Auditoria antes da próxima microetapa.

### LV-03.6 — Ação "sair" e Toaster global
Objetivo único: item "Sair" no menu de ações do cabeçalho; primeiro limpa Context, depois navega para `/entrar`; Toaster anuncia "Você saiu do ambiente de demonstração"; foco vai ao conteúdo principal / título de `/entrar`; sem confirmação.
Arquivos permitidos: componentes do cabeçalho, `src/routes/app.tsx`, integração do `Toaster` global (já existente).
Critérios: mesma ação reutilizada no fallback de rota inexistente sob `/app/*`.
Testes: E2E keyboard-only.
Auditoria antes da próxima microetapa.

### LV-03.7 — `notFoundComponent` sob `/app/*`
Objetivo único: fallback dedicado em `src/routes/app.tsx` para URLs inexistentes sob `/app/*`, exibido dentro do shell somente quando há sessão mock ativa; mensagem "Esta área não está disponível nesta demonstração"; ações "Voltar ao início" (→ `/app/inicio`) e "Sair da demonstração" (→ limpa Context e vai para `/entrar`). O 404 global de `__root.tsx` permanece inalterado. Nenhuma rota placeholder é criada.
Arquivos permitidos: `src/routes/app.tsx`.
Testes: E2E cobre URL inexistente com e sem sessão.
Auditoria antes da próxima microetapa.

---

## 5. LV-04 a LV-08 — Blocos operacionais visuais

Cada bloco será desdobrado em microetapas pequenas no momento de sua abertura, cada uma com: objetivo único, arquivos permitidos, critérios de aceite, testes e auditoria antes da próxima etapa. Regras invioláveis da Seção 1 permanecem válidas em todos.

### LV-04 — Catálogo visual
Componentes compartilhados adicionais que os blocos operacionais consumirão (ex.: cabeçalhos de página, filtros padrão, estados vazios, badges de status específicos), sem criar rotas operacionais.

### LV-05 — Recebimento visual
Rotas: `/app/recebimento`, `/app/recebimento/$recebimentoId` (layout-pai com `<Outlet />` + `.index.tsx` de detalhe), `/app/recebimento/$recebimentoId/conferencia`, `/app/recebimento/$recebimentoId/divergencias`. Todas puramente visuais e mockadas.

### LV-06 — Estoque e reposição visual
Rotas: `/app/loja/estoque` (consulta visual mockada de `stock_balances`), `/app/reposicao`, `/app/reposicao/$reposicaoId` (layout-pai + `.index.tsx`), `/app/reposicao/$reposicaoId/execucao`. `replenishment_destinations` aparece apenas como leitura visual mockada; regras operacionais reais (GAP-06) ficam para a fase pós-visual.

### LV-07 — Contagem e aprovações visuais
Rotas: `/app/contagem`, `/app/contagem/$contagemId` (layout-pai + `.index.tsx`), `/app/supervisao/aprovacoes` (representa `approvals`, nunca `approval_limits`).

### LV-08 — Gestão, rede e administração visual
- Supervisão: `/app/supervisao`, `/app/supervisao/tarefas`, `/app/supervisao/equipe`.
- Rede: `/app/rede`, `/app/rede/lojas`, `/app/rede/produtos`, `/app/rede/fornecedores`, `/app/rede/pessoas`.
- Administração: `/app/admin` (hub filtrado por contexto autorizado — mockado), `/app/admin/permissoes`, `/app/admin/dispositivos`, `/app/admin/suporte` (fluxo JIT exclusivo e separado — `support_access_grants`), `/app/admin/integracoes`, `/app/admin/operacoes`.
- `platform_admin` e "recebedor" não são introduzidos como papéis canônicos; representações visuais usam rótulos neutros ("equipe autorizada da plataforma").

---

## 6. Fase pós-visual (fora do escopo atual)

Somente após aprovação integral dos protótipos visuais de LV-02 a LV-08:
- Habilitar Lovable Cloud / Supabase.
- Modelar tabelas conforme decisões LV-00A.2.*.
- Implementar RLS, `has_role`, `role_permissions`, `membership_store_scopes`, `approval_limits`, `support_access_grants`, `device_authorizations`, `integration_inbox`, `integration_attempts`, `operation_requests`, etc.
- Substituir mocks pelo Data API real, preservando URLs e superfícies visuais decididas.

Nada disso é iniciado enquanto qualquer microetapa visual estiver pendente.

---

## 7. Resumo das correções aplicadas nesta consolidação

- Rota de entrada padronizada em `/entrar` (removida qualquer menção a `/entrada`).
- Layout `/app` fixado em `src/routes/app.tsx` (removido `_app.tsx` pathless).
- Sessão mock unificada em `src/contexts/mock-session-context.tsx` com Provider em `src/routes/__root.tsx`.
- Proibição explícita de Zustand, `localStorage`, `sessionStorage`, cookies e persistência.
- Exatamente quatro cenários demonstrativos e exatamente três lojas aprovadas.
- Proibição de placeholders, links quebrados, itens desabilitados e "Em breve".
- `presentation_uses` reclassificado como snapshot documental (sem rota/tela/entidade).
- `/app/supervisao/aprovacoes` amarrada a `approvals`; `approval_limits` permanece pendente.
- `platform_admin` e "recebedor" removidos como papéis canônicos.
- Suporte JIT preservado como fluxo exclusivo em `/app/admin/suporte`.
- Menu do bloco 1 limitado a `/app/inicio`, `/app/perfil`, `/app/loja`.
- `/app/loja/estoque` movido para LV-06.
- Vitrine `/` preservada integralmente.

---

## 8. Próxima etapa

**LV-02.1 — Fluxo vertical mínimo entrada → início** (Seção 3). Aguardando autorização explícita para iniciar. Nenhuma implementação foi feita nesta consolidação.
