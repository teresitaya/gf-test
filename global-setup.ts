import { chromium } from '@playwright/test';
import { authenticateUser } from './auth.setup';
import path from 'path';

// Environment variable for the password
// Load voting emails from the .env file
const VOTTING_EMAILS = process.env.VOTTING_EMAILS?.split(",") || [];
const PASSWORD = process.env.PASSWORD || '';

async function globalSetup() {
  for (const email of VOTTING_EMAILS) {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Authenticate the user using the authenticateUser function
    await authenticateUser(page, email, PASSWORD);

    // Save the storage state for the authenticated user
    const storagePath = path.join(__dirname, `playwright/.auth/${email.replace(/[@.]/g, "_")}.json`);
    await context.storageState({ path: storagePath });

    console.log(`Authentication state saved for ${email}`);

    // Close the browser after saving the storage state
    await browser.close();
  }
}

export default globalSetup;
