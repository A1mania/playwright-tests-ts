// Task3: Для сайта https://the-internet.herokuapp.com/hovers
// С помощью указателя мыши навестись на любую из картинок
// Проверить, что ожидаемый текст под картинкой появился

import { test, expect } from "@playwright/test";

test("check text appears on hover", async ({ page, context }) => {
  await page.goto("https://the-internet.herokuapp.com/hovers");
  await page.locator(".figure:first-of-type img").hover();

  await expect(page.locator(".figure:first-of-type .figcaption")).toBeVisible();
  await expect(
    page.locator(".figure:first-of-type .figcaption h5")
  ).toContainText("name: user1");
  await expect(
    page.locator(".figure:first-of-type .figcaption a")
  ).toContainText("View profile");
});
