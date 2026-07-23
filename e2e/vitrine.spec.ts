import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const MOBILE = { width: 360, height: 780 };
const DESKTOP = { width: 1440, height: 900 };

test.describe("Vitrine — rota /", () => {
  test("exibe Nivex Control e a seção Controles sem violações axe", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: /nivex control/i })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: /^controles$/i })).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("navegação real por teclado e uso dos controles", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");

    const nome = page.getByLabel(/^nome do responsável$/i).first();
    await nome.focus();
    await page.keyboard.type("Maria");
    await expect(nome).toHaveValue("Maria");

    // avança por Tab até o próximo campo focável (e-mail)
    await page.keyboard.press("Tab");
    const email = page.getByLabel(/^e-mail de contato$/i);
    await expect(email).toBeFocused();

    // checkbox por teclado (foca o controle real e aciona com Espaço)
    const aceite = page.getByRole("checkbox", { name: /li e concordo/i });
    await aceite.focus();
    await expect(aceite).toBeFocused();
    await page.keyboard.press("Space");
    await expect(aceite).toHaveAttribute("aria-checked", "true");
  });

  test("controles atendem 44 px no desktop e 48 px no celular", async ({ page }) => {
    // Desktop
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    const btnDesktop = page.getByRole("button", { name: /^confirmar$/i });
    const inputDesktop = page.getByLabel(/^nome do responsável$/i).first();
    const btnBox = await btnDesktop.boundingBox();
    const inpBox = await inputDesktop.boundingBox();
    expect(btnBox!.height).toBeGreaterThanOrEqual(44);
    expect(inpBox!.height).toBeGreaterThanOrEqual(44);

    // Celular
    await page.setViewportSize(MOBILE);
    await page.reload();
    const btnMobile = page.getByRole("button", { name: /^confirmar$/i });
    const inputMobile = page.getByLabel(/^nome do responsável$/i).first();
    const btnBoxM = await btnMobile.boundingBox();
    const inpBoxM = await inputMobile.boundingBox();
    expect(btnBoxM!.height).toBeGreaterThanOrEqual(48);
    expect(inpBoxM!.height).toBeGreaterThanOrEqual(48);
  });

  test("labels de checkbox e radio estão associados individualmente", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");

    const checkboxes = page.getByRole("checkbox", { name: /li e concordo/i });
    await expect(checkboxes).toHaveCount(1);

    for (const nome of ["baixa", "normal", "alta"]) {
      const radio = page.getByRole("radio", { name: new RegExp(`^${nome}$`, "i") });
      await expect(radio).toHaveCount(1);
    }
  });

  test("sem rolagem horizontal em 360 px", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
