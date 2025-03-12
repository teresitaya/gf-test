import { expect } from "@playwright/test";
import path from "path";

// Define authFile function to generate a unique storage path for each email
const authFile = (email: string) => path.join(__dirname, `../playwright/.auth/${email.replace(/[@.]/g, "_")}.json`);

export async function authenticateUser(page, email: string, password: string) {
  console.log(`Authenticating user ${email} with password ${password}`);

  await page.goto("https://voting.mediasetinfinity.mediaset.it/sms.grandefratello.eliminazione.web/index.html");

  const accediBtn = page.getByRole("button", { name: "Accedi", exact: true });
  if (await accediBtn.isVisible()) {
    await accediBtn.click();
  }

  await page.waitForTimeout(5000);

  await page.getByPlaceholder("E-mail *").fill(email);
  await page.getByPlaceholder("Password *").fill(password);
  await page.getByRole("button", { name: "Invia" }).click();

  await page.waitForURL("https://voting.mediasetinfinity.mediaset.it/sms.grandefratello.eliminazione.web/index.html");
  await expect(page.getByText("CHI VUOI SALVARE?")).toBeVisible();
  await expect(page.getByText("CHIARA")).toBeVisible();

  // Save authentication state
  await page.context().storageState({ path: authFile(email) });

  console.log(`Authentication state saved to: ${authFile(email)}`);
}
