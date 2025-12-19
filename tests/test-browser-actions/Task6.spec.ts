// Task6: Для сайта https://the-internet.herokuapp.com/upload
// Проверить загрузку файла test.txt (любой файл) на сайт

import { test, expect } from "@playwright/test";
import  path from 'path';

test.beforeEach(async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/upload");
});

test("check file uploaded successfuly", async ({ page }) => {
    await page.locator("#file-upload").setInputFiles(path.join('tests/upload/images (4).jpg'));
    await page.getByRole('button', { name: 'Upload' }).click();
    await expect(page.locator('.example h3')).toContainText('File Uploaded!')
});