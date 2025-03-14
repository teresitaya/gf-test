import { test, expect } from '@playwright/test';
const REGISTER_EMAILS = process.env.REGISTER_EMAILS?.split(",") || [];
import path from 'path';

test.describe('Register Account Test', () => {
    for (const email of REGISTER_EMAILS) {
        test(`Register account using ${email}`, async ({ browser }) => {
            console.log(`Registering account using ${email}`);
            const context = await browser.newContext({});
            const page = await context.newPage();
        
            await page.goto(process.env.SITE_URL || '');
  
            await page.waitForTimeout(5000);
          
            const accediBtn = page.getByRole("button", { name: "Accedi", exact: true });

            if (await accediBtn.isVisible()) {
                await accediBtn.click();
                await page.waitForTimeout(2000);

                if(await page.getByRole("link", { name: "Non hai ancora un account? Registrati" }).isVisible()) {
                await page.getByRole("link", { name: "Non hai ancora un account? Registrati" }).click();
                await page.waitForTimeout(2000);

                await page.waitForSelector("input[name='username']", { timeout: 60000 });
    
                const usernameField = page.locator("input[name='username']").first();
                await usernameField.waitFor({ state: "visible" });
                await usernameField.fill(email);
            
                await page.getByPlaceholder("Password *").fill(process.env.PASSWORD || '');
                await page.getByPlaceholder("Conferma password *").fill(process.env.PASSWORD || '');

                await page.getByRole("button", { name: "Invia" }).click();
                }else{
                    throw new Error("Non hai ancora un account? Registrati link not found or not visible.");
                }
            }else{
                throw new Error("Accedi button not found or not visible.");
            }
          
        });
    }


    

});