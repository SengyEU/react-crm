import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  console.log('Navigating to firm list...');
  await page.goto('https://localhost:9000/', { waitUntil: 'networkidle2' });
  
  console.log('Waiting for Kontakty button...');
  await page.waitForSelector('button', { timeout: 5000 });
  
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text === 'Kontakty') {
      console.log('Clicking Kontakty...');
      await btn.click();
      break;
    }
  }

  await page.waitForTimeout(2000);
  console.log('Current URL:', page.url());
  
  await browser.close();
})();
