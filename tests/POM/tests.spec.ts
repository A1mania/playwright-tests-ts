// #домашка 26

// - Написать Page Object Model для https://www.saucedemo.com/ (как минимум страниц: login, inventory, cart, checkout-step-one)
// - для каждой страницы написать пару тестов, включая тесты футера и хэдера на тех страницах, где они есть

// Бонус (опционально):
// - вышеперечисленное реализовать через фикстуру. Фикстура должна возвращать страницы пейджобджект (pageObjectFixture.loginPage, pageObjectFixture.inventoryPage, ...)
// - также реализовать ПО для страницы inventory-item и написать для этой страницы несколько тестов

import { test, expect } from "@playwright/test";
import { saucedemoData } from "../testData.ts";
import { LoginPage } from "./loginPage";
import { InventoryPage } from "./inventoryPage";
import { CartPage } from "./cartPage";
import { Checkout1Page } from "./checkout1Page";
import { Layout } from "./layout";
import { InventoryItemPage } from "./inventoryItemPage";

test.describe("SauceDemo POM Tests", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkout1Page: Checkout1Page;
  let layout: Layout;
  let inventoryItemPage: InventoryItemPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    layout = new Layout(page);
    checkout1Page = new Checkout1Page(page);
    inventoryItemPage = new InventoryItemPage(page);
  });

  test.beforeEach(
    "login successfully and navigate to inventory page",
    async ({ page }) => {
      await loginPage.navigate();
      await loginPage.login("standard_user", "secret_sauce");
      await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    }
  );

  test("login with invalid username", async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login("standard_user1", "secret_sauce");
    await expect(page).toHaveURL("https://www.saucedemo.com/");
    const errorMessage = await loginPage.errorMessage.textContent();
    expect(errorMessage).toBe(
      "Epic sadface: Username and password do not match any user in this service"
    );
  });

  test("login with invalid password", async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login("standard_user", "secret_sauce1");
    await expect(page).toHaveURL("https://www.saucedemo.com/");
    const errorMessage = await loginPage.errorMessage.textContent();
    expect(errorMessage).toBe(
      "Epic sadface: Username and password do not match any user in this service"
    );
  });

  test("try to login with no data", async ({ page }) => {
    await loginPage.navigate();
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL("https://www.saucedemo.com/");
    const errorMessage = await loginPage.errorMessage.textContent();
    expect(errorMessage).toBe("Epic sadface: Username is required");
  });

  test("check sorting options on the products page", async () => {
    const sortingList = await inventoryPage.getSortingOptions();
    expect(sortingList).toEqual(saucedemoData.products.sortingOptions);
  });

  test("burger menu opens on product page", async () => {
    await layout.openMenu();
    await expect(inventoryPage.menu).toBeVisible();
  });

  test("check counter appears on cart icon when add item to cart", async () => {
    await inventoryPage.addToCartByIndex(0);
    await expect(layout.cartBadge).toHaveText("1");
  });

  test("check remove button appears after adding item to cart", async () => {
    await inventoryPage.addToCartByIndex(0);
    await expect(inventoryPage.firstItem).toContainText("Remove");
  });

  test("check item appears in the cart page after adding to cart", async () => {
    await inventoryPage.addToCartByIndex(0);
    await layout.openCart();
    await expect(cartPage.cartItemQuantities).toBeVisible();
  });

  test("check empty cart after item removed", async () => {
    await inventoryPage.addToCartByIndex(0);
    await layout.openCart();
    await cartPage.removeItemByIndex(0);
    expect(await cartPage.isCartEmpty()).toBe(true);
  });

  test("checkout overview page opens after filling your info", async ({
    page }) => {
    await inventoryPage.addToCartByIndex(0);
    await layout.openCart();
    await cartPage.proceedToCheckout();
    await checkout1Page.fillFirstName("Anna");
    await checkout1Page.fillLastName("Pa");
    await checkout1Page.fillZipCode("220000");
    await checkout1Page.clickContinueButton();
    await expect(page.locator('[data-test="title"]')).toContainText(
      "Checkout: Overview"
    );
  });

  test("cart opens from checkout overview page opens when click cancel", async ({
    page,
  }) => {
    await inventoryPage.addToCartByIndex(0);
    await layout.openCart();
    await cartPage.proceedToCheckout();
    await checkout1Page.clickCancelButton();
    await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
  });

  test("error appears in checkout overview page opens when click continue with empty data", async ({
    page,
  }) => {
    await inventoryPage.addToCartByIndex(0);
    await layout.openCart();
    await cartPage.proceedToCheckout();
    await checkout1Page.clickContinueButton();
    const errorMessage = await checkout1Page.errorMessage.textContent();
    expect(errorMessage).toBe("Error: First Name is required");
  });

  test("check linkedin page opens from footer", async ({ page }) => {
    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      await layout.clickLinkedinLink(),
    ]);
    await newPage.waitForLoadState("domcontentloaded");
    await expect(newPage).toHaveURL(
      "https://www.linkedin.com/company/sauce-labs/"
    );
  });

  test("check facebook page opens from footer", async ({ page }) => {
    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      await layout.clickFacebookLink(),
    ]);
    await newPage.waitForLoadState("domcontentloaded");
    await expect(newPage).toHaveURL("https://www.facebook.com/saucelabs");
  });

  test("check twitter page opens from footer", async ({ page }) => {
    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      await layout.clickTwitterLink(),
    ]);
    await newPage.waitForLoadState("domcontentloaded");
    await expect(newPage).toHaveURL("https://x.com/saucelabs");
  });

  test("check burger menu is hidden when product page opens", async () => {
    await expect(layout.menuWrapper).toHaveAttribute("aria-hidden", "true");
  });

   test("check add to cart from product detail page", async () => {
    const randomIndex = Math.floor(Math.random() * await inventoryPage.getInventoryItemCount());
    await inventoryPage.openItemDetailsByIndex(randomIndex);
    await inventoryItemPage.addToCart();
    const cartCount = await layout.getCartBadgeCount();
    expect(cartCount).toBe(1);
     });

    test("check remove from cart on product detail page", async () => {
    const randomIndex = Math.floor(Math.random() * await inventoryPage.getInventoryItemCount());
    await inventoryPage.openItemDetailsByIndex(randomIndex);
    await inventoryItemPage.addToCart();
    await inventoryItemPage.removeFromCart();
    await layout.openCart();
    const cartItemsCount = await cartPage.getCartItemsCount();
    expect(cartItemsCount).toBe(0);

    });

    test("check inventory page opens when click back to products on product detail page", async () => {
    const randomIndex = Math.floor(Math.random() * await inventoryPage.getInventoryItemCount());
    await inventoryPage.openItemDetailsByIndex(randomIndex);
    await inventoryItemPage.goBackToProducts();
    await expect(inventoryPage.page).toHaveURL("https://www.saucedemo.com/inventory.html");
  });

 });
 