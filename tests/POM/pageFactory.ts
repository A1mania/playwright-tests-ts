import { Page } from '@playwright/test'
import { BasePage } from './basePage';
import { CartPage } from './cartPage';
import { CheckoutInfoPage } from './checkoutInfoPage';
import { LoginPage } from './loginPage';
import { InventoryPage } from './inventoryPage';
import { InventoryItemPage } from './inventoryItemPage';
import { Layout } from './layout'

export class SwagLabs  {
    readonly basePage: BasePage;
    readonly cartPage: CartPage;
    readonly checkoutInfoPage: CheckoutInfoPage;
    readonly loginPage: LoginPage;
    readonly inventoryPage: InventoryPage;
    readonly inventoryItemPage: InventoryItemPage;
    readonly layout: Layout;


constructor (page: Page) {
    this.basePage = new BasePage (page, 'https://www.saucedemo.com');
    this.cartPage = new CartPage(page);
    this.checkoutInfoPage = new CheckoutInfoPage(page);
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
    this.inventoryItemPage = new InventoryItemPage(page);
    this.layout = new Layout(page);
}
}

