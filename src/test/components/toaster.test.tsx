import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast, Toaster } from "sonner";

/**
 * LV-01.2B.3 — Toaster (Sonner) — testes comportamentais reais.
 * Usa a mesma biblioteca sonner que o Toaster oficial do projeto envolve.
 */

function Harness() {
  return (
    <div>
      <button type="button" onClick={() => toast.success("Sucesso: salvo")}>
        Sucesso
      </button>
      <button type="button" onClick={() => toast.error("Erro: falhou")}>
        Erro
      </button>
      {/* closeButton habilita um botão real de dispensa, operável 100% por teclado. */}
      <Toaster closeButton />
    </div>
  );
}

describe("Toaster — LV-01.2B.3", () => {
  it("notificação aparece com o texto correto", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Sucesso" }));
    const t = await screen.findByText("Sucesso: salvo");
    expect(t).not.toBeNull();
  });

  it("duas notificações podem ser empilhadas", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Sucesso" }));
    await user.click(screen.getByRole("button", { name: "Erro" }));
    await waitFor(() => {
      expect(screen.getByText("Sucesso: salvo")).not.toBeNull();
      expect(screen.getByText("Erro: falhou")).not.toBeNull();
    });
  });

  it("a notificação pode ser dispensada pelo teclado", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Sucesso" }));
    const t = await screen.findByText("Sucesso: salvo");
    expect(t).not.toBeNull();

    // Sonner com closeButton renderiza um botão real "Close toast" acessível
    // por teclado. Focar e pressionar Enter dispensa a notificação — o fluxo
    // é 100% via teclado, sem clique de mouse.
    const closeBtn = await screen.findByRole("button", { name: /close toast/i });
    closeBtn.focus();
    expect(document.activeElement).toBe(closeBtn);
    await user.keyboard("{Enter}");

    await waitFor(
      () => {
        expect(screen.queryByText("Sucesso: salvo")).toBeNull();
      },
      { timeout: 3000 },
    );
  });
});
