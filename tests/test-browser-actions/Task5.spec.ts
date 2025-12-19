// Task5: Для сайта https://the-internet.herokuapp.com/key_presses
// Проверить нажатие клавиши "Control"
// Проверить что отображается последняя буква вашего имени после ввода через клавиатуру

import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/key_presses");
  await page.locator("#target")
    .click();
});

test("check CTRL pressed", async ({ page }) => {
    await page.keyboard.down('Control');
    
  await expect(page.locator("#result")).toHaveText('You entered: CONTROL');
});

test("check insert name successfully", async ({ page }) => {
  await page.keyboard.type('Anna');  
  await expect(page.locator("#result")).toHaveText('You entered: A');
});