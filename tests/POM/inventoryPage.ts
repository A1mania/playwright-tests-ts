import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
import { InventoryItemPage } from './inventoryItemPage';

export class InventoryPage extends BasePage {
readonly inventoryItems: Locator;
readonly addToCartButtons: Locator;
readonly removeButtons: Locator;
readonly itemNames: Locator;
readonly itemPrices: Locator;
readonly logOutLink: Locator;
readonly menu: Locator;
readonly firstItem: Locator;



    constructor(page: Page) {
        super(page, 'https://www.saucedemo.com/inventory.html');
        this.inventoryItems = page.locator('.inventory_item');
        this.addToCartButtons = page.locator('.btn_inventory');
        this.removeButtons = page.locator('.btn_inventory:has-text("Remove")');  
        this.itemNames = page.locator('.inventory_item_name');
        this.itemPrices = page.locator('.inventory_item_price');
        this.logOutLink = page.locator('#logout_sidebar_link');
        this.menu = page.locator(".bm-menu");
        this.firstItem = page.locator(".inventory_list .inventory_item:first-child");
    }

    async getInventoryItemCount(): Promise<number> {
        return await this.inventoryItems.count();
    }

    async addToCartByName(itemName: string) {
        const item = this.inventoryItems.filter({ hasText: itemName });
        await item.locator('.btn_inventory').click();
    }

    async addToCartByIndex(index: number) {
        await this.addToCartButtons.nth(index).click();
    }

    async removeFromCartByIndex(index: number) {
        await this.removeButtons.nth(index).click();
    } 

    async getSortingOptions(): Promise<string[]> {
        return await this.page
        .locator(".product_sort_container option")
        .allInnerTexts();
    }

    async openItemDetailsByIndex(index: number) {
        await this.itemNames.nth(index).click();
        return new InventoryItemPage(this.page);
    }

}