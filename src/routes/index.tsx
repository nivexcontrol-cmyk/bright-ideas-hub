import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/form/form-field";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { StatusBadge } from "@/components/feedback/status-badge";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { NoPermissionState } from "@/components/feedback/no-permission-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { DataTable } from "@/components/data-table/data-table";
import type { DataTableColumn, DataTableRowAction } from "@/components/data-table/types";

interface TarefaReposicao {
  id: string;
  code: string;
  store: string;
  responsible: string;
  situation: string;
  hour: string;
}

const tarefasBase: TarefaReposicao[] = Array.from({ length: 20 }, (_, i) => ({
  id: `tr-${i + 1}`,
  code: `TR-${String(i + 1).padStart(3, "0")}`,
  store: `Loja ${String((i % 3) + 1).padStart(3, "0")}`,
  responsible: ["Ana Souza", "Bruno Lima", "Carla Dias", "Diego Melo"][i % 4],
  situation: ["Pendente", "Em execução", "Concluído"][i % 3],
  hour: `${String(8 + (i % 10)).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`,
}));

const tarefaColunas: DataTableColumn<TarefaReposicao>[] = [
  { id: "code", header: "Identificação", accessor: (r) => r.code },
  { id: "store", header: "Loja", accessor: (r) => r.store },
  { id: "responsible", header: "Responsável", accessor: (r) => r.responsible },
  { id: "situation", header: "Situação", accessor: (r) => r.situation },
  { id: "hour", header: "Horário", accessor: (r) => r.hour },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nivex Control — Fundação visual" },
      {
        name: "description",
        content:
          "Nivex Control — sistema de controle operacional. Vitrine inicial da identidade visual.",
      },
      { property: "og:title", content: "Nivex Control — Fundação visual" },
      {
        property: "og:description",
        content:
          "Nivex Control — sistema de controle operacional. Vitrine inicial da identidade visual.",
      },
    ],
  }),
  component: Index,
});

// Controle interativo: altura visual de 48 px no celular e 40 px no desktop.
// A área interativa real mínima de 44 × 44 px é garantida por um ::before
// transparente sobreposto (sem alterar a aparência do controle).
const controlBase =
  "relative inline-flex items-center justify-center rounded-[8px] px-4 " +
  "h-12 sm:h-10 min-w-[44px] " +
  "text-sm font-medium transition-colors " +
  "before:absolute before:left-0 before:right-0 before:top-1/2 " +
  "before:h-11 before:min-h-[44px] before:-translate-y-1/2 before:content-['']";

function Index() {
  // Vitrine puramente demonstrativa (LV-01.2B.2): dados locais, sem persistência.
  const [nome, setNome] = React.useState("");
  const [observacao, setObservacao] = React.useState("");
  const [aceite, setAceite] = React.useState(false);
  const [prioridade, setPrioridade] = React.useState("normal");
  const [unidade, setUnidade] = React.useState("");
  const [emailDemo, setEmailDemo] = React.useState("email-invalido");

  const emailInvalido = !/^\S+@\S+\.\S+$/.test(emailDemo);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 md:py-16">
        {/* Cabeçalho */}
        <header className="mb-8 md:mb-12">
          <p className="text-xs font-medium uppercase tracking-wider text-secondary">
            Fundação visual do sistema
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-primary sm:text-4xl md:text-5xl">
            Nivex Control
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-foreground sm:text-base">
            Esta tela apresenta a identidade visual inicial do Nivex Control, seguindo as diretrizes
            oficiais NC-08 e NC-30 da documentação v4.4.
          </p>
        </header>

        {/* Tipografia */}
        <section
          aria-labelledby="tipografia-titulo"
          className="mb-6 rounded-[12px] border border-border bg-surface p-4 shadow-sm sm:p-6"
        >
          <h2
            id="tipografia-titulo"
            className="text-xs font-semibold uppercase tracking-wider text-secondary"
          >
            Tipografia
          </h2>
          <h3 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">
            Exemplo de título
          </h3>
          <p className="mt-2 text-base text-foreground">
            Exemplo de texto normal utilizado em parágrafos, descrições e conteúdos comuns do
            sistema.
          </p>
          <span className="mt-3 inline-block text-xs font-medium uppercase tracking-wider text-secondary">
            Exemplo de rótulo
          </span>
        </section>

        {/* Ações */}
        <section
          aria-labelledby="acoes-titulo"
          className="mb-6 rounded-[12px] border border-border bg-surface p-4 shadow-sm sm:p-6"
        >
          <h2
            id="acoes-titulo"
            className="text-xs font-semibold uppercase tracking-wider text-secondary"
          >
            Ações
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              className={`${controlBase} bg-primary text-primary-foreground hover:opacity-95`}
            >
              Ação principal
            </button>
            <button
              type="button"
              className={`${controlBase} bg-secondary text-secondary-foreground hover:opacity-95`}
            >
              Ação secundária
            </button>
          </div>
        </section>

        {/* Estados */}
        <section
          aria-labelledby="estados-titulo"
          className="mb-6 rounded-[12px] border border-border bg-surface p-4 shadow-sm sm:p-6"
        >
          <h2
            id="estados-titulo"
            className="text-xs font-semibold uppercase tracking-wider text-secondary"
          >
            Estados
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            <li className="flex items-start gap-3 rounded-[8px] border border-border bg-background p-3">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-success" />
              <div>
                <p className="text-sm font-semibold text-success">Sucesso</p>
                <p className="text-sm text-foreground">Operação concluída sem erros.</p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-[8px] border border-border bg-background p-3">
              <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  <span aria-hidden="true" className="mr-1">
                    ⚠
                  </span>
                  Atenção
                </p>
                <p className="text-sm text-foreground">Verifique os dados antes de prosseguir.</p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-[8px] border border-border bg-background p-3">
              <XCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div>
                <p className="text-sm font-semibold text-destructive">Erro ou bloqueio</p>
                <p className="text-sm text-foreground">
                  Não foi possível concluir a ação solicitada.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-[8px] border border-border bg-background p-3">
              <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-info" />
              <div>
                <p className="text-sm font-semibold text-info">Informação</p>
                <p className="text-sm text-foreground">
                  Detalhe complementar sobre o contexto atual.
                </p>
              </div>
            </li>
          </ul>
        </section>

        {/* Formulário — campo inicial (mantido de LV-01.1B) */}
        <section
          aria-labelledby="form-titulo"
          className="mb-6 rounded-[12px] border border-border bg-surface p-4 shadow-sm sm:p-6"
        >
          <h2
            id="form-titulo"
            className="text-xs font-semibold uppercase tracking-wider text-secondary"
          >
            Campo de exemplo
          </h2>
          <div className="mt-4 max-w-md">
            <label htmlFor="exemplo" className="block text-sm font-medium text-foreground">
              Identificador da unidade
            </label>
            <label htmlFor="exemplo" className="mt-1.5 flex w-full items-center sm:min-h-[44px]">
              <input
                id="exemplo"
                name="exemplo"
                type="text"
                placeholder="Ex.: Loja 001"
                className="block h-12 w-full rounded-[8px] border border-input bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground sm:h-10"
              />
            </label>
            <p className="mt-1.5 text-xs text-foreground">
              O rótulo permanece visível acima do campo.
            </p>
          </div>
        </section>

        {/* Controles — nova seção (LV-01.2B.2) */}
        <section
          aria-labelledby="controles-titulo"
          className="mb-6 rounded-[12px] border border-border bg-surface p-4 shadow-sm sm:p-6"
        >
          <h2
            id="controles-titulo"
            className="text-xs font-semibold uppercase tracking-wider text-secondary"
          >
            Controles
          </h2>

          {/* Botões */}
          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button">Confirmar</Button>
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
            <Button type="button" disabled>
              Desabilitado
            </Button>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Input com ajuda neutra */}
            <div>
              <label htmlFor="ctrl-nome" className="block text-sm font-medium text-foreground">
                Nome do responsável
              </label>
              <Input
                id="ctrl-nome"
                name="ctrl-nome"
                type="text"
                placeholder="Ex.: Maria da Silva"
                aria-describedby="ctrl-nome-help"
                className="mt-1.5"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <p id="ctrl-nome-help" className="mt-1.5 text-xs text-foreground">
                Somente para exibição na vitrine.
              </p>
            </div>

            {/* Input inválido */}
            <div>
              <label htmlFor="ctrl-email" className="block text-sm font-medium text-foreground">
                E-mail de contato
              </label>
              <Input
                id="ctrl-email"
                name="ctrl-email"
                type="email"
                aria-invalid={emailInvalido}
                aria-describedby="ctrl-email-error"
                className="mt-1.5"
                value={emailDemo}
                onChange={(e) => setEmailDemo(e.target.value)}
              />
              {emailInvalido ? (
                <p
                  id="ctrl-email-error"
                  role="alert"
                  className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-destructive"
                >
                  <XCircle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>Informe um e-mail válido.</span>
                </p>
              ) : null}
            </div>

            {/* Textarea */}
            <div>
              <label htmlFor="ctrl-obs" className="block text-sm font-medium text-foreground">
                Observações
              </label>
              <Textarea
                id="ctrl-obs"
                name="ctrl-obs"
                className="mt-1.5"
                placeholder="Comentários adicionais…"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />
            </div>

            {/* Select */}
            <div>
              <label htmlFor="ctrl-unidade" className="block text-sm font-medium text-foreground">
                Unidade
              </label>
              <Select value={unidade} onValueChange={setUnidade}>
                <SelectTrigger id="ctrl-unidade" className="mt-1.5">
                  <SelectValue placeholder="Selecione uma unidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="loja-001">Loja 001</SelectItem>
                  <SelectItem value="loja-002">Loja 002</SelectItem>
                  <SelectItem value="loja-003">Loja 003</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Checkbox com rótulo */}
            <div>
              <span className="block text-sm font-medium text-foreground">Confirmação</span>
              <label
                htmlFor="ctrl-aceite"
                className="mt-1.5 inline-flex min-h-12 sm:min-h-11 cursor-pointer items-center gap-3"
              >
                <Checkbox
                  id="ctrl-aceite"
                  checked={aceite}
                  onCheckedChange={(v) => setAceite(v === true)}
                />
                <span className="text-sm text-foreground">Li e concordo com os termos.</span>
              </label>
            </div>

            {/* Radio group */}
            <div>
              <span
                id="ctrl-prioridade-label"
                className="block text-sm font-medium text-foreground"
              >
                Prioridade
              </span>
              <RadioGroup
                aria-labelledby="ctrl-prioridade-label"
                value={prioridade}
                onValueChange={setPrioridade}
                className="mt-1.5"
              >
                {[
                  { value: "baixa", label: "Baixa" },
                  { value: "normal", label: "Normal" },
                  { value: "alta", label: "Alta" },
                ].map((opt) => {
                  const id = `ctrl-prioridade-${opt.value}`;
                  return (
                    <label
                      key={opt.value}
                      htmlFor={id}
                      className="inline-flex min-h-12 sm:min-h-11 cursor-pointer items-center gap-3"
                    >
                      <RadioGroupItem id={id} value={opt.value} />
                      <span className="text-sm text-foreground">{opt.label}</span>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>
          </div>

          {/* FormField completo */}
          <div className="mt-6 max-w-md">
            <FormField
              label="Identificador de tarefa"
              description="Use o formato TSK-0000 apenas para demonstração."
              error={
                nome.length > 0 && nome.length < 3 ? "Informe ao menos 3 caracteres." : undefined
              }
              required
            >
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  aria-describedby={describedBy}
                  aria-invalid={invalid || undefined}
                  placeholder="TSK-0001"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              )}
            </FormField>
          </div>
        </section>

        {/* Card — superfície única (sem card aninhado) */}
        <section
          aria-labelledby="card-titulo"
          className="rounded-[12px] border border-border bg-surface p-4 shadow-sm sm:p-6"
        >
          <h2
            id="card-titulo"
            className="text-xs font-semibold uppercase tracking-wider text-secondary"
          >
            Card
          </h2>
          <h3 className="mt-3 text-lg font-semibold text-primary">Superfície oficial</h3>
          <p className="mt-1.5 text-sm text-foreground">
            Card utilizando raio de 12 px, borda oficial e superfície branca, conforme geometria
            definida em NC-08.
          </p>
        </section>

        {/* Feedback — LV-01.2B.3 */}
        <section
          aria-labelledby="feedback-titulo"
          className="mt-6 rounded-[12px] border border-border bg-surface p-4 shadow-sm sm:p-6"
        >
          <h2
            id="feedback-titulo"
            className="text-xs font-semibold uppercase tracking-wider text-secondary"
          >
            Feedback
          </h2>

          {/* Alertas estáticos (sem região viva) */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Alert variant="info" live="off">
              <AlertTitle>Informação</AlertTitle>
              <AlertDescription>Exemplo estático de alerta informativo.</AlertDescription>
            </Alert>
            <Alert variant="success" live="off">
              <AlertTitle>Sucesso</AlertTitle>
              <AlertDescription>Exemplo estático de alerta de sucesso.</AlertDescription>
            </Alert>
            <Alert variant="warning" live="off">
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>Exemplo estático de alerta de atenção.</AlertDescription>
            </Alert>
            <Alert variant="error" live="off">
              <AlertTitle>Erro ou bloqueio</AlertTitle>
              <AlertDescription>Exemplo estático de alerta de erro.</AlertDescription>
            </Alert>
          </div>

          {/* StatusBadges */}
          <div className="mt-6">
            <span className="block text-sm font-medium text-foreground">Situações</span>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusBadge tone="info">Em análise</StatusBadge>
              <StatusBadge tone="success">Concluído</StatusBadge>
              <StatusBadge tone="warning">Pendente</StatusBadge>
              <StatusBadge tone="error">Bloqueado</StatusBadge>
            </div>
          </div>

          {/* Estados de feedback */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <EmptyState
              title="Nada por aqui ainda"
              description="Assim que houver registros nesta unidade, eles aparecerão nesta lista."
              actionLabel="Recarregar exemplo"
              onAction={() => {
                /* apenas vitrine */
              }}
            />
            <ErrorState
              title="Não foi possível carregar"
              description="Verifique a conexão e tente novamente em alguns instantes."
              retryLabel="Tentar novamente"
              onRetry={() => {
                /* apenas vitrine */
              }}
            />
            <NoPermissionState />
            <LoadingState label="Carregando exemplo de conteúdo…" rows={3} />
          </div>

          {/* Notificações (Sonner) */}
          <div className="mt-6">
            <span className="block text-sm font-medium text-foreground">Notificações</span>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={() => toast.success("Operação concluída com sucesso.")}
              >
                Disparar sucesso
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => toast.error("Não foi possível concluir a operação.")}
              >
                Disparar erro
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  toast.success("Primeira notificação empilhada.");
                  toast.error("Segunda notificação empilhada.");
                }}
              >
                Empilhar duas
              </Button>
            </div>
          </div>
        </section>

        <section aria-labelledby="sec-tabela" className="mt-10 space-y-6">
          <h2 id="sec-tabela" className="text-xl font-semibold text-foreground">
            Tabela de dados
          </h2>
          <p className="text-sm text-foreground">
            Componente reutilizável com busca, ordenação, paginação e ações por linha. No celular
            substitui a tabela por cards acessíveis.
          </p>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground">Cenário: nenhum registro</h3>
            <DataTable<TarefaReposicao>
              caption="Tarefas de reposição (vazio)"
              columns={tarefaColunas}
              data={[]}
              getRowId={(r) => r.id}
              testIdPrefix="dt-zero"
              emptyState={
                <EmptyState
                  title="Nada por aqui ainda"
                  description="Não há tarefas de reposição para exibir."
                />
              }
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground">Cenário: um registro</h3>
            <DataTable<TarefaReposicao>
              caption="Tarefas de reposição (um registro)"
              columns={tarefaColunas}
              data={tarefasBase.slice(0, 1)}
              getRowId={(r) => r.id}
              testIdPrefix="dt-um"
              rowActions={
                [
                  {
                    id: "ver",
                    label: (r) => `Ver detalhes de ${r.code}`,
                    children: "Ver",
                    onClick: () => toast.success("Registro aberto."),
                  },
                ] as DataTableRowAction<TarefaReposicao>[]
              }
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground">
              Cenário: vinte registros com busca, ordenação e paginação
            </h3>
            <DataTable<TarefaReposicao>
              caption="Tarefas de reposição (vinte registros)"
              columns={tarefaColunas}
              data={tarefasBase}
              getRowId={(r) => r.id}
              pageSize={5}
              searchPlaceholder="Buscar por identificação, loja ou responsável…"
              testIdPrefix="dt-vinte"
              rowActions={
                [
                  {
                    id: "ver",
                    label: (r) => `Ver detalhes de ${r.code}`,
                    children: "Ver",
                    onClick: (r) => toast.success(`Registro ${r.code} aberto.`),
                  },
                ] as DataTableRowAction<TarefaReposicao>[]
              }
            />
          </div>
        </section>

        <footer className="mt-10 text-center text-xs text-foreground">
          Nivex Control — LV-01.2B.4 — Tabela de dados
        </footer>
      </div>
    </main>
  );
}
