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
  ).toHaveText("name: user1");
  await expect(
    page.locator(".figure:first-of-type .figcaption a")
  ).toHaveText("View profile");
});

test("check text appears on hover of random image", async ({
  page,
  context,
}) => {
  await page.goto("https://the-internet.herokuapp.com/hovers");
  await page.waitForSelector(".figure");
  const imagesNumber = await page.locator(".figure").count();
  const randomIndex = Math.floor(Math.random() * imagesNumber + 1);
  await page.locator(`.figure:nth-of-type(${randomIndex}) img`).hover();

  await expect(
    page.locator(`.figure:nth-of-type(${randomIndex}) .figcaption`)
  ).toBeVisible();
  await expect(
    page.locator(`.figure:nth-of-type(${randomIndex}) .figcaption h5`)
  ).toHaveText(`name: user${randomIndex}`);
  await expect(
    page.locator(`.figure:nth-of-type(${randomIndex}) .figcaption a`)
  ).toHaveText("View profile");
});
