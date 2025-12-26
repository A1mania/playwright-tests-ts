// Task7: Для сайта https://the-internet.herokuapp.com/download
// Скачать файл sample_upload.txt
// Проверить что его содержимое это "This is a test file for Selenium upload automation."

import { test, expect } from "@playwright/test";
import { readFileSync, unlinkSync } from "fs";

let downloadPath: string;

test.beforeEach(async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/download");
});

test("check file downloaded successfuly", async ({ page }) => {
  const downloadPromise = page.waitForEvent("download");

  await page.getByText("test_file.txt").click();
  const download = await downloadPromise;
  downloadPath = "tests/download/" + download.suggestedFilename();
  await download.saveAs(downloadPath);

  const fileData = readFileSync(downloadPath, "utf-8");
  expect(fileData.trim()).toBe("Test file content");
});

test.afterEach(() => {
  unlinkSync(downloadPath);
});