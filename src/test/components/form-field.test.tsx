import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, rerender as _r } from "@testing-library/react";
import { axe } from "jest-axe";

import { FormField } from "@/components/form/form-field";
import { Input } from "@/components/ui/input";

/**
 * LV-01.2B.2 — FormField.
 * Verifica associação label→campo, aria-describedby, aria-invalid,
 * anúncio de erro (role="alert"), presença de ícone + texto no erro,
 * e ausência de violações axe.
 */

function Harness({ error }: { error?: string }) {
  return (
    <FormField
      label="Nome do responsável"
      description="Usado apenas para exibição."
      error={error}
    >
      {({ id, describedBy, invalid }) => (
        <Input
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          placeholder="Ex.: Maria"
        />
      )}
    </FormField>
  );
}

describe("FormField", () => {
  it("associa label ao campo e referencia a descrição", () => {
    render(<Harness />);
    const input = screen.getByLabelText(/nome do responsável/i) as HTMLInputElement;
    const desc = screen.getByText(/usado apenas para exibição/i);
    const describedBy = input.getAttribute("aria-describedby") ?? "";
    expect(describedBy.split(" ")).toContain(desc.id);
    expect(input.getAttribute("aria-invalid")).toBeNull();
  });

  it("aplica aria-invalid e referencia a mensagem de erro", () => {
    render(<Harness error="Informe um nome válido." />);
    const input = screen.getByLabelText(/nome do responsável/i);
    expect(input).toHaveAttribute("aria-invalid", "true");

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(/informe um nome válido/i);
    const describedBy = input.getAttribute("aria-describedby") ?? "";
    expect(describedBy.split(" ")).toContain(alert.id);

    // ícone acompanha o texto (SVG do lucide-react)
    expect(alert.querySelector("svg")).not.toBeNull();
  });

  it("adiciona e remove a mensagem de erro dinamicamente", () => {
    const { rerender } = render(<Harness />);
    expect(screen.queryByRole("alert")).toBeNull();

    rerender(<Harness error="Obrigatório." />);
    expect(screen.getByRole("alert")).toBeInTheDocument();

    rerender(<Harness />);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("não apresenta violações axe", async () => {
    const { container } = render(
      <main>
        <h1>Formulário</h1>
        <Harness error="Campo obrigatório." />
      </main>,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});

// remove import não utilizado
void _r;
