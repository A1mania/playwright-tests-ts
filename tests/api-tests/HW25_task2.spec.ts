import { test, expect } from "@playwright/test";
import { executeUrl } from "./constants";

test.describe("API tests", () => {
  test("receive data sucessfully", async ({ request }) => {
    const response = await request.get(executeUrl);
    expect(response.status()).toBe(200);
  });

  test("Response body success message", async ({ request, page }) => {
    const response = await request.get(executeUrl);
    const responseBody = await response.json();
    expect(responseBody).toMatchObject({
      message: "Success! Expected data received.",
    });

    await page.goto(
      "https://pu5hds6usi.execute-api.us-east-1.amazonaws.com/mocks"
    );
    await page.locator("#fetchBtn").click();
    await page.waitForResponse(executeUrl);
    const message = await page.locator("#result").innerText();
    expect(message).toEqual("Success! Expected data received.");
  });

  test("Mock bad requests error", async ({ page }) => {
    await page.route(executeUrl, (route) => {
      route.fulfill({
        status: 400,
      });
    });
    await page.goto(
      "https://pu5hds6usi.execute-api.us-east-1.amazonaws.com/mocks"
    );
    await page.locator("#fetchBtn").click();
    await page.waitForResponse(executeUrl);
    const message = await page.locator("#result").innerText();
    expect(message).toEqual("Network error");
  });
});
