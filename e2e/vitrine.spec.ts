import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const MOBILE = { width: 360, height: 780 };
const TABLET = { width: 768, height: 1024 };
const DESKTOP = { width: 1440, height: 900 };

async function measure(page: Page, locator: ReturnType<Page["locator"]>) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("elemento sem boundingBox");
  return box;
}

async function compositeHeight(
  page: Page,
  controlLocator: ReturnType<Page["locator"]>,
  labelLocator: ReturnType<Page["locator"]>,
) {
  const c = await measure(page, controlLocator);
  const l = await measure(page, labelLocator);
  const top = Math.min(c.y, l.y);
  const bottom = Math.max(c.y + c.height, l.y + l.height);
  return bottom - top;
}

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

    await page.keyboard.press("Tab");
    const email = page.getByLabel(/^e-mail de contato$/i);
    await expect(email).toBeFocused();

    const aceite = page.getByRole("checkbox", { name: /li e concordo/i });
    await aceite.focus();
    await expect(aceite).toBeFocused();
    await aceite.press(" ");
    await expect(aceite).toHaveAttribute("aria-checked", "true");
  });

  for (const vp of [MOBILE, TABLET, DESKTOP]) {
    const min = vp.width <= 360 ? 48 : 44;
    test(`controles, checkbox+rótulo e rádios+rótulo atingem ${min} px em ${vp.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(vp);
      await page.goto("/");

      // Controles simples: botão, input, textarea, select
      const btn = page.getByRole("button", { name: /^confirmar$/i });
      const input = page.getByLabel(/^nome do responsável$/i).first();
      const textarea = page.getByLabel(/^observações$/i);
      const select = page.getByRole("combobox", { name: /^unidade$/i });

      for (const loc of [btn, input, textarea, select]) {
        const box = await measure(page, loc);
        expect(box.height).toBeGreaterThanOrEqual(min);
      }

      // Checkbox + rótulo (área composta)
      const cb = page.getByRole("checkbox", { name: /li e concordo/i });
      const cbLabel = page.locator('label[for="ctrl-aceite"]');
      const cbHeight = await compositeHeight(page, cb, cbLabel);
      expect(cbHeight).toBeGreaterThanOrEqual(min);

      // Radios + rótulo (área composta) para cada opção
      for (const nome of ["baixa", "normal", "alta"]) {
        const radio = page.getByRole("radio", { name: new RegExp(`^${nome}$`, "i") });
        const label = page.locator(`label[for="ctrl-prioridade-${nome}"]`);
        const h = await compositeHeight(page, radio, label);
        expect(h).toBeGreaterThanOrEqual(min);
      }
    });

    test(`sem rolagem horizontal em ${vp.width} px`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto("/");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

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
});
