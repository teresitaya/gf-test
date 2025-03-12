import { test, expect } from '@playwright/test';
import { VOTTING_EMAILS } from '../emails';
import path from 'path';

test.describe('Voting Test', () => {
  for (const email of VOTTING_EMAILS) {
    test(`Vote for Chiara using ${email}`, async ({ browser }) => {
      console.log(`Voting for Chiara using ${email}`);
      const context = await browser.newContext({
        storageState: path.join(__dirname, `../playwright/.auth/${email.replace(/[@.]/g, '_')}.json`),
      });

      const page = await context.newPage();
      await page.goto('https://voting.mediasetinfinity.mediaset.it/sms.grandefratello.eliminazione.web/index.html');

      for (let i = 0; i < 3; i++) {
        await page.getByText('CHIARA').click();
        await page.getByRole('button', { name: 'VOTA' }).click();
        await page.waitForTimeout(4000);

        if (i < 2) {
          await page.getByRole('button', { name: 'Vota ancora' }).click();
        }
      }

      await page.waitForTimeout(4000);
      await expect(page.getByText('Hai utilizzato tutti i voti esprimibili per questa sessione.')).toBeVisible();

      console.log(`Voting completed for ${email}`);

      await context.close();
    });
  }
});
