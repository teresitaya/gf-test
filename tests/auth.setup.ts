import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('https://voting.mediasetinfinity.mediaset.it/sms.grandefratello.eliminazione.web/index.html');
  
  const accediBtn = await page.getByRole('button', { name: 'Accedi', exact: true });
    if (accediBtn) {
        await accediBtn.click();
    }


  await page.getByPlaceholder('E-mail *').fill('wuplea@UpgradeInc.us');
  await page.getByPlaceholder('Password *').fill('Zelena123');
  await page.getByRole('button', { name: 'Invia' }).click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL('https://voting.mediasetinfinity.mediaset.it/sms.grandefratello.eliminazione.web/index.html');
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  await expect(page.getByText('CHI VUOI SALVARE?')).toBeVisible();
  await expect(page.getByText('CHIARA')).toBeVisible();

  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});