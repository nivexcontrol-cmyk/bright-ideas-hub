import * as React from "react";
import { act } from "react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";

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

/**
 * LV-01.2B.2 — Testes comportamentais dos controles reutilizáveis.
 * Cada teste falha se o comportamento correspondente for removido.
 */

// jsdom não implementa scrollIntoView / hasPointerCapture / releasePointerCapture,
// usados internamente por primitivos Radix.
beforeAll(() => {
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = vi.fn();
  }
  const proto = Element.prototype as unknown as Record<string, unknown>;
  proto.hasPointerCapture ??= () => false;
  proto.releasePointerCapture ??= () => {};
});

describe("Button", () => {
  it("dispara onClick por clique, Enter e Espaço", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Confirmar</Button>);
    const btn = screen.getByRole("button", { name: /confirmar/i });

    await user.click(btn);
    btn.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("desabilitado não executa a ação", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Enviar
      </Button>,
    );
    await user.click(screen.getByRole("button", { name: /enviar/i }));
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("Input e Textarea", () => {
  it("aceita digitação no input", async () => {
    const user = userEvent.setup();
    render(
      <>
        <label htmlFor="nome">Nome</label>
        <Input id="nome" />
      </>,
    );
    const input = screen.getByLabelText(/nome/i) as HTMLInputElement;
    await user.type(input, "Maria");
    expect(input.value).toBe("Maria");
  });

  it("aceita digitação no textarea", async () => {
    const user = userEvent.setup();
    render(
      <>
        <label htmlFor="obs">Observações</label>
        <Textarea id="obs" />
      </>,
    );
    const ta = screen.getByLabelText(/observações/i) as HTMLTextAreaElement;
    await user.type(ta, "linha 1");
    expect(ta.value).toBe("linha 1");
  });
});

describe("Select", () => {
  it("abre, navega por teclado e seleciona uma opção", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <>
        <label htmlFor="uni">Unidade</label>
        <Select onValueChange={onChange}>
          <SelectTrigger id="uni">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Loja A</SelectItem>
            <SelectItem value="b">Loja B</SelectItem>
            <SelectItem value="c">Loja C</SelectItem>
          </SelectContent>
        </Select>
      </>,
    );

    const trigger = screen.getByRole("combobox", { name: /unidade/i });
    trigger.focus();
    await user.keyboard("{Enter}");
    // navegação por teclado até a segunda opção e confirmação
    await user.keyboard("{ArrowDown}{Enter}");

    expect(onChange).toHaveBeenCalledWith("b");
  });
});

describe("Checkbox", () => {
  it("alterna estado por clique no rótulo e por teclado", async () => {
    const user = userEvent.setup();
    render(
      <label htmlFor="ac" data-testid="wrap">
        <Checkbox id="ac" />
        <span>Concordo</span>
      </label>,
    );
    const cb = screen.getByRole("checkbox");
    expect(cb.getAttribute("aria-checked")).toBe("false");

    await user.click(within(screen.getByTestId("wrap")).getByText(/concordo/i));
    expect(cb.getAttribute("aria-checked")).toBe("true");

    cb.focus();
    await user.keyboard(" ");
    expect(cb.getAttribute("aria-checked")).toBe("false");
  });
});

describe("RadioGroup", () => {
  it("seleciona por clique no rótulo e navega por teclado", async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup aria-label="Prioridade" defaultValue="normal">
        <label htmlFor="r-baixa">
          <RadioGroupItem id="r-baixa" value="baixa" />
          <span>Baixa</span>
        </label>
        <label htmlFor="r-normal">
          <RadioGroupItem id="r-normal" value="normal" />
          <span>Normal</span>
        </label>
        <label htmlFor="r-alta">
          <RadioGroupItem id="r-alta" value="alta" />
          <span>Alta</span>
        </label>
      </RadioGroup>,
    );

    const baixa = screen.getByRole("radio", { name: /baixa/i });
    const normal = screen.getByRole("radio", { name: /normal/i });
    const alta = screen.getByRole("radio", { name: /alta/i });

    expect(normal.getAttribute("aria-checked")).toBe("true");

    await user.click(screen.getByText(/baixa/i));
    expect(baixa.getAttribute("aria-checked")).toBe("true");

    // Teclado: transfere foco para um radio não marcado (envolto em act para
    // aguardar as atualizações internas do RovingFocusGroup do Radix) e
    // confirma a seleção com Space via user-event.
    await act(async () => {
      alta.focus();
    });
    await user.keyboard(" ");
    expect(alta.getAttribute("aria-checked")).toBe("true");
  });
});


describe("Acessibilidade dos controles (jest-axe)", () => {
  it("não apresenta violações axe", async () => {
    const { container } = render(
      <main>
        <h1>Controles</h1>
        <Button>Enviar</Button>
        <label htmlFor="i1">Campo</label>
        <Input id="i1" />
        <label htmlFor="t1">Obs</label>
        <Textarea id="t1" />
        <label htmlFor="c1">
          <Checkbox id="c1" aria-label="Aceito" />
          <span>Aceito</span>
        </label>
        <RadioGroup aria-label="Opções" defaultValue="a">
          <label htmlFor="ra">
            <RadioGroupItem id="ra" value="a" aria-label="A" />
            <span>A</span>
          </label>
          <label htmlFor="rb">
            <RadioGroupItem id="rb" value="b" aria-label="B" />
            <span>B</span>
          </label>
        </RadioGroup>
      </main>,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
