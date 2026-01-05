import { test as setup} from '@playwright/test';

setup ("log in as problem user", async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('#user-name').fill('problem_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await page.waitForURL("**/inventory.html");

    await page.context().storageState({ path: '.auth/problem-user-state.json'})
});