import { test as baseTest } from "@playwright/test";
import { SwagLabs } from "../tests/POM/pageFactory";

type MyFixture = {
    testIdGenerator: number;
    swagLabs: SwagLabs;
}

export const test = baseTest.extend<MyFixture>({
    testIdGenerator: async ({ }, use) => {
        const max = Number.MAX_SAFE_INTEGER - 1;
        const randomIndex = Math.floor(Math.random() * max) + 1;
        await use(randomIndex);
    },

    swagLabs: async ({ page }, use) => {
        await use(new SwagLabs(page));
    }

});

