import { expect } from "@playwright/test";
import { test } from "../../fixtures/custom-fixture";

test("check default products page opens after login", async ({ page, testIdGenerator }) => {
  await page.goto("https://www.saucedemo.com/inventory.html");
  const itemCount = await page.locator('inventory_item').count();
  const randomitem = Math.floor(Math.random() * itemCount + 1);
  await page.getByRole('button', { name: 'Add to cart' }).nth(randomitem).click();
  console.log(`Added item with test ID: ${testIdGenerator}`);
});
