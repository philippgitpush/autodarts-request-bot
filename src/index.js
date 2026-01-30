require('dotenv').config();
const { chromium } = require('playwright');

const USER = process.env.AUTODARTS_USER;
const PASS = process.env.AUTODARTS_PASS;

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const AUTH_URL = 'https://login.autodarts.io/realms/autodarts/protocol/openid-connect/auth?client_id=autodarts-play&redirect_uri=https%3A%2F%2Fplay.autodarts.io%2F&response_type=code&scope=openid';

  try {
    console.log('Logging in...');
    await page.goto(AUTH_URL, { waitUntil: 'domcontentloaded' });
    await page.fill('#username', USER);
    await page.fill('#password', PASS);
    await page.click('#kc-login');

    console.log('Watching for invites...');

    while (true) {
      try {
        const acceptBtn = page.locator('button:has-text("Annehmen")');
        await acceptBtn.waitFor({ state: 'visible', timeout: 0 });
        
        console.log('Invite found. Accepting ...');

        await acceptBtn.click();
        await page.waitForTimeout(2000); 
        
        console.log('Accepted. Resuming watch ...');
        
      } catch (err) {}
    }

  } catch (err) {
    console.error('Fatal error:', err);
  }
})();
