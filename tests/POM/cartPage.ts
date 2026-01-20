import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class CartPage extends BasePage {
readonly cartBadge: Locator;
readonly cartItems: Locator;
readonly checkoutButton: Locator;
readonly continueShoppingButton: Locator;
readonly cartItemNames: Locator;
readonly cartItemPrices: Locator;
readonly cartItemQuantities: Locator;
readonly removeButtons: Locator;

    constructor(page: Page) {
        super(page, 'https://www.saucedemo.com/inventory.html');
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.cartItems = page.locator('.cart_item');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
        this.cartItemNames = page.locator('.inventory_item_name');
        this.cartItemPrices = page.locator('.inventory_item_price');
        this.cartItemQuantities = page.locator('.cart_quantity');
        this.removeButtons = page.locator('[data-test^="remove-"]');
    }

    async getCartItemsCount(): Promise<number> {
        return await this.cartItems.count();
    }

    async getItemNames(): Promise<string[]> {
        return await this.cartItemNames.allTextContents();
    }

    async getItemPrices(): Promise<string[]> {
        return await this.cartItemPrices.allTextContents();
    }

    async getItemQuantities(): Promise<string[]> {
        return await this.cartItemQuantities.allTextContents();
    }

    async getTotalPrice(): Promise<number> {
        const prices = await this.getItemPrices();
        return prices.reduce((total, price) => total + parseFloat(price.replace('$', '')), 0);
    }

    async getCartBadgeCount(): Promise<number> {
        const badgeText = await this.cartBadge.textContent();
        return Number(badgeText || "0");
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
    }

    async removeItemByIndex(itemIndex: number) {
        await this.removeButtons.nth(itemIndex).click();       
    }

    async removeItemByName(itemName: string) {
        const item = this.cartItems.filter({ hasText: itemName });
        await item.locator('[data-test="remove"]').click();
    }
     async isCartEmpty(): Promise<boolean> {
        return await this.cartItems.count() === 0;
    }

    async verifyItemInCart(itemName: string): Promise<boolean> {
        const itemNames = await this.getItemNames();
        return itemNames.includes(itemName);
    }
    
}