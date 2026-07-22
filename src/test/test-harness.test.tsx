import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";

describe("LV-01.2B.1 — teste comportamental (Node 22, provisório)", () => {
  it("dispara onClick real ao clicar no Button existente", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Confirmar</Button>);

    const btn = screen.getByRole("button", { name: /confirmar/i });
    await user.click(btn);
    await user.click(btn);

    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
