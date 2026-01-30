require('dotenv').config();
const { chromium } = require('playwright');

const USER = process.env.AUTODARTS_USER;
const PASS = process.env.AUTODARTS_PASS;

async function runAutomation() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const AUTH_URL = 'https://login.autodarts.io/realms/autodarts/protocol/openid-connect/auth?client_id=autodarts-play&redirect_uri=https%3A%2F%2Fplay.autodarts.io%2F&response_type=code&scope=openid';

  let active = true;

  const restartTimer = setTimeout(() => {
    console.log('24h reached. Restarting session...');
    active = false;
  }, 24 * 60 * 60 * 1000);

  try {
    console.log('Logging in...');
    await page.goto(AUTH_URL, { waitUntil: 'domcontentloaded' });
    await page.fill('#username', USER);
    await page.fill('#password', PASS);
    await page.click('#kc-login');

    console.log('Watching for invites...');

    while (active) {
      try {
        const accept_button = page.locator('button:has-text("Annehmen")');
        await accept_button.waitFor({ state: 'visible', timeout: 5000 });
        
        console.log('Invite found. Accepting ...');

        await accept_button.click();
        await page.waitForTimeout(2000); 

        console.log('Accepted. Resuming watch ...');
      } catch (err) { /* ignore */ }
    }
  } catch (err) {
    console.error('Fatal error:', err);
  } finally {
    clearTimeout(restartTimer);
    await browser.close();
    console.log('Browser closed. Re-launching...');
    runAutomation();
  }
}

runAutomation();
