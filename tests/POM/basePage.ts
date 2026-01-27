import { Page } from '@playwright/test';

export class BasePage {
   readonly page: Page;
   readonly url: string;

   constructor(page: Page, url: string) {
      this.page = page;
      this.url = url;
   }

    async navigate() {
      await this.page.goto(this.url);
    }

    async getTitle() {
        return await this.page.title();
    }

    async clickElement(selector: string) {
        await this.page.click(selector);
    }

    async fillInput(selector: string, value: string) {
        await this.page.fill(selector, value);
        return this;
    }

    async getText(selector: string): Promise<string | null> {
        return await this.page.textContent(selector);
    }
}