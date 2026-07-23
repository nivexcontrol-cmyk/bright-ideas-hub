import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { Toaster } from "@/components/ui/sonner";

/**
 * LV-01.2B.3.1 — Toaster oficial do projeto (src/components/ui/sonner.tsx).
 * O teste monta o mesmo componente usado em __root.tsx, sem alterar a sua
 * configuração, para comprovar o comportamento real do sistema.
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

describe("Toaster oficial — LV-01.2B.3.1", () => {
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

  it("a notificação pode ser dispensada exclusivamente pelo teclado", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Sucesso" }));
    await screen.findByText("Sucesso: salvo");

    // Fluxo real do Sonner: Alt+T move o foco para a região de toasts e
    // Escape dispensa o toast focado. Nenhum clique de mouse é usado.
    await user.keyboard("{Alt>}t{/Alt}");
    await user.keyboard("{Escape}");

    await waitFor(
      () => {
        expect(screen.queryByText("Sucesso: salvo")).toBeNull();
      },
      { timeout: 5000 },
    );
  });
});
