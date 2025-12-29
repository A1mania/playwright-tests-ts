// Task6: Для сайта https://the-internet.herokuapp.com/upload
// Проверить загрузку файла test.txt (любой файл) на сайт

import { test, expect } from "@playwright/test";
import  path from 'path';

test.beforeEach(async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/upload");
});

test("check file uploaded successfuly from dir", async ({ page }) => {
    const fileName = 'images (4).jpg'
    await page.locator("#file-upload").setInputFiles(path.join(`tests/upload/${fileName}`));
    await page.getByRole('button', { name: 'Upload' }).click();

    await expect(page.locator('.example h3')).toContainText('File Uploaded!')
    await expect(page.locator('#uploaded-files')).toContainText(fileName)
    });

    test("check file uploaded successfuly from buffer", async ({ page }) => {
    await page.locator('#file-upload').setInputFiles({
        name: 'test.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('Test my test file')
    });
    await page.getByRole('button', { name: 'Upload' }).click();

    await expect(page.locator('.example h3')).toContainText('File Uploaded!')
    await expect(page.locator('#uploaded-files')).toContainText('test.txt')
    });