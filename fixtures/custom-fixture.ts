import { test as baseTest } from "@playwright/test";

type MyFixture = {
    testIdGenerator: number;
}

export const test = baseTest.extend<MyFixture>({
    testIdGenerator: async ({ }, use) => {
        const max = Number.MAX_SAFE_INTEGER - 1;
        const randomIndex = Math.floor(Math.random() * max) + 1;
        await use(randomIndex);
    },
});