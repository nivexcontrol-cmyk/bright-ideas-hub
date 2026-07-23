import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";

import { StatusBadge } from "@/components/feedback/status-badge";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { NoPermissionState } from "@/components/feedback/no-permission-state";
import { LoadingState } from "@/components/feedback/loading-state";

describe("StatusBadge", () => {
  it.each(["info", "success", "warning", "error"] as const)(
    "tom %s exibe texto e sinal visual (ícone SVG)",
    (tone) => {
      const { container } = render(<StatusBadge tone={tone}>Rótulo</StatusBadge>);
      expect(screen.getByText("Rótulo")).toBeInTheDocument();
      expect(container.querySelector("svg")).not.toBeNull();
      const badge = container.querySelector("[data-tone]");
      expect(badge?.getAttribute("data-tone")).toBe(tone);
    },
  );

  it("não é interativo (não é role button)", () => {
    render(<StatusBadge tone="info">X</StatusBadge>);
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("EmptyState", () => {
  it("mostra título e descrição", () => {
    render(<EmptyState title="Vazio" description="Nada aqui." />);
    expect(screen.getByText("Vazio")).toBeInTheDocument();
    expect(screen.getByText("Nada aqui.")).toBeInTheDocument();
  });

  it("ação opcional dispara o callback correto", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <EmptyState
        title="Vazio"
        description="Nada aqui."
        actionLabel="Recarregar"
        onAction={onAction}
      />,
    );
    await user.click(screen.getByRole("button", { name: /recarregar/i }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});

describe("ErrorState", () => {
  it("mostra título e descrição não técnicos", () => {
    render(<ErrorState title="Erro" description="Tente de novo em alguns instantes." />);
    expect(screen.getByText("Erro")).toBeInTheDocument();
    expect(screen.getByText(/tente de novo/i)).toBeInTheDocument();
  });

  it("ação opcional executa o callback correto", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <ErrorState
        title="Erro"
        description="Falhou."
        retryLabel="Tentar novamente"
        onRetry={onRetry}
      />,
    );
    await user.click(screen.getByRole("button", { name: /tentar novamente/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("não expõe detalhes técnicos: renderiza apenas as strings fornecidas", () => {
    const stack = "TypeError: undefined at foo (bar.ts:42:7)";
    render(<ErrorState title="Erro" description="Mensagem amigável." />);
    // O componente só renderiza os textos passados; stack técnico não vaza.
    expect(screen.queryByText(stack)).toBeNull();
    expect(screen.queryByText(/TypeError/i)).toBeNull();
    expect(screen.queryByText(/undefined/i)).toBeNull();
    expect(screen.queryByText(/\.ts:/i)).toBeNull();
  });
});

describe("NoPermissionState", () => {
  it("mensagem neutra, sem revelar conteúdo protegido", () => {
    render(<NoPermissionState />);
    expect(screen.getByText(/acesso indisponível/i)).toBeInTheDocument();
    // Não mencionar IDs, tabelas, quantidades ou nomes de recursos internos.
    expect(screen.queryByText(/id\s*[:=]/i)).toBeNull();
    expect(screen.queryByText(/tabela/i)).toBeNull();
    expect(screen.queryByText(/quantidade/i)).toBeNull();
    expect(screen.queryByText(/estoque/i)).toBeNull();
    expect(screen.queryByText(/supabase/i)).toBeNull();
  });

  it("ação opcional executa o callback correto quando fornecida", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<NoPermissionState actionLabel="Voltar" onAction={onAction} />);
    await user.click(screen.getByRole("button", { name: /voltar/i }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});

describe("LoadingState", () => {
  it("expõe aria-busy true e estrutura estável", () => {
    const { container } = render(<LoadingState label="Carregando…" rows={3} />);
    const region = container.querySelector('[role="status"]');
    expect(region).not.toBeNull();
    expect(region?.getAttribute("aria-busy")).toBe("true");
    expect(region?.getAttribute("aria-live")).toBe("polite");
    // Skeletons têm dimensões definidas (h-4) — não colapsam.
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThanOrEqual(3);
  });
});

describe("Feedback states — jest-axe", () => {
  it("não tem violações", async () => {
    const { container } = render(
      <div>
        <StatusBadge tone="info">Em análise</StatusBadge>
        <StatusBadge tone="success">Concluído</StatusBadge>
        <StatusBadge tone="warning">Pendente</StatusBadge>
        <StatusBadge tone="error">Bloqueado</StatusBadge>
        <EmptyState title="Vazio" description="Sem itens." />
        <ErrorState title="Erro" description="Tente novamente." />
        <NoPermissionState />
        <LoadingState />
      </div>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
