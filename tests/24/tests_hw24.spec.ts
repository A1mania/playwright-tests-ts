import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://www.saucedemo.com/", {
    timeout: 60_000,
    waitUntil: "load",
  });
  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();
});

test("check option to return to product list from product details exists", async ({
  page,
}) => {
  await page.goto("https://www.saucedemo.com/inventory.html");
  await page
    .locator(
      ".inventory_list .inventory_item:first-child .inventory_item_name "
    )
    .click();

  await expect(
    page.getByRole("button", { name: "Back to products" })
  ).toBeVisible();
});

test("check cart is empty after log in @problem", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/inventory.html");

  await expect(page.locator(".shopping_cart_badge")).toHaveCount(0);
});

test.describe("check site urls", () => {
  ["inventory.html", "cart.html", "checkout-step-one.html"].forEach((el) => {
    test(`${el} opens successfuly`, async ({ page }) => {
      await page.goto(`https://www.saucedemo.com/${el}`);
      await expect(page.locator(".app_logo")).toHaveText("Swag Labs");
      await expect(page).toHaveURL(`https://www.saucedemo.com/${el}`);
    });
  });
});

