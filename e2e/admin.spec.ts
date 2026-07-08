import { expect, test } from "@playwright/test";

test.describe("Admin area", () => {
  test("redirects unauthenticated users from /admin to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login?redirect=/admin");
    await expect(page.getByRole("heading", { name: "Entrar" })).toBeVisible();
  });

  test("admin conteudo page requires auth", async ({ page }) => {
    await page.goto("/admin/conteudo");
    await expect(page).toHaveURL(/\/login/);
  });

  test("admin usuarios page requires auth", async ({ page }) => {
    await page.goto("/admin/usuarios");
    await expect(page).toHaveURL(/\/login/);
  });
});
