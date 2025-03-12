import { chromium } from '@playwright/test';
import { authenticateUser } from './auth.setup';
import { VOTTING_EMAILS } from './emails';

const PASSWORD = 'Zelena123';

async function globalSetup() {
  for (const email of VOTTING_EMAILS) {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await authenticateUser(page, email, PASSWORD);

    await browser.close();
  }
}

export default globalSetup;
