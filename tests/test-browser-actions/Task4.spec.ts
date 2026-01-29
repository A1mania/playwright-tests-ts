// Task4: Для сайта https://the-internet.herokuapp.com/drag_and_drop
// Перетащить элемент А на элемент В
// Проверить что они поменялись местами

import { test, expect } from "@playwright/test";

test("check drag and drop", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/drag_and_drop", {timeout:12000});
  // const sourceEl = page.locator("#column-a");
  // const destinationEl = page.locator("#column-b");
  const firstColumn = page.locator("#columns :first-child header");

  // option1
  //   await sourceEl.dragTo(destinationEl);

  // option2
  // await sourceEl.hover();
  // await page.mouse.down();
  // await destinationEl.hover();
  // await page.mouse.up();

  // option3
  await page.dragAndDrop("#column-a", "#column-b");
  await page.waitForLoadState('domcontentloaded');

  await expect(firstColumn).toHaveText("B");
});

