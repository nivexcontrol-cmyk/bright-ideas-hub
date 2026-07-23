import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

describe("Alert — LV-01.2B.3", () => {
  it("erro dinâmico usa role alert e aria-live assertive", () => {
    render(
      <Alert variant="error">
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>Algo falhou.</AlertDescription>
      </Alert>,
    );
    const el = screen.getByRole("alert");
    expect(el).toHaveAttribute("aria-live", "assertive");
  });

  it("destructive dinâmico (compatibilidade) usa role alert e aria-live assertive", () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>Algo falhou.</AlertDescription>
      </Alert>,
    );
    const el = screen.getByRole("alert");
    expect(el).toHaveAttribute("aria-live", "assertive");
  });

  it.each(["info", "success", "warning"] as const)(
    "%s dinâmico usa role status e aria-live polite",
    (variant) => {
      render(
        <Alert variant={variant}>
          <AlertTitle>Título</AlertTitle>
          <AlertDescription>Descrição.</AlertDescription>
        </Alert>,
      );
      const el = screen.getByRole("status");
      expect(el).toHaveAttribute("aria-live", "polite");
      expect(el.getAttribute("data-variant")).toBe(variant);
    },
  );

  it("alertas estáticos (live=off) não mantêm região viva ativa", () => {
    const { container } = render(
      <>
        <Alert variant="info" live="off" data-testid="a">
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>x</AlertDescription>
        </Alert>
        <Alert variant="error" live="off" data-testid="b">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>y</AlertDescription>
        </Alert>
      </>,
    );
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
    const nodes = container.querySelectorAll("[data-live]");
    expect(nodes.length).toBe(2);
    nodes.forEach((n) => {
      expect(n.getAttribute("data-live")).toBe("off");
      expect(n.hasAttribute("aria-live")).toBe(false);
      expect(n.getAttribute("role")).toBeNull();
    });
  });

  it.each(["info", "success", "warning", "error", "destructive"] as const)(
    "variante %s expõe ícone SVG e texto além da cor",
    (variant) => {
      const { container } = render(
        <Alert variant={variant}>
          <AlertTitle>Título</AlertTitle>
          <AlertDescription>Texto descritivo.</AlertDescription>
        </Alert>,
      );
      // ícone
      expect(container.querySelector("svg")).not.toBeNull();
      // texto visível
      expect(screen.getByText("Título")).toBeInTheDocument();
      expect(screen.getByText("Texto descritivo.")).toBeInTheDocument();
    },
  );
});

describe("Alert — jest-axe", () => {
  it("não tem violações em nenhuma variante", async () => {
    const { container } = render(
      <div>
        <Alert variant="info">
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>ok</AlertDescription>
        </Alert>
        <Alert variant="success">
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>ok</AlertDescription>
        </Alert>
        <Alert variant="warning">
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>ok</AlertDescription>
        </Alert>
        <Alert variant="error">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>ok</AlertDescription>
        </Alert>
        <Alert variant="info" live="off">
          <AlertTitle>Estático</AlertTitle>
          <AlertDescription>ok</AlertDescription>
        </Alert>
      </div>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
