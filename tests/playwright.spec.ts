import { test, expect } from '@playwright/test';
import { saucedemoData } from "./testData.ts";

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com/', {timeout: 60_000, waitUntil: "load"});
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  });

test('check default products page opens after login', async ({ page }) => {
  await expect(page.locator('[data-test="title"]')).toContainText('Products')
  });

test('check sorting options on the products page', async ({ page }) => {
const sortingList = await page.locator('.product_sort_container option').allInnerTexts()

expect(sortingList).toEqual(saucedemoData.products.sortingOptions)
});  

test('burger menu opens on product page', async ({ page }) => {
await page.locator('#react-burger-menu-btn').click()
const menu = page.locator('.bm-menu');

await expect(menu).toBeVisible();
});

test('check counter appears on cart icon when add item to cart', async ({ page }) => {
await page.locator('.inventory_list .inventory_item:first-child [class="btn btn_primary btn_small btn_inventory "]').click();
const badge = page.locator('#shopping_cart_container .shopping_cart_badge');

await expect(badge).toHaveText('1');
});

test('check remove button appers after adding item to cart', async ({ page }) => {
await page.locator('.inventory_list .inventory_item:first-child [class="btn btn_primary btn_small btn_inventory "]').click();
const firstItem = page.locator('.inventory_list .inventory_item:first-child');

await expect(firstItem).toContainText('Remove');
});

//with Codegen

test('check log out successfully', async ({ page }) => {
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
});

test('check item appears in the cart page after adding to cart', async ({ page }) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page.locator('[data-test="item-quantity"]')).toBeVisible();
});

test('checkout overview page opens after filling your info', async ({ page }) => {
 await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').click();
  await page.locator('[data-test="firstName"]').fill('Anna');
  await page.locator('[data-test="lastName"]').click();
  await page.locator('[data-test="lastName"]').fill('Pa');
  await page.locator('[data-test="postalCode"]').click();
  await page.locator('[data-test="postalCode"]').fill('220000');
  await page.locator('[data-test="continue"]').click();
  await expect(page.locator('[data-test="title"]')).toContainText('Checkout: Overview');
  });