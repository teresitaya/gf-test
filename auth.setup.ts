import { expect } from "@playwright/test";
import path from "path";

// Define authFile function to generate a unique storage path for each email
const authFile = (email: string) => path.join(__dirname, `../playwright/.auth/${email.replace(/[@.]/g, "_")}.json`);

export async function authenticateUser(page, email: string, password: string) {
  console.log(`Authenticating user ${email} with password ${password}`);

  await page.goto(process.env.SITE_URL);
  
  await page.waitForTimeout(5000);

  const accediBtn = page.getByRole("button", { name: "Accedi", exact: true });

    if (await accediBtn.isVisible()) {
      await accediBtn.click();
      await page.waitForTimeout(2000);
      await page.waitForSelector("input[name='username']", { timeout: 60000 });
    
      const usernameField = page.locator("input[name='username']").first();
      await usernameField.waitFor({ state: "visible" });
      await usernameField.fill(email);
  
      await page.getByPlaceholder("Password *").fill(password);
      await page.getByRole("button", { name: "Invia" }).click();
    
      await page.waitForURL(process.env.SITE_URL);
      await expect(page.getByText("CHI VUOI SALVARE?")).toBeVisible();
    
      // Save authentication state
      await page.context().storageState({ path: authFile(email) });
    
      console.log(`Authentication state saved to: ${authFile(email)}`);
    } else {
      throw new Error("Accedi button not found or not visible.");
    }
}

