import { test, expect } from '@playwright/test';

test('vota chiara', async ({ page }) => {
  await page.goto('https://voting.mediasetinfinity.mediaset.it/sms.grandefratello.eliminazione.web/index.html');

  // Click the get started link.
  for(let i = 0; i < 3; i++) {
    await page.getByText('CHIARA').click();
    await page.getByRole('button', { name: 'VOTA' }).click();
    await page.waitForTimeout(5000);
    if(i<2) {
      await page.getByRole('button', { name: 'Vota ancora' }).click();
    }
  }

  await page.waitForTimeout(4000);

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByText('Hai utilizzato tutti i voti esprimibili per questa sessione.')).toBeVisible();
});
