import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { Button } from "@/components/ui/button";

describe("LV-01.2B.1 — teste de acessibilidade (Node 22, provisório)", () => {
  it("Button existente não apresenta violações axe", async () => {
    const { container } = render(
      <main>
        <h1>Nivex Control</h1>
        <Button>Ação principal</Button>
      </main>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
