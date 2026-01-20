import { Page, Locator } from "@playwright/test";
import { BasePage } from "./basePage";

export class Checkout1Page extends BasePage {
  readonly firstnameInput: Locator;
  readonly lastnameInput: Locator;
  readonly zipInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page, "https://www.saucedemo.com/inventory.html");
    this.firstnameInput = page.locator("#first-name");
    this.lastnameInput = page.locator("#last-name");
    this.zipInput = page.locator("#postal-code");
    this.continueButton = page.locator("#continue");
    this.cancelButton = page.locator("#cancel");
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async fillFirstName(firstname: string) {
    await this.firstnameInput.fill(firstname);
    return this;
  }
  async fillLastName(lastname: string) {
    await this.lastnameInput.fill(lastname);
    return this;
  }

  async fillZipCode(zip: string) {
    await this.zipInput.fill(zip);
    return this;
  }

  async clickContinueButton() {
    await this.continueButton.click();
  }
  async clickCancelButton() {
    await this.cancelButton.click();
  }
}
