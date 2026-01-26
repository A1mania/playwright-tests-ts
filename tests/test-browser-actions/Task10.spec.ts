// Task10: Для сайта https://the-internet.herokuapp.com/iframe
// Создать тест для проверки кнопок в верхнем меню эдитора (["File", "Edit", "View", "Format"])
// Проверить что кнопки неактивны (disabled)
// Проверить текст в форме ("Your content goes here.")
// (опционально, сложная задача) Сделать возможным редактировать текст в форме.
//    Дописать свое имя в форму и проверить что форма была модифицирована

import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/iframe");
});

test("check menu buttons", async ({ page }) => {
  const menuButtons = await page
    .locator(".tox-menubar button")
    .allInnerTexts();

  expect(menuButtons).toEqual(["File", "Edit", "View", "Format"]);
});

test("check menu buttons are disabled by default", async ({ page }) => {
  await expect(page.locator(".tox-menubar")).toBeDisabled();
});

test("check iframe default text", async ({ page }) => {
  const iFrame = page.frameLocator("#mce_0_ifr");

  await expect(iFrame.locator("#tinymce p")).toContainText(
    "Your content goes here."
  );
});

test("check form can be filled", async ({ page }) => {
  await page.locator('div[role="alert"] .tox-icon').click();
  const iFrame = page.frameLocator("#mce_0_ifr");
  const editorBody = iFrame.locator("body#tinymce");
  await editorBody.evaluate((el) => {
    el.setAttribute("contenteditable", "true");
  });

  await editorBody.click();
  await editorBody.fill("Anna");
  await expect(editorBody).toContainText("Anna");
});
