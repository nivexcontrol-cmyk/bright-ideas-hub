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
    await page.waitForLoadState("networkidle");

    const nome = page.getByLabel(/^nome do responsável$/i).first();
    const email = page.getByLabel(/^e-mail de contato$/i);
    const obs = page.getByLabel(/^observações$/i);
    const unidade = page.getByRole("combobox", { name: /^unidade$/i });
    const aceite = page.getByRole("checkbox", { name: /li e concordo/i });
    const normal = page.getByRole("radio", { name: /^normal$/i });
    const alta = page.getByRole("radio", { name: /^alta$/i });

    // Ponto de partida: foca o primeiro campo do formulário e digita.
    await nome.focus();
    await expect(nome).toBeFocused();
    await page.keyboard.type("Maria");
    await expect(nome).toHaveValue("Maria");

    // Avança por Tab até o e-mail e confirma foco visível.
    await page.keyboard.press("Tab");
    await expect(email).toBeFocused();
    expect(await email.evaluate((el) => el.matches(":focus-visible"))).toBe(true);

    // Tab → textarea de observações.
    await page.keyboard.press("Tab");
    await expect(obs).toBeFocused();
    expect(await obs.evaluate((el) => el.matches(":focus-visible"))).toBe(true);

    // Tab → gatilho do select. A sequência é 100% por teclado e determinística:
    // 1) abre a lista com Space; 2) aguarda as opções renderizarem;
    // 3) ancora o destaque no topo com Home e confirma via polling que
    //    "Loja 001" está de fato destacada (Radix aplica data-highlighted
    //    após o próximo tick, então esperamos o estado intermediário);
    // 4) avança uma opção com ArrowDown e valida, também via polling, que
    //    "Loja 002" recebeu o destaque antes de confirmar;
    // 5) confirma com Enter e verifica fechamento, valor e devolução de foco.
    await page.keyboard.press("Tab");
    await expect(unidade).toBeFocused();
    expect(await unidade.evaluate((el) => el.matches(":focus-visible"))).toBe(true);
    await page.keyboard.press("Space");
    const opcaoLoja001 = page.getByRole("option", { name: /loja 001/i });
    const opcaoLoja002 = page.getByRole("option", { name: /loja 002/i });
    await expect(opcaoLoja001).toBeVisible();
    await expect(opcaoLoja002).toBeVisible();

    await page.keyboard.press("Home");
    await expect
      .poll(async () => opcaoLoja001.getAttribute("data-highlighted"), { timeout: 2000 })
      .toBe("");
    await expect
      .poll(async () => opcaoLoja002.getAttribute("data-highlighted"), { timeout: 2000 })
      .toBeNull();

    await page.keyboard.press("ArrowDown");
    await expect
      .poll(async () => opcaoLoja002.getAttribute("data-highlighted"), { timeout: 2000 })
      .toBe("");
    await expect
      .poll(async () => opcaoLoja001.getAttribute("data-highlighted"), { timeout: 2000 })
      .toBeNull();

    await page.keyboard.press("Enter");
    await expect(opcaoLoja001).toHaveCount(0);
    await expect(opcaoLoja002).toHaveCount(0);
    await expect(unidade).toContainText(/loja 002/i);
    await expect(unidade).toBeFocused();

    // Tab → checkbox. Alterna com Espaço (sem clique).
    await page.keyboard.press("Tab");
    await expect(aceite).toBeFocused();
    expect(await aceite.evaluate((el) => el.matches(":focus-visible"))).toBe(true);
    await expect(aceite).toHaveAttribute("aria-checked", "false");
    await page.keyboard.press("Space");
    await expect(aceite).toHaveAttribute("aria-checked", "true");
    await page.keyboard.press("Space");
    await expect(aceite).toHaveAttribute("aria-checked", "false");
    await page.keyboard.press("Space");
    await expect(aceite).toHaveAttribute("aria-checked", "true");

    // Tab → grupo de rádios (foco no radio marcado atualmente: "normal").
    await page.keyboard.press("Tab");
    await expect(normal).toBeFocused();
    expect(await normal.evaluate((el) => el.matches(":focus-visible"))).toBe(true);
    await expect(normal).toHaveAttribute("aria-checked", "true");

    // Seta para baixo dentro do grupo move o foco para "alta"; a seleção é
    // confirmada com a barra de espaço, mantendo a operação 100% por teclado.
    await page.keyboard.press("ArrowDown");
    await expect(alta).toBeFocused();
    await page.keyboard.press("Space");
    await expect(alta).toHaveAttribute("aria-checked", "true");
    await expect(normal).toHaveAttribute("aria-checked", "false");

    // Shift+Tab retorna o foco ao checkbox anterior, confirmando percurso bidirecional.
    await page.keyboard.press("Shift+Tab");
    await expect(aceite).toBeFocused();
    expect(await aceite.evaluate((el) => el.matches(":focus-visible"))).toBe(true);
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

  test("seção Feedback renderiza alertas, badges e estados", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 2, name: /^feedback$/i })).toBeVisible();

    // Quatro alertas estáticos (não devem ter role status/alert — são live=off).
    for (const label of [/^informação$/i, /^sucesso$/i, /^atenção$/i, /^erro ou bloqueio$/i]) {
      await expect(page.getByText(label).first()).toBeVisible();
    }

    // Badges.
    for (const t of [/em análise/i, /concluído/i, /pendente/i, /bloqueado/i]) {
      await expect(page.getByText(t).first()).toBeVisible();
    }

    // Estados. Escopa ao region "Feedback" para desambiguar do EmptyState do DataTable.
    const feedbackRegion = page.getByRole("region", { name: /^feedback$/i });
    await expect(
      feedbackRegion.getByRole("heading", { level: 3, name: /^nada por aqui ainda$/i }),
    ).toBeVisible();
    await expect(feedbackRegion.getByText(/não foi possível carregar/i)).toBeVisible();
    await expect(feedbackRegion.getByText(/acesso indisponível/i)).toBeVisible();
    await expect(feedbackRegion.locator('[aria-busy="true"]')).toBeVisible();

    // Sem violações axe na página completa.
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("toasts: disparo, empilhamento, dispensa por teclado e foco teal", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");

    const sucesso = page.getByRole("button", { name: /^disparar sucesso$/i });
    const erro = page.getByRole("button", { name: /^disparar erro$/i });
    const empilhar = page.getByRole("button", { name: /^empilhar duas$/i });

    // Foco no botão via teclado: usa page.keyboard para garantir :focus-visible
    // (focus() programático nem sempre satisfaz o heurístico em Chromium).
    await sucesso.evaluate((el) => (el as HTMLElement).focus({ preventScroll: true }));
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(sucesso).toBeFocused();
    expect(await sucesso.evaluate((el) => el.matches(":focus-visible"))).toBe(true);

    // Aguarda o fim da transição visual do foco antes de ler a cor final do
    // outline (a transição de cor pode devolver um valor intermediário).
    await sucesso.evaluate(
      (el) =>
        new Promise<void>((resolve) => {
          const style = getComputedStyle(el);
          const dur = style.transitionDuration
            .split(",")
            .map((v) => {
              const n = parseFloat(v);
              return v.includes("ms") ? n : n * 1000;
            })
            .reduce((a, b) => Math.max(a, b), 0);
          setTimeout(resolve, Math.max(dur, 200) + 50);
        }),
    );

    // Teal oficial #0F6B78 => rgb(15,107,120); contorno sólido de 3 px.
    await expect
      .poll(async () => sucesso.evaluate((el) => getComputedStyle(el).outlineColor))
      .toMatch(/rgb\(\s*15\s*,\s*107\s*,\s*120\s*\)/);
    expect(await sucesso.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe("solid");
    expect(await sucesso.evaluate((el) => getComputedStyle(el).outlineWidth)).toBe("3px");

    // Disparo de sucesso via teclado (Enter no botão focado).
    await page.keyboard.press("Enter");
    await expect(page.getByText(/operação concluída com sucesso\./i)).toBeVisible();

    // Disparo de erro.
    await erro.click();
    await expect(page.getByText(/não foi possível concluir a operação\./i)).toBeVisible();

    // Empilhamento: dois toasts simultâneos.
    await empilhar.click();
    await expect(page.getByText(/primeira notificação empilhada\./i)).toBeVisible();
    await expect(page.getByText(/segunda notificação empilhada\./i)).toBeVisible();

    // Dispensa por teclado: hotkey padrão do Sonner (Alt+T) + Escape.
    await page.keyboard.press("Alt+T");
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    await expect(page.getByText(/primeira notificação empilhada\./i)).toHaveCount(0, {
      timeout: 5000,
    });
  });

  test("DataTable — cenários com zero, um e vinte registros no desktop", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 2, name: /^tabela de dados$/i })).toBeVisible();

    // Cenário zero: EmptyState visível, sem tabela.
    const zero = page.getByTestId("dt-zero-root");
    await expect(zero.getByText(/nada por aqui ainda/i)).toBeVisible();
    await expect(zero.locator("table")).toHaveCount(0);

    // Cenário um: tabela renderizada, um registro.
    const um = page.getByTestId("dt-um-root");
    await expect(um.getByTestId("dt-um-table")).toBeVisible();
    await expect(um.getByRole("row")).toHaveCount(2); // header + 1

    // Cenário vinte: paginação e busca.
    // Localiza pela estrutura acessível real (navigation "Paginação") dentro do DataTable.
    const v = page.getByTestId("dt-vinte-root");
    await expect(v.getByTestId("dt-vinte-table")).toBeVisible();
    const paginationInit = v.getByRole("navigation", { name: /^paginação$/i });
    await expect(paginationInit).toContainText(/20 registros/i);
    await expect(paginationInit).toContainText(/página 1 de 4/i);
  });

  test("DataTable — busca, ordenação por teclado, paginação e ação de linha", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    const v = page.getByTestId("dt-vinte-root");

    // Busca real.
    const search = v.getByLabel(/buscar registros/i);
    await search.fill("TR-002");
    await expect(v.getByRole("cell", { name: "TR-002" })).toBeVisible();
    await expect(v.getByRole("cell", { name: "TR-001" })).toHaveCount(0);
    await search.fill("");

    // Ordenação por teclado no cabeçalho "Identificação".
    const sortBtn = v.getByTestId("dt-vinte-sort-code");
    await sortBtn.focus();
    await expect(sortBtn).toBeFocused();
    // Foco visível teal 3 px sólido.
    expect(await sortBtn.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe("solid");
    expect(await sortBtn.evaluate((el) => getComputedStyle(el).outlineWidth)).toBe("3px");
    await page.keyboard.press("Enter");
    const headerCode = v.locator('th:has([data-testid="dt-vinte-sort-code"])');
    await expect(headerCode).toHaveAttribute("aria-sort", "ascending");
    await page.keyboard.press("Space");
    await expect(headerCode).toHaveAttribute("aria-sort", "descending");
    await page.keyboard.press("Enter");
    await expect(headerCode).toHaveAttribute("aria-sort", "none");

    // Paginação: avança e volta.
    const next = v.getByTestId("dt-vinte-next");
    const prev = v.getByTestId("dt-vinte-prev");
    await expect(prev).toBeDisabled();
    await next.click();
    await expect(v.getByTestId("dt-vinte-pagination-info")).toContainText(/página 2 de 4/i);
    await next.click();
    await next.click();
    await expect(next).toBeDisabled();
    await expect(v.getByTestId("dt-vinte-pagination-info")).toContainText(/página 4 de 4/i);
    await prev.click();
    await expect(v.getByTestId("dt-vinte-pagination-info")).toContainText(/página 3 de 4/i);

    // Ação de linha no cenário "um".
    const um = page.getByTestId("dt-um-root");
    const acao = um.getByRole("button", { name: /ver detalhes de tr-001/i });
    await acao.click();
    await expect(page.getByText(/registro tr-001 aberto\.|registro aberto\./i)).toBeVisible();
  });

  test("DataTable — cards abaixo de 768 px e sem rolagem horizontal", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto("/");

    const v = page.getByTestId("dt-vinte-root");
    // Sem tabela; presença de cards.
    await expect(v.locator("table")).toHaveCount(0);
    await expect(v.getByTestId("dt-vinte-cards")).toBeVisible();
    // Rótulos preservados.
    await expect(v.getByText(/identificação/i).first()).toBeVisible();
    await expect(v.getByText(/responsável/i).first()).toBeVisible();

    // Nenhuma rolagem horizontal na página inteira.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  for (const vp of [MOBILE, TABLET, DESKTOP]) {
    test(`axe — vitrine completa sem violações em ${vp.width} px`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto("/");
      await expect(
        page.getByRole("heading", { level: 2, name: /^tabela de dados$/i }),
      ).toBeVisible();
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
});
