// #домашка 26

// - Написать Page Object Model для https://www.saucedemo.com/ (как минимум страниц: login, inventory, cart, checkout-step-one)
// - для каждой страницы написать пару тестов, включая тесты футера и хэдера на тех страницах, где они есть

// Бонус (опционально):
// - вышеперечисленное реализовать через фикстуру. Фикстура должна возвращать страницы пейджобджект (pageObjectFixture.loginPage, pageObjectFixture.inventoryPage, ...)
// - также реализовать ПО для страницы inventory-item и написать для этой страницы несколько тестов

import { expect } from "@playwright/test";
import { saucedemoData } from "../testData.ts";
import { test } from "../../fixtures/custom-fixture";

test.describe("SauceDemo POM Tests", () => {
 
   test.beforeEach(
    "login successfully and navigate to inventory page",
    async ({ swagLabs, page }) => {
      await swagLabs.loginPage.navigate();
      await swagLabs.loginPage.login("standard_user", "secret_sauce");
      await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    }
  );

  test("login with invalid username", async ({ swagLabs, page }) => {
    await swagLabs.loginPage.navigate();
    await swagLabs.loginPage.login("standard_user1", "secret_sauce");
    await expect(page).toHaveURL("https://www.saucedemo.com/");
    const errorMessage = await swagLabs.loginPage.errorMessage.textContent();
    expect(errorMessage).toBe(
      "Epic sadface: Username and password do not match any user in this service"
    );
  });

  test("login with invalid password", async ({ swagLabs, page }) => {
    await swagLabs.loginPage.navigate();
    await swagLabs.loginPage.login("standard_user", "secret_sauce1");
    await expect(page).toHaveURL("https://www.saucedemo.com/");
    const errorMessage = await swagLabs.loginPage.errorMessage.textContent();
    expect(errorMessage).toBe(
      "Epic sadface: Username and password do not match any user in this service"
    );
  });

  test("try to login with no data", async ({ swagLabs, page }) => {
    await swagLabs.loginPage.navigate();
    await swagLabs.loginPage.clickLoginButton();
    await expect(page).toHaveURL("https://www.saucedemo.com/");
    const errorMessage = await swagLabs.loginPage.errorMessage.textContent();
    expect(errorMessage).toBe("Epic sadface: Username is required");
  });

  test("check sorting options on the products page", async ( {swagLabs} ) => {
    const sortingList = await swagLabs.inventoryPage.getSortingOptions();
    expect(sortingList).toEqual(saucedemoData.products.sortingOptions);
  });

  test("burger menu opens on product page", async ( {swagLabs} ) => {
    await swagLabs.layout.openMenu();
    await expect(swagLabs.inventoryPage.menu).toBeVisible();
  });

  test("check counter appears on cart icon when add item to cart", async ( {swagLabs} ) => {
    await swagLabs.inventoryPage.addToCartByIndex(0);
    await expect(swagLabs.layout.cartBadge).toHaveText("1");
  });

  test("check remove button appears after adding item to cart", async ( {swagLabs} ) => {
    await swagLabs.inventoryPage.addToCartByIndex(0);
    await expect(swagLabs.inventoryPage.firstItem).toContainText("Remove");
  });

  test("check item appears in the cart page after adding to cart", async ( {swagLabs} ) => {
    await swagLabs.inventoryPage.addToCartByIndex(0);
    await swagLabs.layout.openCart();
    await expect(swagLabs.cartPage.cartItemQuantities).toBeVisible();
  });

  test("check empty cart after item removed", async ( {swagLabs} ) => {
    await swagLabs.inventoryPage.addToCartByIndex(0);
    await swagLabs.layout.openCart();
    await swagLabs.cartPage.removeItemByIndex(0);
    expect(await swagLabs.cartPage.isCartEmpty()).toBe(true);
  });

  test("checkout overview page opens after filling your info", async ({
    page, swagLabs }) => {
    await swagLabs.inventoryPage.addToCartByIndex(0);
    await swagLabs.layout.openCart();
    await swagLabs.cartPage.proceedToCheckout();
    await swagLabs.checkoutInfoPage.fillFirstName("Anna");
    await swagLabs.checkoutInfoPage.fillLastName("Pa");
    await swagLabs.checkoutInfoPage.fillZipCode("220000");
    await swagLabs.checkoutInfoPage.clickContinueButton();
    await expect(page.locator('[data-test="title"]')).toContainText(
      "Checkout: Overview"
    );
  });

  test("cart opens from checkout overview page opens when click cancel", async ({
    page, swagLabs
  }) => {
    await swagLabs.inventoryPage.addToCartByIndex(0);
    await swagLabs.layout.openCart();
    await swagLabs.cartPage.proceedToCheckout();
    await swagLabs.checkoutInfoPage.clickCancelButton();
    await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
  });

  test("error appears in checkout overview page opens when click continue with empty data", async ({
    page, swagLabs
  }) => {
    await swagLabs.inventoryPage.addToCartByIndex(0);
    await swagLabs.layout.openCart();
    await swagLabs.cartPage.proceedToCheckout();
    await swagLabs.checkoutInfoPage.clickContinueButton();
    const errorMessage = await swagLabs.checkoutInfoPage.errorMessage.textContent();
    expect(errorMessage).toBe("Error: First Name is required");
  });

  test("check linkedin page opens from footer", async ({ page, swagLabs }) => {
    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      await swagLabs.layout.clickLinkedinLink(),
    ]);
    await newPage.waitForLoadState("domcontentloaded");
    await expect(newPage).toHaveURL(
      "https://www.linkedin.com/company/sauce-labs/"
    );
  });

  test("check facebook page opens from footer", async ({ page, swagLabs }) => {
    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      await swagLabs.layout.clickFacebookLink(),
    ]);
    await newPage.waitForLoadState("domcontentloaded");
    await expect(newPage).toHaveURL("https://www.facebook.com/saucelabs");
  });

  test("check twitter page opens from footer", async ({ page, swagLabs }) => {
    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      await swagLabs.layout.clickTwitterLink(),
    ]);
    await newPage.waitForLoadState("domcontentloaded");
    await expect(newPage).toHaveURL("https://x.com/saucelabs");
  });

  test("check burger menu is hidden when product page opens", async ( {swagLabs} ) => {
    await expect(swagLabs.layout.menuWrapper).toHaveAttribute("aria-hidden", "true");
  });

   test("check add to cart from product detail page", async ( {swagLabs} ) => {
    const randomIndex = Math.floor(Math.random() * await swagLabs.inventoryPage.getInventoryItemCount());
    await swagLabs.inventoryPage.openItemDetailsByIndex(randomIndex);
    await swagLabs.inventoryItemPage.addToCart();
    const cartCount = await swagLabs.layout.getCartBadgeCount();
    expect(cartCount).toBe(1);
     });

    test("check remove from cart on product detail page", async ( {swagLabs} ) => {
    const randomIndex = Math.floor(Math.random() * await swagLabs.inventoryPage.getInventoryItemCount());
    await swagLabs.inventoryPage.openItemDetailsByIndex(randomIndex);
    await swagLabs.inventoryItemPage.addToCart();
    await swagLabs.inventoryItemPage.removeFromCart();
    await swagLabs.layout.openCart();
    const cartItemsCount = await swagLabs.cartPage.getCartItemsCount();
    expect(cartItemsCount).toBe(0);

    });

    test("check inventory page opens when click back to products on product detail page", async ( {swagLabs} ) => {
    const randomIndex = Math.floor(Math.random() * await swagLabs.inventoryPage.getInventoryItemCount());
    await swagLabs.inventoryPage.openItemDetailsByIndex(randomIndex);
    await swagLabs.inventoryItemPage.goBackToProducts();
    await expect(swagLabs.inventoryPage.page).toHaveURL("https://www.saucedemo.com/inventory.html");
  });

 });
 