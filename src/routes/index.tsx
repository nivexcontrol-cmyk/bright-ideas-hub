import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
} from "lucide-react";

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
          "Vitrine inicial da identidade visual do Nivex Control conforme NC-08 e NC-30.",
      },
    ],
  }),
  component: Index,
});

function Index() {
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
          <p className="mt-3 max-w-2xl text-sm text-foreground/80 sm:text-base">
            Esta tela apresenta a identidade visual inicial do Nivex Control,
            seguindo as diretrizes oficiais NC-08 e NC-30 da documentação v4.4.
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
          <p className="mt-2 text-base text-foreground/85">
            Exemplo de texto normal utilizado em parágrafos, descrições e
            conteúdos comuns do sistema.
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
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[8px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-95"
            >
              Ação principal
            </button>
            <button
              type="button"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[8px] bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-95"
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
              <CheckCircle2
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-success"
              />
              <div>
                <p className="text-sm font-semibold text-success">Sucesso</p>
                <p className="text-sm text-foreground/80">
                  Operação concluída sem erros.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-[8px] border border-border bg-background p-3">
              <AlertTriangle
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-warning"
              />
              <div>
                <p className="text-sm font-semibold text-warning">Atenção</p>
                <p className="text-sm text-foreground/80">
                  Verifique os dados antes de prosseguir.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-[8px] border border-border bg-background p-3">
              <XCircle
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-destructive"
              />
              <div>
                <p className="text-sm font-semibold text-destructive">
                  Erro ou bloqueio
                </p>
                <p className="text-sm text-foreground/80">
                  Não foi possível concluir a ação solicitada.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-[8px] border border-border bg-background p-3">
              <Info
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-info"
              />
              <div>
                <p className="text-sm font-semibold text-info">Informação</p>
                <p className="text-sm text-foreground/80">
                  Detalhe complementar sobre o contexto atual.
                </p>
              </div>
            </li>
          </ul>
        </section>

        {/* Formulário */}
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
            <label
              htmlFor="exemplo"
              className="block text-sm font-medium text-foreground"
            >
              Identificador da unidade
            </label>
            <input
              id="exemplo"
              name="exemplo"
              type="text"
              placeholder="Ex.: Loja 001"
              className="mt-1.5 block h-11 w-full rounded-[8px] border border-input bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground"
            />
            <p className="mt-1.5 text-xs text-foreground/70">
              O rótulo permanece visível acima do campo.
            </p>
          </div>
        </section>

        {/* Card exemplo */}
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
          <article className="mt-4 rounded-[12px] border border-border bg-background p-4 sm:p-5">
            <h3 className="text-lg font-semibold text-primary">
              Superfície oficial
            </h3>
            <p className="mt-1.5 text-sm text-foreground/80">
              Card utilizando raio de 12 px, borda oficial e superfície branca,
              conforme geometria definida em NC-08.
            </p>
          </article>
        </section>

        <footer className="mt-10 text-center text-xs text-foreground/60">
          Nivex Control — LV-01.1B — Fundação visual
        </footer>
      </div>
    </main>
  );
}
