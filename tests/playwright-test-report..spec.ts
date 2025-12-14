import { test, expect } from "@playwright/test";
import { saucedemoData } from "./testData.ts";

test.beforeEach(async ({ page }) => {
  await page.goto("https://www.saucedemo.com/", {
    timeout: 60_000,
    waitUntil: "load",
  });
  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();
});

//page assertion

test("check linkedin page opens from footer", async ({ page, context }) => {
  // начать ожидание новой страницы
  // ---> ДО того, как ссылка нажата
  const [newPage] = await Promise.all([
    page.waitForEvent("popup"),
    await page
      .locator('.social_linkedin a[data-test="social-linkedin"]')
      .click(),
  ]);
  // ждем новую страницу
  await newPage.waitForLoadState("domcontentloaded");
  await expect(newPage).toHaveURL(
    "https://www.linkedin.com/company/sauce-labs/"
  );
});

//Generic assertion

test("check burger menu items", async ({ page }) => {
  await page.locator("#react-burger-menu-btn").click();
  const menuItems = await page.locator(".bm-item-list a").allInnerTexts();
  expect(menuItems).toEqual(saucedemoData.menuOptions);
});

//Locator assertion

test("check burger menu is hidden when product page opens", async ({
  page,
}) => {
  expect(page.locator(".bm-menu")).toBeHidden;
});

//assertion with screenshot

test("check empty crat after item removed", async ({ page }) => {
  await page
    .locator(
      '.inventory_list .inventory_item:first-child [class="btn btn_primary btn_small btn_inventory "]'
    )
    .click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  page.getByRole("button", { name: "Remove" }).click();

  await expect(page).toHaveScreenshot();
});

//custom assertion

test("check sorting by price ASC", async ({ page }) => {
  await page.locator(".product_sort_container").selectOption("lohi");
  const priceValues = await page
    .locator(
      '.inventory_item_description div[data-test="inventory-item-price"]'
    )
    .allInnerTexts();
  const prices = priceValues.map((item) => Number(item.replace("$", "")));
  const ifSortedAsc = () => {
    for (let i = 0; i < prices.length - 1; i++) {
      if (prices[i] > prices[i + 1]) return false;
    }
    return true;
  };
  expect(ifSortedAsc()).toBe(true);
});

//test with tracing

test("check product page opens on clicking continue shopping in the cart", async ({
  page,
}) => {
  await page.context().tracing.start({ screenshots: true, snapshots: true });
  await page
    .locator(
      '.inventory_list .inventory_item:first-child [class="btn btn_primary btn_small btn_inventory "]'
    )
    .click();
  page.locator(".inventory_list .inventory_item:first-child");
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="continue-shopping"]').click();
  await page.context().tracing.stop({ path: "test-tracing.zip" });

  await expect(page.locator('[data-test="title"]')).toContainText("Products");
});

//failed then fixed test

test("check your info page opens when click checkout in the cart", async ({
  page,
}) => {
  await page
    .locator(
      '.inventory_list .inventory_item:first-child [class="btn btn_primary btn_small btn_inventory "]'
    )
    .click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  // await expect(page.locator('[data-test="title"]')).toContainText('Checkout: Yours Information');
  await expect(page.locator('[data-test="title"]')).toContainText(
    "Checkout: Your Information"
  );
});
