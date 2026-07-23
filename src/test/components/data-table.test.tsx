import * as React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";

import { DataTable } from "@/components/data-table/data-table";
import type { DataTableColumn, DataTableRowAction } from "@/components/data-table/types";
import { EmptyState } from "@/components/feedback/empty-state";

interface Task {
  id: string;
  code: string;
  store: string;
  responsible: string;
  situation: string;
  hour: string;
}

const mkRows = (n: number): Task[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `t-${i + 1}`,
    code: `T-${String(i + 1).padStart(3, "0")}`,
    store: `Loja ${String((i % 3) + 1).padStart(3, "0")}`,
    responsible: ["Ana", "Bruno", "Carla", "Diego"][i % 4],
    situation: ["Pendente", "Em execução", "Concluído"][i % 3],
    hour: `${String(8 + (i % 10)).padStart(2, "0")}:00`,
  }));

const columns: DataTableColumn<Task>[] = [
  { id: "code", header: "Identificação", accessor: (r) => r.code },
  { id: "store", header: "Loja", accessor: (r) => r.store },
  { id: "responsible", header: "Responsável", accessor: (r) => r.responsible },
  { id: "situation", header: "Situação", accessor: (r) => r.situation },
  { id: "hour", header: "Horário", accessor: (r) => r.hour },
];

function setViewport(width: number) {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
  window.dispatchEvent(new Event("resize"));
}

function mockMatchMedia(width: number) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => {
    // Extract max-width from query
    const m = /max-width:\s*(\d+)/.exec(query);
    const max = m ? parseInt(m[1], 10) : Infinity;
    return {
      matches: width <= max,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  }) as unknown as typeof window.matchMedia;
}

beforeEach(() => {
  mockMatchMedia(1440);
  setViewport(1440);
});

afterEach(() => {
  vi.restoreAllMocks();
});

const renderTable = (rows: Task[], actions?: DataTableRowAction<Task>[]) =>
  render(
    <DataTable<Task>
      caption="Tarefas de reposição"
      columns={columns}
      data={rows}
      getRowId={(r) => r.id}
      rowActions={actions}
      pageSize={5}
      emptyState={<EmptyState title="Nada por aqui" description="Sem registros." />}
    />,
  );

describe("DataTable — renderização", () => {
  it("renderiza estado vazio quando não há registros", () => {
    renderTable([]);
    expect(screen.getByText(/nada por aqui/i)).not.toBeNull();
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("renderiza um único registro em modo tabela", () => {
    renderTable(mkRows(1));
    expect(screen.getByRole("table")).not.toBeNull();
    expect(screen.getByText("T-001")).not.toBeNull();
  });

  it("renderiza vinte registros paginando em 5 por página", () => {
    renderTable(mkRows(20));
    expect(screen.getByRole("table")).not.toBeNull();
    expect(screen.getByTestId("dt-pagination-info").textContent).toMatch(/20 registros/i);
    expect(screen.getByTestId("dt-pagination-info").textContent).toMatch(/página 1 de 4/i);
  });
});

describe("DataTable — busca", () => {
  it("filtra e restaura resultados", async () => {
    const user = userEvent.setup();
    renderTable(mkRows(20));
    const search = screen.getByLabelText(/buscar registros/i);
    await user.type(search, "T-002");
    expect(screen.getByText("T-002")).not.toBeNull();
    expect(screen.queryByText("T-001")).toBeNull();
    await user.clear(search);
    expect(screen.getByText("T-001")).not.toBeNull();
  });
});

describe("DataTable — ordenação", () => {
  it("alterna crescente → decrescente → sem ordenação com mouse", async () => {
    const user = userEvent.setup();
    renderTable(mkRows(20));
    const btn = screen.getByTestId("dt-sort-code");
    const header = btn.closest("th")!;
    expect(header.getAttribute("aria-sort")).toBe("none");
    await user.click(btn);
    expect(header.getAttribute("aria-sort")).toBe("ascending");
    await user.click(btn);
    expect(header.getAttribute("aria-sort")).toBe("descending");
    await user.click(btn);
    expect(header.getAttribute("aria-sort")).toBe("none");
  });

  it("funciona por teclado (Enter/Espaço)", async () => {
    const user = userEvent.setup();
    renderTable(mkRows(20));
    const btn = screen.getByTestId("dt-sort-responsible");
    const header = btn.closest("th")!;
    btn.focus();
    await user.keyboard("{Enter}");
    expect(header.getAttribute("aria-sort")).toBe("ascending");
    await user.keyboard(" ");
    expect(header.getAttribute("aria-sort")).toBe("descending");
  });
});

describe("DataTable — paginação", () => {
  it("avança e volta; bloqueia nos extremos", async () => {
    const user = userEvent.setup();
    renderTable(mkRows(20));
    const prev = screen.getByTestId("dt-prev") as HTMLButtonElement;
    const next = screen.getByTestId("dt-next") as HTMLButtonElement;
    expect(prev.disabled).toBe(true);
    expect(next.disabled).toBe(false);
    await user.click(next);
    expect(screen.getByTestId("dt-pagination-info").textContent).toMatch(/página 2 de 4/i);
    expect(prev.disabled).toBe(false);
    await user.click(next);
    await user.click(next);
    expect(screen.getByTestId("dt-pagination-info").textContent).toMatch(/página 4 de 4/i);
    expect(next.disabled).toBe(true);
    await user.click(prev);
    expect(screen.getByTestId("dt-pagination-info").textContent).toMatch(/página 3 de 4/i);
  });
});

describe("DataTable — ações", () => {
  it("dispara a ação recebendo o registro correto", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const actions: DataTableRowAction<Task>[] = [
      {
        id: "view",
        label: (r) => `Ver detalhes de ${r.code}`,
        children: "Ver",
        onClick,
      },
    ];
    renderTable(mkRows(3), actions);
    const btn = screen.getByRole("button", { name: /ver detalhes de t-002/i });
    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0].code).toBe("T-002");
  });
});

describe("DataTable — modo mobile", () => {
  it("abaixo de 768 px substitui a tabela por cards", () => {
    mockMatchMedia(360);
    setViewport(360);
    renderTable(mkRows(3));
    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.getByTestId("dt-cards")).not.toBeNull();
    // rótulos preservados
    expect(screen.getAllByText(/identificação/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/responsável/i).length).toBeGreaterThan(0);
  });
});

describe("DataTable — acessibilidade (axe)", () => {
  it("zero registros — sem violações", async () => {
    const { container } = renderTable([]);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it("um registro — sem violações", async () => {
    const { container } = renderTable(mkRows(1));
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it("vinte registros com ações — sem violações", async () => {
    const actions: DataTableRowAction<Task>[] = [
      { id: "view", label: (r) => `Ver ${r.code}`, children: "Ver", onClick: () => {} },
    ];
    const { container } = renderTable(mkRows(20), actions);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
