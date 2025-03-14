import { test, expect, Page, BrowserContext } from '@playwright/test';
const REGISTER_EMAILS = process.env.REGISTER_EMAILS?.split(",") || [];
import path from 'path';

test.describe('Register Account Test', () => {
    let page: Page;
    let context: BrowserContext;

    test.beforeEach(async ({ browser }) => {
        context = await browser.newContext({});
        
        // Mock reCAPTCHA for all tests
        await context.route('**/recaptcha/api2/**', async route => {
            await route.fulfill({
                status: 200,
                body: JSON.stringify({ success: true })
            });
        });
        
        page = await context.newPage();
        await page.goto(process.env.SITE_URL || '');
        await page.waitForTimeout(5000);
        
        // Common navigation to registration form
        const accediBtn = page.getByRole("button", { name: "Accedi", exact: true });
        await expect(accediBtn).toBeVisible();
        await accediBtn.click();
        
        await page.waitForSelector(".gigya-login-form > div:nth-child(3) > div > a", { timeout: 60000 });
        const registerBtn = page.getByRole("button", { name: "Non hai ancora un account? Registrati" });
        await expect(registerBtn).toBeVisible();
        await registerBtn.click();
        await page.waitForTimeout(5000);
    });

    test('Should show error for existing email', async () => {
        // Use an email that's already registered
        const existingEmail = process.env.ALREADY_REGISTERED_EMAILS || '';
        await page.locator("#register-site-login > div:nth-child(1) > div > div > input").fill(existingEmail);
        await page.locator("#register-site-login > div:nth-child(1) > div > div > input").blur();
        
        await page.locator("#password-row > div:nth-child(1) > div > input").fill(process.env.PASSWORD || '');
        await page.locator("#password-row > div:nth-child(2) > div > input").fill(process.env.PASSWORD || '');
        await page.getByRole("button", { name: "Invia" }).click();

        await expect(page.getByText("Questo indirizzo email esiste già")).toBeVisible();
    });

    test('Should show error for invalid email format', async () => {
        // Use an invalid email format
        await page.locator("#register-site-login > div:nth-child(1) > div > div > input").fill("invalid.email");
        await page.locator("#register-site-login > div:nth-child(1) > div > div > input").blur();
        
        await page.locator("#password-row > div:nth-child(1) > div > input").fill(process.env.PASSWORD || '');
        await page.locator("#password-row > div:nth-child(2) > div > input").fill(process.env.PASSWORD || '');
        await page.getByRole("button", { name: "Invia" }).click();

        await expect(page.getByText("L'indirizzo email non è valido")).toBeVisible();
    });

    for (const email of REGISTER_EMAILS) {
        test(`Register account using ${email}`, async () => {
            const usernameField = page.locator("#register-site-login > div:nth-child(1) > div > div > input").first();
            await usernameField.waitFor({ state: "visible" });
            await usernameField.fill(email);
            await usernameField.blur();
        
            await page.locator("#password-row > div:nth-child(1) > div > input").fill(process.env.PASSWORD || '');
            await page.locator("#password-row > div:nth-child(2) > div > input").fill(process.env.PASSWORD || '');

            await page.getByRole("button", { name: "Invia" }).click();

            // Check for error messages
            await expect(page.getByText("Questo indirizzo email esiste già")).not.toBeVisible();
            await expect(page.getByText("L'indirizzo email non è valido")).not.toBeVisible();
            await expect(page.getByText("Sul tuo modulo sono stati rilevati alcuni errori. Riprova")).not.toBeVisible();

            // Continue with profile form only if no errors
            await page.waitForSelector("#gigya-profile-form > div:nth-child(1) > div > h2", { timeout: 60000 });
            
            // fill profile form
            const {randomName, lastName} = {
                    randomName: `Test User ${Math.floor(Math.random() * 1000000)}`,
                    lastName: `Test User ${Math.floor(Math.random() * 1000000)}`
            };

            await page.locator("#gigya-textbox-34337195926840780").fill(randomName);
            await page.locator("#gigya-textbox-28375207087360484").fill(lastName);

            //select
            await page.locator("#gigya-dropdown-136494179586045920").selectOption("Abruzzo");

            // radio
            await page.locator("#gigya-multiChoice-1-106637341396679780").selectOption("f");

            // checkbox
            await page.locator("#gigya-checkbox-1-106637341396679780").check();

            //day select
            await page.locator("#gigya-dropdown-90068907958100130").selectOption("1");

            //month select
            await page.locator("#gigya-dropdown-90068907958100130").selectOption("February");

            //year select
            await page.locator("#gigya-dropdown-90068907958100130").selectOption("1990");

            // consent 
            await page.locator("#gigya-multiChoice-1-32421980539696364").check();
            await page.locator("#gigya-multiChoice-1-23359281474726108").check();
            await page.locator("#gigya-multiChoice-1-46256265642570990").check();
            
            // save
            await page.getByRole("button", { name: "Invia" }).click();
            await page.waitForTimeout(5000);
            
            await expect(page.locator("#gigya-verification-sent-screen > div:nth-child(1) > label")).toBeVisible();
            await expect(page.getByText(`Ti è stata inviata un'e-mail di verifica all'indirizzo ${email} con un link per verificare il tuo account.`)).toBeVisible();
    
            await page.getByRole("button", { name: "OK" }).click();
            await page.waitForTimeout(5000);
        });
    }

    test.afterEach(async () => {
        await context.close();
    });
});