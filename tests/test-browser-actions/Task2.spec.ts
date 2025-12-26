// Task2: Для сайта https://the-internet.herokuapp.com/windows
// Открыть новую страницу
// Проверить что она открылась и имеет ожидаемый ЮРЛ и тайтл

import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/windows");
});

test("check new tab url", async ({ page, context }) => {
  const pagePromise = context.waitForEvent("page");
  await page.getByText("Click Here").click();
  const newPage = await pagePromise;

  // option 1
  //   await expect(newPage).toHaveURL(
  //     "https://the-internet.herokuapp.com/windows/new"
  //   )
  // });

  // option2
  await expect(newPage).toHaveTitle("New Window");
});

test("check new tab title", async ({ page, context }) => {
  const pagePromise = context.waitForEvent("page");
  await page.getByText("Click Here").click();
  const newPage = await pagePromise;
  
  const pageTitle = await newPage.locator(".example").innerText();
  expect(pageTitle).toEqual("New Window");
});
