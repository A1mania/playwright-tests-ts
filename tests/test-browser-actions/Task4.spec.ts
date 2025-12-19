// Task4: Для сайта https://the-internet.herokuapp.com/drag_and_drop
// Перетащить элемент А на элемент В
// Проверить что они поменялись местами

import { test, expect } from "@playwright/test";

test("check drag and drop", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/drag_and_drop");
  const sourceEl = page.locator("#column-a");
  const destinationEl = page.locator("#column-b");
  //   await sourceEl.dragTo(destinationEl);
  await sourceEl.hover();
  await page.mouse.down();
  await destinationEl.hover();
  await page.mouse.up();
  const firstColumn = page.locator("#columns :first-child header");

  expect(firstColumn).toHaveText("B");
});
