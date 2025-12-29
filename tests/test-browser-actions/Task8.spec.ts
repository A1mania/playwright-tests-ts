// Task8: Для сайта https://the-internet.herokuapp.com/javascript_alerts
// Вызвать JS confirm через соответствующую опцию (проверить что алерт появился)
// Закрыть его через accept/dismiss и проверить результат 

import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/javascript_alerts");
});

test("check alert appears", async ({ page }) => {
  page.on("dialog", async (dialog_popup) => {
    expect(dialog_popup.message()).toContain("I am a JS Confirm");
  });
});

test("check alert closed sucessfully - ok", async ({ page }) => {
  page.on("dialog", async (dialog_popup) => {
    await dialog_popup.accept();
  });
  await page.getByText("Click for JS confirm").click();

  await expect(page.locator("#result")).toHaveText("You clicked: Ok");
});

test("check alert closed sucessfully - cancel", async ({ page }) => {
  page.on("dialog", async (dialog_popup) => {
    await dialog_popup.dismiss();
  });
  await page.getByText("Click for JS confirm").click();

  await expect(page.locator("#result")).toHaveText("You clicked: Cancel");
});

