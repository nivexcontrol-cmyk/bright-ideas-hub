import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast, Toaster } from "sonner";

/**
 * LV-01.2B.3 — Toaster (Sonner) behavioral tests.
 * O Toaster real de src/components/ui/sonner.tsx é apenas um wrapper visual
 * do <Toaster /> de sonner. Aqui usamos o mesmo componente `sonner` para
 * exercitar o comportamento real de empilhamento e dispensa.
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
      <Toaster />
    </div>
  );
}

describe("Toaster — LV-01.2B.3", () => {
  it("notificação aparece com o texto correto", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Sucesso" }));
    await waitFor(() => {
      expect(screen.getByText("Sucesso: salvo")).toBeInTheDocument();
    });
  });

  it("duas notificações podem ser empilhadas", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Sucesso" }));
    await user.click(screen.getByRole("button", { name: "Erro" }));
    await waitFor(() => {
      expect(screen.getByText("Sucesso: salvo")).toBeInTheDocument();
      expect(screen.getByText("Erro: falhou")).toBeInTheDocument();
    });
  });

  it("a notificação pode ser dispensada pelo teclado", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Sucesso" }));
    const toastEl = await screen.findByText("Sucesso: salvo");
    expect(toastEl).toBeInTheDocument();

    // Sonner captura F6 para focar a região de toasts e permite dispensar
    // com a tecla configurada (padrão: T seguido de foco + escape).
    // Usamos o hotkey padrão ("altKey+T") para mover o foco à região viva
    // e então Escape para descartar o toast focado.
    await user.keyboard("{Alt>}t{/Alt}");
    await user.keyboard("{Escape}");

    await waitFor(
      () => {
        expect(screen.queryByText("Sucesso: salvo")).toBeNull();
      },
      { timeout: 3000 },
    );
  });
});
