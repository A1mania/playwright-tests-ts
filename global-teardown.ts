import { execSync } from "node:child_process";

async function globalTeardown() {
  const reportDir = "allure-report";
  const resultsDir = "allure-results";

  try {
    execSync(`npx allure generate ./${resultsDir} --clean -o ./${reportDir}`);
  } catch (e) {
    console.error("Failed to generate allure report", e);
  }
}

export default globalTeardown;