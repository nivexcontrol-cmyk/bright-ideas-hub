import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("rota principal exibe Nivex Control e não tem violações axe", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /nivex control/i })).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(results.violations).toEqual([]);
});
