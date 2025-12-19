// Task7: Для сайта https://the-internet.herokuapp.com/download
// Скачать файл sample_upload.txt
// Проверить что его содержимое это "This is a test file for Selenium upload automation."

import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test.beforeEach(async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/download");
});

test("check file downloaded successfuly", async ({ page }) => {
 const downloadPromise = page.waitForEvent('download')
    
  await page.getByText('some-file.txt').click();
  const download = await downloadPromise;
  await download.saveAs("tests/download/" + download.suggestedFilename());
  
  const path = "tests/download/some-file.txt"
  const fileData = readFileSync (path, 'utf-8');
  expect(fileData).toContain('blah blah blah')
});