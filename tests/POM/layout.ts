import { Page, Locator } from "@playwright/test";
import { BasePage } from "./basePage";

export class Layout extends BasePage {
  readonly header: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly menuButton: Locator;
  readonly appLogo: Locator;
  readonly footer: Locator;
  readonly twitterLink: Locator;
  readonly facebookLink: Locator;
  readonly linkedinLink: Locator;
  readonly menuWrapper: Locator;
  
  constructor(page: Page) {
    super(page, "https://www.saucedemo.com/inventory.html");
    this.header = page.locator(".primary_header");
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartLink = page.locator('#shopping_cart_container a');  
    this.menuButton = page.locator("#react-burger-menu-btn"); 
    this.menuWrapper = page.locator(".bm-menu-wrap");
    this.appLogo = page.locator(".app_logo");
    this.footer = page.locator(".footer");
    this.twitterLink = page.locator('[data-test="social-twitter"]');
    this.facebookLink = page.locator('[data-test="social-facebook"]');
    this.linkedinLink = page.locator('[data-test="social-linkedin"]');    
  }

  async getCartBadgeCount(): Promise<number> {
        const text = await this.cartBadge.innerText();
        return text ? Number(text) : 0;
    }

    async isCartBadgeVisible(): Promise<boolean> {
        return await this.cartBadge.isVisible();
    }

    async openCart() {
        await this.cartLink.click();
    }

     async openMenu() {
        await this.menuButton.click();
    }

    async clickTwitterLink() {
        await this.twitterLink.click();
    }

    async clickFacebookLink() {
        await this.facebookLink.click();
    }

    async clickLinkedinLink() {
        await this.linkedinLink.click();
    }

}
