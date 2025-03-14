import { test, expect } from '@playwright/test';
const VOTTING_EMAILS = process.env.VOTTING_EMAILS?.split(",") || [];
import path from 'path';

test.describe('Voting Test', () => {
  for (const email of VOTTING_EMAILS) {
    test(`Vote for Chiara using ${email}`, async ({ browser }) => {
      console.log(`Voting for Chiara using ${email}`);
      const authFile = path.join(__dirname, `../playwright/.auth/${email.replace(/[@.]/g, '_')}.json`);
      
      try {
        const context = await browser.newContext({
          storageState: authFile,
        });
        
        console.log(`Successfully loaded auth state from: ${authFile}`);
        const page = await context.newPage();
        
        // Navigate and wait for the page to be fully loaded
        await page.goto(process.env.SITE_URL || '');
        await page.waitForLoadState('networkidle');
        
        // Verify we're actually logged in
        await page.getByText("CHI VUOI SALVARE?").waitFor({ state: 'visible' });
        await page.getByText("CHIARA").waitFor({ state: 'visible' });
        
        let i = 0;
        while (i < 3) {
          await page.getByText("CHIARA").click();
          await page.getByRole('button', { name: 'VOTA' }).click();
          await page.waitForTimeout(6000);
        
          const voteAgainButton = await page.getByRole('button', { name: 'Vota ancora' }).isVisible();
        
          if (voteAgainButton) {
            if (i < 2) {
              await page.getByRole('button', { name: 'Vota ancora' }).click();
            }
            await page.waitForTimeout(4000);
            i++;
        
          } else {
            const message = await page.getByText('Hai utilizzato tutti i voti esprimibili per questa sessione.').isVisible();
            if (message) {
              console.log(`Voting completed for ${email}`);
              break;
            } else {
              await expect(page.getByText('Attenzione!')).toBeVisible();
              console.log(`Account ${email} already voted`);
              break;
            }
          }
        }
        
        await context.close();
      } catch (error) {
        console.error(`Failed to run test for ${email}:`, error);
        throw error;
      }
    });
  }
});
