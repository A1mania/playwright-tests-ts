import { Page, Locator } from "@playwright/test";
import { BasePage } from "./basePage";


export class InventoryItemPage extends BasePage {
  readonly inventoryItemName: Locator;
  readonly inventoryItemPrice: Locator;
  readonly inventoryItemDescription: Locator;
  readonly removeButton: Locator;
  readonly addToCartButton: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    super(page, page.url());
    this.inventoryItemName = page.locator('[data-test="inventory-item-name"]');
    this.inventoryItemPrice = page.locator('[data-test="inventory-item-price"]');
    this.inventoryItemDescription = page.locator('[data-test="inventory-item-desc"]');
    this.removeButton = page.locator('#remove');
    this.addToCartButton = page.locator('#add-to-cart');
    this.backToProductsButton = page.locator('#back-to-products');

  }

  async removeFromCart() {
    await this.removeButton.click();
  }
  
  async addToCart() {
    await this.addToCartButton.click();    
  }

    async goBackToProducts() {
    await this.backToProductsButton.click();
}

};
