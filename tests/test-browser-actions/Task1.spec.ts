// Task1: Для сайта https://books-pwakit.appspot.com/ найти:
// Локатор для строки "Search the world's most comprehensive index of full-text books."
// Проверить что текст совпадает с ожидаемым

import { test, expect } from "@playwright/test";

test("check description text in the home page", async ({ page }) => {
  await page.goto("https://books-pwakit.appspot.com/");
  const description = await page.locator(".books-desc").innerText();
  expect(description).toEqual(
    "Search the world's most comprehensive index of full-text books."
  );
});
